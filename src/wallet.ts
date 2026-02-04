// Wallet connection utilities for x402 payments
import { createWalletClient, custom, formatUnits, parseUnits, type LocalAccount } from "viem";
import type { Address } from "viem";
import { baseSepolia } from "viem/chains";
import { createPaymentHeader } from "x402/client";
import type { PaymentRequirements } from "x402/types";

export type { Address };

// Base Sepolia network configuration
export const BASE_SEPOLIA_CHAIN_ID = BigInt(84532);
export const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org";

// Check if MetaMask or other wallet is available
export function isWalletAvailable(): boolean {
  return typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined";
}

// Get wallet client
export function getWalletClient() {
  if (!isWalletAvailable()) {
    throw new Error("No wallet found. Please install MetaMask or another Ethereum wallet.");
  }

  return createWalletClient({
    chain: baseSepolia,
    transport: custom((window as any).ethereum),
  });
}

// Connect to wallet
export async function connectWallet(): Promise<Address> {
  if (!isWalletAvailable()) {
    throw new Error("No wallet found. Please install MetaMask or another Ethereum wallet.");
  }

  const ethereum = (window as any).ethereum;
  
  try {
    // Request account access
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please unlock your wallet.");
    }

    return accounts[0] as Address;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Wallet connection rejected. Please connect your wallet to continue.");
    }
    throw error;
  }
}

// Switch to Base Sepolia network
export async function switchToBaseSepolia(): Promise<void> {
  if (!isWalletAvailable()) {
    throw new Error("No wallet found. Please install MetaMask or another Ethereum wallet.");
  }

  const ethereum = (window as any).ethereum;

  try {
    // Try to switch to Base Sepolia
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    // If the chain doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
              chainName: "Base Sepolia",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [BASE_SEPOLIA_RPC_URL],
              blockExplorerUrls: ["https://sepolia-explorer.base.org"],
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add Base Sepolia network. Please add it manually in your wallet.");
      }
    } else {
      throw switchError;
    }
  }
}

// Get current network
export async function getCurrentNetwork(): Promise<bigint | null> {
  if (!isWalletAvailable()) {
    return null;
  }

  const ethereum = (window as any).ethereum;
  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    return BigInt(chainId);
  } catch {
    return null;
  }
}

// Format amount from wei/smallest unit to readable format
export function formatAmount(amount: string, decimals: number = 6): string {
  try {
    const amountBigInt = BigInt(amount);
    const formatted = formatUnits(amountBigInt, decimals);
    return formatted;
  } catch {
    return amount;
  }
}

// Parse amount to wei/smallest unit
export function parseAmount(amount: string, decimals: number = 6): bigint {
  return parseUnits(amount, decimals);
}

// Disconnect wallet (clears local state - MetaMask doesn't support programmatic disconnect)
// Note: This only clears our app's state. The wallet remains connected to the site.
export function disconnectWallet(): void {
  // MetaMask doesn't provide a way to programmatically disconnect
  // We just clear our local state. The user can disconnect manually in MetaMask.
  // This function is here for consistency with the connect/disconnect pattern.
}

// Listen for account changes
export function onAccountsChanged(callback: (accounts: Address[]) => void): () => void {
  if (!isWalletAvailable()) {
    return () => {}; // Return no-op cleanup function
  }

  const ethereum = (window as any).ethereum;
  
  // Add listener
  const handler = (accounts: string[]) => {
    callback(accounts.map((acc) => acc as Address));
  };
  
  ethereum.on("accountsChanged", handler);

  // Return cleanup function
  return () => {
    ethereum.removeListener("accountsChanged", handler);
  };
}

// Listen for chain changes
export function onChainChanged(callback: (chainId: bigint) => void): () => void {
  if (!isWalletAvailable()) {
    return () => {}; // Return no-op cleanup function
  }

  const ethereum = (window as any).ethereum;
  
  // Add listener
  ethereum.on("chainChanged", (chainId: string) => {
    callback(BigInt(chainId));
  });

  // Return cleanup function
  return () => {
    ethereum.removeListener("chainChanged", callback);
  };
}

/**
 * Sign an x402 payment using EIP-712
 * Creates a payment payload that can be sent as the X-PAYMENT header
 */
export async function signX402Payment(
  walletAddress: Address,
  paymentRequirements: {
    scheme: string;
    network: string;
    amount: string; // maxAmountRequired as string (e.g., "1000000")
    payTo: Address;
    asset: Address; // Token contract address
    resource: string;
    description: string;
    assetName?: string; // e.g., "USDC"
  }
): Promise<string> {
  if (!isWalletAvailable()) {
    throw new Error("Wallet not available");
  }

  // Build payment requirements in x402 format
  const requirements: PaymentRequirements = {
    scheme: paymentRequirements.scheme as "exact",
    network: paymentRequirements.network as "base-sepolia" | "base",
    maxAmountRequired: paymentRequirements.amount,
    resource: paymentRequirements.resource,
    description: paymentRequirements.description,
    mimeType: "",
    payTo: paymentRequirements.payTo,
    maxTimeoutSeconds: 60,
    asset: paymentRequirements.asset,
    outputSchema: {
      input: {
        type: "http",
        method: "GET",
        discoverable: true,
      },
      output: undefined,
    },
    extra: {
      name: paymentRequirements.assetName || "USDC",
      version: "2",
    },
  };

  // Create a signer object for x402 that uses MetaMask for signing
  // The x402 package needs a wallet client with an account that can sign typed data
  const ethereumProvider = (window as any).ethereum;
  
  // Create a LocalAccount that delegates signing to MetaMask
  // This satisfies viem's Account interface requirements
  const account: LocalAccount = {
    address: walletAddress,
    type: "local",
    async signMessage({ message }) {
      // Delegate to MetaMask via JSON-RPC
      const signature = await ethereumProvider.request({
        method: "personal_sign",
        params: [typeof message === "string" ? message : message.raw, walletAddress],
      });
      return signature as `0x${string}`;
    },
    async signTypedData(typedData) {
      // Delegate to MetaMask via JSON-RPC
      const signature = await ethereumProvider.request({
        method: "eth_signTypedData_v4",
        params: [walletAddress, JSON.stringify(typedData)],
      });
      return signature as `0x${string}`;
    },
    async signTransaction(_tx) {
      // This won't be used by x402, but required for LocalAccount interface
      throw new Error("signTransaction not supported for MetaMask accounts");
    },
    // Required properties for LocalAccount
    publicKey: "0x" as `0x${string}`, // Not used for MetaMask, but required by interface
    source: "custom" as const,
  };
  
  // Create a wallet client with the account attached
  // This ensures signTypedData calls have access to the account
  const walletClient = createWalletClient({
    account: account,
    chain: baseSepolia,
    transport: custom(ethereumProvider),
  });
  
  // Create and sign the payment header using x402's utility
  // The walletClient now has the account property that x402 needs
  const signedPayment = await createPaymentHeader(walletClient as any, 1, requirements);
  
  return signedPayment;
}
