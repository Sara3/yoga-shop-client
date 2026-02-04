import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";
import { getUserTimeZone, Type } from "@dev-agents/sdk-shared";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { and, eq } from "drizzle-orm";
import {
  browse_classes,
  browse_products,
  get_class_full,
  get_class_preview,
} from "@tools/2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop";
import type * as schema from "./schema";
import { cachedClasses, cachedProducts, purchases, walletConfig } from "./schema";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Cache TTL: 15 minutes
const CACHE_TTL_MS = 15 * 60 * 1000;

// Type definitions for yoga shop data
interface YogaClass {
  id: string;
  title: string;
  price: string;
}

interface YogaProduct {
  id: string;
  name: string;
  price_display: string;
}

interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  payTo: string;
  asset: string;
  extra: { name: string; version: string };
}

/**
 * Get all yoga classes with caching
 */
export const getClasses = serverFunction({
  description: "Gets all available yoga classes with caching",
  params: Type.Object({
    forceRefresh: Type.Optional(Type.Boolean()),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { forceRefresh }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getClasses: fetching classes for user", user.email);

    // Check cache unless forcing refresh
    if (!forceRefresh) {
      const cached = await db
        .select()
        .from(cachedClasses)
        .where(eq(cachedClasses.owner, user.email))
        .limit(1);

      const entry = cached[0];
      if (entry && Date.now() - entry.fetchedAt.getTime() < CACHE_TTL_MS) {
        console.log("getClasses: returning cached classes", entry.classes.length);
        return { classes: entry.classes, fromCache: true };
      }
    }

    // Fetch fresh data from tool
    console.log("getClasses: fetching fresh data from tool");
    const result = await browse_classes(sdk, {});
    console.log("getClasses: tool result", JSON.stringify(result));

    // Parse the result - it comes as a text content
    let classes: YogaClass[] = [];
    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        classes = parsed.classes || [];
      }
    }

    console.log("getClasses: parsed classes", classes.length);

    // Upsert cache
    const existingCache = await db
      .select()
      .from(cachedClasses)
      .where(eq(cachedClasses.owner, user.email))
      .limit(1);

    if (existingCache[0]) {
      await db
        .update(cachedClasses)
        .set({ classes, fetchedAt: dayjs().tz(getUserTimeZone()).toDate() })
        .where(eq(cachedClasses.owner, user.email));
    } else {
      await db.insert(cachedClasses).values({
        owner: user.email,
        classes,
        fetchedAt: dayjs().tz(getUserTimeZone()).toDate(),
      });
    }

    return { classes, fromCache: false };
  },
});

/**
 * Get all yoga products with caching
 */
export const getProducts = serverFunction({
  description: "Gets all available yoga products (study materials) with caching",
  params: Type.Object({
    forceRefresh: Type.Optional(Type.Boolean()),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { forceRefresh }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getProducts: fetching products for user", user.email);

    // Check cache unless forcing refresh
    if (!forceRefresh) {
      const cached = await db
        .select()
        .from(cachedProducts)
        .where(eq(cachedProducts.owner, user.email))
        .limit(1);

      const entry = cached[0];
      if (entry && Date.now() - entry.fetchedAt.getTime() < CACHE_TTL_MS) {
        console.log("getProducts: returning cached products", entry.products.length);
        return { products: entry.products, fromCache: true };
      }
    }

    // Fetch fresh data from tool
    console.log("getProducts: fetching fresh data from tool");
    const result = await browse_products(sdk, {});
    console.log("getProducts: tool result", JSON.stringify(result));

    // Parse the result
    let products: YogaProduct[] = [];
    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        products = parsed.products || [];
      }
    }

    console.log("getProducts: parsed products", products.length);

    // Upsert cache
    const existingCache = await db
      .select()
      .from(cachedProducts)
      .where(eq(cachedProducts.owner, user.email))
      .limit(1);

    if (existingCache[0]) {
      await db
        .update(cachedProducts)
        .set({ products, fetchedAt: dayjs().tz(getUserTimeZone()).toDate() })
        .where(eq(cachedProducts.owner, user.email));
    } else {
      await db.insert(cachedProducts).values({
        owner: user.email,
        products,
        fetchedAt: dayjs().tz(getUserTimeZone()).toDate(),
      });
    }

    return { products, fromCache: false };
  },
});

/**
 * Get user's purchased classes
 */
export const getPurchases = serverFunction({
  description: "Gets all purchased yoga classes for the current user",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getPurchases: fetching purchases for user", user.email);

    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.owner, user.email));

    console.log("getPurchases: found", userPurchases.length, "purchases");

    return {
      purchases: userPurchases.map((p) => ({
        id: p.id,
        classId: p.classId,
        classTitle: p.classTitle,
        price: p.price,
        contentUrl: p.contentUrl,
        purchasedAt: p.purchasedAt.toISOString(),
      })),
    };
  },
});

/**
 * Get class preview URL
 */
export const getClassPreview = serverFunction({
  description: "Gets the free preview URL for a yoga class",
  params: Type.Object({
    classId: Type.String({ description: "The class ID to get preview for" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { classId }) => {
    console.log("getClassPreview: fetching preview for class", classId);

    const result = await get_class_preview(sdk, { classId });
    console.log("getClassPreview: tool result", JSON.stringify(result));

    // Parse the result
    let previewUrl = "";
    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        previewUrl = parsed.preview_url || "";
      }
    }

    return { previewUrl };
  },
});

/**
 * Get payment requirements for a class
 */
export const getPaymentRequirements = serverFunction({
  description: "Gets the payment requirements for unlocking a yoga class",
  params: Type.Object({
    classId: Type.String({ description: "The class ID to get payment info for" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { classId }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getPaymentRequirements: checking class", classId, "for user", user.email);

    // First check if already purchased
    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.owner, user.email), eq(purchases.classId, classId)))
      .limit(1);

    if (existingPurchase[0]) {
      console.log("getPaymentRequirements: class already purchased");
      return {
        alreadyPurchased: true,
        contentUrl: existingPurchase[0].contentUrl,
      };
    }

    // Get payment requirements from the tool
    console.log("getPaymentRequirements: fetching payment requirements from tool");
    const result = await get_class_full(sdk, { classId });
    console.log("getPaymentRequirements: tool result", JSON.stringify(result));

    // Parse the result to get payment requirements
    let paymentRequirements: PaymentRequirement | null = null;
    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        if (parsed.error) {
          const errorData = JSON.parse(parsed.error);
          if (errorData.accepts && errorData.accepts.length > 0) {
            paymentRequirements = errorData.accepts[0];
          }
        }
      }
    }

    if (!paymentRequirements) {
      console.log("getPaymentRequirements: no payment requirements found");
      return { error: "Could not get payment requirements" };
    }

    return {
      alreadyPurchased: false,
      paymentRequirements: {
        scheme: paymentRequirements.scheme,
        network: paymentRequirements.network,
        amount: paymentRequirements.maxAmountRequired,
        resource: paymentRequirements.resource,
        description: paymentRequirements.description,
        payTo: paymentRequirements.payTo,
        asset: paymentRequirements.asset,
        assetName: paymentRequirements.extra?.name || "USDC",
      },
    };
  },
});

/**
 * Sign x402 payment server-side using wallet config
 * Tries both x402 library and manual signing for comparison
 */
async function signX402PaymentServer(
  sdk: ServerSdk,
  requirements: PaymentRequirement
): Promise<string> {
  const db = sdk.db<typeof schema>();
  const user = sdk.getUser();

  // Get wallet config
  const config = await db
    .select()
    .from(walletConfig)
    .where(eq(walletConfig.owner, user.email))
    .limit(1);

  if (!config[0]) {
    throw new Error("Wallet not configured. Please set up your wallet in settings.");
  }

  const privateKey = config[0].privateKey;
  console.log("signX402PaymentServer: wallet address from private key");

  // Dynamic imports to avoid build issues
  const { privateKeyToAccount } = await import("viem/accounts");
  const { createWalletClient, http } = await import("viem");
  const { base } = await import("viem/chains");
  const { createPaymentHeader } = await import("x402/client");

  // Create account from private key
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const walletAddress = account.address;
  console.log("signX402PaymentServer: wallet address", walletAddress);
  console.log("signX402PaymentServer: chain being used", base.name, base.id);

  // Determine which chain to use based on network in requirements
  const isTestnet = requirements.network === "base-sepolia";
  const { baseSepolia } = await import("viem/chains");
  const chain = isTestnet ? baseSepolia : base;

  console.log("signX402PaymentServer: using network", requirements.network);
  console.log("signX402PaymentServer: chain", chain.name, chain.id);

  // Create wallet client
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  // Build payment requirements in x402 format
  const paymentRequirements = {
    scheme: requirements.scheme as "exact",
    network: requirements.network as "base",
    maxAmountRequired: requirements.maxAmountRequired,
    resource: requirements.resource,
    description: requirements.description,
    mimeType: requirements.mimeType || "",
    payTo: requirements.payTo as `0x${string}`,
    maxTimeoutSeconds: requirements.maxTimeoutSeconds || 60,
    asset: requirements.asset as `0x${string}`,
    outputSchema: requirements.outputSchema || {
      input: {
        type: "http",
        method: "GET",
        discoverable: true,
      },
      output: undefined,
    },
    extra: requirements.extra || { name: "USD Coin", version: "2" },
  };

  console.log("signX402PaymentServer: payment requirements for x402 lib", JSON.stringify(paymentRequirements));

  // Sign the payment using x402 library
  const signedPayment = await createPaymentHeader(walletClient as any, 1, paymentRequirements);
  console.log("signX402PaymentServer: x402 payment header length", signedPayment.length);
  console.log("signX402PaymentServer: x402 payment header preview", signedPayment.substring(0, 100) + "...");

  // Decode and log for debugging
  try {
    const padded = signedPayment + '='.repeat((4 - signedPayment.length % 4) % 4);
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    console.log("signX402PaymentServer: x402 decoded payload", decoded);
  } catch (e: any) {
    console.log("signX402PaymentServer: could not decode x402 payload", e.message);
  }

  return signedPayment;
}

/**
 * Unlock a class - fully automatic, zero-click experience
 */
export const unlockClass = serverFunction({
  description: "Unlocks a yoga class automatically using server-side payment signing",
  params: Type.Object({
    classId: Type.String({ description: "The class ID to unlock" }),
    classTitle: Type.String({ description: "The class title" }),
    price: Type.String({ description: "The price" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { classId, classTitle, price }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("unlockClass: unlocking class", classId, "for user", user.email);

    // Check if already purchased
    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.owner, user.email), eq(purchases.classId, classId)))
      .limit(1);

    if (existingPurchase[0]) {
      console.log("unlockClass: class already purchased");
      return {
        success: true,
        alreadyPurchased: true,
        contentUrl: existingPurchase[0].contentUrl,
      };
    }

    // Get payment requirements
    console.log("unlockClass: fetching payment requirements");
    const paymentReqResult = await get_class_full(sdk, { classId });
    console.log("unlockClass: payment requirements tool result", JSON.stringify(paymentReqResult));

    // Parse payment requirements
    let paymentRequirements: PaymentRequirement | null = null;
    if (paymentReqResult && paymentReqResult.content && Array.isArray(paymentReqResult.content)) {
      const textContent = paymentReqResult.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        if (parsed.error) {
          const errorData = typeof parsed.error === "string" ? JSON.parse(parsed.error) : parsed.error;
          if (errorData.accepts && errorData.accepts.length > 0) {
            paymentRequirements = errorData.accepts[0];
          }
        }
      }
    }

    if (!paymentRequirements) {
      console.log("unlockClass: no payment requirements found");
      return { success: false, error: "Could not get payment requirements" };
    }

    console.log("unlockClass: payment requirements", JSON.stringify(paymentRequirements));

    // Sign payment server-side
    let signedPayment: string;
    try {
      signedPayment = await signX402PaymentServer(sdk, paymentRequirements);
      console.log("unlockClass: signed payment header length", signedPayment.length);
      console.log("unlockClass: signed payment header preview", signedPayment.substring(0, 50) + "...");
    } catch (error: any) {
      console.error("unlockClass: failed to sign payment", error);
      return { success: false, error: error.message || "Failed to sign payment" };
    }

    // Get the full content with signed payment
    console.log("unlockClass: fetching full content with signed payment");
    const result = await get_class_full(sdk, { classId, xPayment: signedPayment });
    console.log("unlockClass: tool result status", result.status);
    console.log("unlockClass: tool result isError", result.isError);
    console.log("unlockClass: parsed response", JSON.stringify(result));

    // Parse the result
    let contentUrl = "";
    let txHash = "";
    let errorMessage = "";

    if (result && result.content && Array.isArray(result.content)) {
      const textContent = result.content.find((c: { type: string }) => c.type === "text");
      if (textContent && textContent.text) {
        const parsed = JSON.parse(textContent.text);
        
        // Check for errors
        if (parsed.error) {
          const errorData = typeof parsed.error === "string" ? JSON.parse(parsed.error) : parsed.error;
          console.log("unlockClass: payment error type", typeof errorData);
          console.log("unlockClass: parsed error data", JSON.stringify(errorData));
          errorMessage = errorData.message || errorData.error || parsed.error;
          console.log("unlockClass: error is plain string", typeof parsed.error === "string");
          console.log("unlockClass: final error message", errorMessage);
        } else {
          contentUrl = parsed.content_url || "";
          txHash = parsed.tx_hash || "";
        }
      }
    }

    if (errorMessage) {
      console.log("unlockClass: payment failed with error", errorMessage);
      // Provide more context for x402 payment errors
      if (errorMessage === "Invalid payment") {
        console.log("unlockClass: x402 payment was rejected by the yoga shop facilitator");
        console.log("unlockClass: This may be a facilitator configuration issue");
        return { 
          success: false, 
          error: "Payment verification failed. The yoga shop's payment system may be temporarily unavailable. Please try again later.",
          details: "x402 payment signature was valid but rejected by the facilitator"
        };
      }
      return { success: false, error: errorMessage };
    }

    if (!contentUrl) {
      console.log("unlockClass: failed to get content URL");
      return { success: false, error: "Failed to unlock content" };
    }

    // Store the purchase
    await db.insert(purchases).values({
      owner: user.email,
      classId,
      classTitle,
      price,
      contentUrl,
      txHash,
      xPayment: signedPayment,
      purchasedAt: dayjs().tz(getUserTimeZone()).toDate(),
    });

    console.log("unlockClass: purchase stored successfully");

    return {
      success: true,
      alreadyPurchased: false,
      contentUrl,
      txHash,
    };
  },
});

/**
 * Get content for a purchased class
 */
export const getClassContent = serverFunction({
  description: "Gets the full content URL for a purchased yoga class",
  params: Type.Object({
    classId: Type.String({ description: "The class ID to get content for" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { classId }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getClassContent: fetching content for class", classId, "user", user.email);

    const purchase = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.owner, user.email), eq(purchases.classId, classId)))
      .limit(1);

    if (!purchase[0]) {
      console.log("getClassContent: class not purchased");
      return { error: "Class not purchased", purchased: false };
    }

    console.log("getClassContent: returning content URL");
    return {
      purchased: true,
      contentUrl: purchase[0].contentUrl,
      classTitle: purchase[0].classTitle,
      purchasedAt: purchase[0].purchasedAt.toISOString(),
    };
  },
});

/**
 * Get wallet configuration for the current user
 */
export const getWalletConfig = serverFunction({
  description: "Gets the wallet configuration for the current user",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("getWalletConfig: fetching config for user", user.email);

    const config = await db
      .select()
      .from(walletConfig)
      .where(eq(walletConfig.owner, user.email))
      .limit(1);

    if (!config[0]) {
      return {
        hasPrivateKey: false,
        privateKey: null,
        address: null,
        balance: null,
        usdcBalance: null,
      };
    }

    // Return masked private key for display (show first 6 and last 4 chars)
    const pk = config[0].privateKey;
    const masked = pk.length > 10 
      ? `${pk.substring(0, 6)}...${pk.substring(pk.length - 4)}`
      : "***";

    // Get wallet address and balance
    try {
      const { privateKeyToAccount } = await import("viem/accounts");
      const { createPublicClient, http, formatEther, formatUnits } = await import("viem");
      const { base } = await import("viem/chains");
      
      type Address = `0x${string}`;
      
      // Create account from private key to get address
      const account = privateKeyToAccount(pk as `0x${string}`);
      const walletAddress = account.address;
      
      // Create public client to check balance
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });
      
      // Get ETH balance
      const ethBalance = await publicClient.getBalance({ address: walletAddress });
      const balanceInEth = formatEther(ethBalance);
      
      // Get USDC balance (USDC on Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
      const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address;
      let usdcBalance = "0";
      try {
        // ERC20 balanceOf(address) -> uint256
        const usdcBalanceRaw = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: [
            {
              constant: true,
              inputs: [{ name: "_owner", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "balance", type: "uint256" }],
              type: "function",
            },
          ] as const,
          functionName: "balanceOf",
          args: [walletAddress],
        });
        // USDC has 6 decimals
        usdcBalance = formatUnits(usdcBalanceRaw as bigint, 6);
      } catch (e: any) {
        console.error("getWalletConfig: error getting USDC balance", e);
        console.error("getWalletConfig: USDC balance error details", e.message);
      }
      
      console.log("getWalletConfig: wallet address", walletAddress);
      console.log("getWalletConfig: ETH balance", balanceInEth);
      console.log("getWalletConfig: USDC balance", usdcBalance);
      
      return {
        hasPrivateKey: true,
        privateKey: masked,
        address: walletAddress,
        balance: balanceInEth,
        usdcBalance: usdcBalance,
      };
    } catch (error: any) {
      console.error("getWalletConfig: error getting wallet info", error);
      return {
        hasPrivateKey: true,
        privateKey: masked,
        address: null,
        balance: null,
        usdcBalance: null,
        error: error.message || "Failed to get wallet info",
      };
    }
  },
});

/**
 * Set wallet private key for the current user
 */
export const setWalletConfig = serverFunction({
  description: "Sets the wallet private key for automatic payment signing",
  params: Type.Object({
    privateKey: Type.String({ description: "Wallet private key (must start with 0x)" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { privateKey }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();
    console.log("setWalletConfig: setting config for user", user.email);
    console.log("setWalletConfig: private key length (before normalization)", privateKey.length);
    console.log("setWalletConfig: private key starts with 0x", privateKey.startsWith("0x"));

    // Normalize private key - add 0x prefix if missing
    let normalizedKey = privateKey.trim();
    if (!normalizedKey.startsWith("0x")) {
      console.log("setWalletConfig: adding 0x prefix to private key");
      normalizedKey = "0x" + normalizedKey;
    }

    console.log("setWalletConfig: normalized private key length", normalizedKey.length);

    // Validate private key format (should be 0x + 64 hex characters = 66 total)
    if (normalizedKey.length !== 66) {
      console.log("setWalletConfig: validation failed - invalid length", normalizedKey.length);
      return { success: false, error: `Invalid private key format. Expected 64 hex characters (with or without 0x prefix), got ${normalizedKey.length - 2} characters.` };
    }

    // Validate it's valid hex
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) {
      console.log("setWalletConfig: validation failed - not valid hex");
      return { success: false, error: "Invalid private key format. Must be a valid hexadecimal string." };
    }

    const existing = await db
      .select()
      .from(walletConfig)
      .where(eq(walletConfig.owner, user.email))
      .limit(1);

    console.log("setWalletConfig: existing config found", !!existing[0]);

    const configData = {
      owner: user.email,
      privateKey: normalizedKey,
      updatedAt: dayjs().tz(getUserTimeZone()).toDate(),
    };

    try {
      if (existing[0]) {
        console.log("setWalletConfig: updating existing config, id:", existing[0].id);
        await db
          .update(walletConfig)
          .set(configData)
          .where(eq(walletConfig.owner, user.email));
        console.log("setWalletConfig: update completed");
      } else {
        console.log("setWalletConfig: inserting new config");
        await db.insert(walletConfig).values(configData);
        console.log("setWalletConfig: insert completed");
      }

      // Verify it was saved
      const verify = await db
        .select()
        .from(walletConfig)
        .where(eq(walletConfig.owner, user.email))
        .limit(1);
      
      console.log("setWalletConfig: verification - config saved", !!verify[0]);
      console.log("setWalletConfig: verification - key length", verify[0]?.privateKey?.length);
      console.log("setWalletConfig: verification - owner", verify[0]?.owner);

      if (!verify[0]) {
        console.error("setWalletConfig: CRITICAL - config was not saved after insert/update!");
        return { success: false, error: "Failed to save wallet configuration - data was not persisted" };
      }

      console.log("setWalletConfig: config updated successfully");
      return { success: true };
    } catch (error: any) {
      console.error("setWalletConfig: error saving config", error);
      console.error("setWalletConfig: error stack", error.stack);
      return { success: false, error: error.message || "Failed to save wallet configuration" };
    }
  },
});
