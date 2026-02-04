import "@dev-agents/sdk-client/styles/base";
import { agentQueryClient, call } from "@dev-agents/sdk-client";
import { getUserTimeZone } from "@dev-agents/sdk-shared";
import { QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { Lock, Unlock, Play, ShoppingBag, CheckCircle, ArrowLeft, X, Settings } from "lucide-react";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
import LoadingIcon from "./components/LoadingIcon";
import type {
  getClasses,
  getProducts,
  getPurchases,
  unlockClass,
  getClassContent,
  getClassPreview,
  getWalletConfig,
  setWalletConfig,
} from "./server";

interface RenderContext {
  type: "widget" | "app" | "feed_item";
  data?: unknown;
}

// Types for the data
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

interface Purchase {
  id: number;
  classId: string;
  classTitle: string;
  price: string;
  contentUrl: string;
  purchasedAt: string;
}

// Yoga imagery URLs for the luxury aesthetic
const YOGA_IMAGES = {
  hero: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  morningFlow: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  powerYoga: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
  flexibility: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
  meditation: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
  materials: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
};

// Get image for a class based on its title
function getClassImage(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("morning") || lowerTitle.includes("flow")) {
    return YOGA_IMAGES.morningFlow;
  }
  if (lowerTitle.includes("power") || lowerTitle.includes("strength")) {
    return YOGA_IMAGES.powerYoga;
  }
  if (lowerTitle.includes("flex") || lowerTitle.includes("stretch")) {
    return YOGA_IMAGES.flexibility;
  }
  if (lowerTitle.includes("meditat") || lowerTitle.includes("breath")) {
    return YOGA_IMAGES.meditation;
  }
  // Default rotation based on id
  const images = [YOGA_IMAGES.morningFlow, YOGA_IMAGES.powerYoga, YOGA_IMAGES.flexibility, YOGA_IMAGES.meditation];
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return images[hash % images.length] || YOGA_IMAGES.morningFlow;
}

// Custom hook for data fetching
function useYogaData() {
  const classesQuery = useQuery({
    queryKey: ["classes"],
    queryFn: () => call<typeof getClasses>("getClasses", {}),
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => call<typeof getProducts>("getProducts", {}),
  });

  const purchasesQuery = useQuery({
    queryKey: ["purchases"],
    queryFn: () => call<typeof getPurchases>("getPurchases", {}),
  });

  return {
    classes: classesQuery.data?.classes || [],
    products: productsQuery.data?.products || [],
    purchases: purchasesQuery.data?.purchases || [],
    isLoading: classesQuery.isLoading || productsQuery.isLoading || purchasesQuery.isLoading,
    error: classesQuery.error || productsQuery.error || purchasesQuery.error,
  };
}

// Check if a class is purchased
function isClassPurchased(classId: string, purchases: Purchase[]): boolean {
  return purchases.some((p) => p.classId === classId);
}

// Get purchase for a class
function getPurchaseForClass(classId: string, purchases: Purchase[]): Purchase | undefined {
  return purchases.find((p) => p.classId === classId);
}

// Preview Modal Component
function PreviewModal({
  yogaClass,
  previewUrl,
  onClose,
  onPurchase,
  isPurchased,
}: {
  yogaClass: YogaClass;
  previewUrl: string;
  onClose: () => void;
  onPurchase: () => void;
  isPurchased: boolean;
}) {
  const embedUrl = previewUrl.includes("youtube")
    ? previewUrl.replace("watch?v=", "embed/")
    : previewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Preview</p>
            <h3 className="text-lg font-light text-foreground font-['Cormorant_Garamond']">{yogaClass.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30">
          {isPurchased ? (
            <div className="flex items-center justify-center gap-2 text-stone-600 dark:text-stone-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-light">You own this class</span>
            </div>
          ) : (
            <button
              onClick={onPurchase}
              className="w-full py-3 px-6 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-light tracking-wide rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
            >
              Unlock Full Class for {yogaClass.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Class Card Component - Luxury Minimal Design
function ClassCard({
  yogaClass,
  isPurchased,
  purchase,
  onSelect,
}: {
  yogaClass: YogaClass;
  isPurchased: boolean;
  purchase?: Purchase;
  onSelect: () => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      setShowPreview(true);
      return;
    }

    setLoadingPreview(true);
    try {
      const result = await call<typeof getClassPreview>("getClassPreview", { classId: yogaClass.id });
      console.log("Preview result:", result);
      if (result.previewUrl) {
        setPreviewUrl(result.previewUrl);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Failed to load preview:", error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const classImage = getClassImage(yogaClass.title);

  return (
    <>
      <div
        onClick={onSelect}
        className="relative group cursor-pointer overflow-hidden rounded-xl"
      >
        {/* Image Background */}
        <div className="aspect-[4/3] relative">
          <img
            src={classImage}
            alt={yogaClass.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Lock Indicator */}
          <div className="absolute top-3 right-3">
            <div
              className={`p-2 rounded-full backdrop-blur-sm ${
                isPurchased
                  ? "bg-stone-100/20"
                  : "bg-stone-900/40"
              }`}
            >
              {isPurchased ? (
                <Unlock className="w-4 h-4 text-white" />
              ) : (
                <Lock className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* Preview Button - Only show if not purchased */}
          {!isPurchased && (
            <button
              onClick={handlePreviewClick}
              disabled={loadingPreview}
              className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 text-xs font-medium backdrop-blur-sm hover:bg-white dark:hover:bg-stone-700 transition-colors"
            >
              {loadingPreview ? (
                <LoadingIcon className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              Preview
            </button>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-light text-white mb-1 font-['Cormorant_Garamond']">
              {yogaClass.title}
            </h3>
            <div className="flex items-center justify-between">
              {isPurchased ? (
                <span className="text-sm text-stone-300 font-light">
                  Purchased {dayjs(purchase!.purchasedAt).tz(getUserTimeZone()).format("MMM D")}
                </span>
              ) : (
                <span className="text-lg font-light text-white">
                  {yogaClass.price}
                </span>
              )}
              {isPurchased && (
                <span className="text-xs uppercase tracking-widest text-stone-300">
                  Owned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <PreviewModal
          yogaClass={yogaClass}
          previewUrl={previewUrl}
          onClose={() => setShowPreview(false)}
          onPurchase={() => {
            setShowPreview(false);
            onSelect();
          }}
          isPurchased={isPurchased}
        />
      )}
    </>
  );
}

// Product Card Component - Luxury Minimal Design
function ProductCard({ product }: { product: YogaProduct }) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-xl">
      {/* Image Background */}
      <div className="aspect-[4/3] relative">
        <img
          src={YOGA_IMAGES.materials}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Icon */}
        <div className="absolute top-3 right-3">
          <div className="p-2 rounded-full backdrop-blur-sm bg-stone-900/40">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Study Material</p>
          <h3 className="text-xl font-light text-white mb-1 font-['Cormorant_Garamond']">
            {product.name}
          </h3>
          <span className="text-lg font-light text-white">
            {product.price_display}
          </span>
        </div>
      </div>
    </div>
  );
}

// Class Detail View - Luxury Minimal Design
function ClassDetailView({
  yogaClass,
  isPurchased,
  purchase,
  onBack,
  onPurchaseComplete,
}: {
  yogaClass: YogaClass;
  isPurchased: boolean;
  purchase?: Purchase;
  onBack: () => void;
  onPurchaseComplete: () => void;
}) {
  const queryClient = useQueryClient();
  const [paymentState, setPaymentState] = useState<
    "idle" | "loading" | "paying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [contentUrl, setContentUrl] = useState(purchase?.contentUrl || "");

  // Mutation to unlock class - fully automatic, zero-click
  const unlockMutation = useMutation({
    mutationFn: () =>
      call<typeof unlockClass>("unlockClass", {
        classId: yogaClass.id,
        classTitle: yogaClass.title,
        price: yogaClass.price,
      }),
    onSuccess: (data) => {
      console.log("Unlock result:", data);
      if (data.success) {
        setContentUrl(data.contentUrl || "");
        setPaymentState("success");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
        onPurchaseComplete();
      } else {
        setPaymentState("error");
        setErrorMessage(data.error || "Failed to unlock content");
      }
    },
    onError: (error: any) => {
      console.error("Unlock error:", error);
      setPaymentState("error");
      setErrorMessage(error?.message || error?.error || "Failed to unlock content");
    },
  });

  // Get content for already purchased class
  const contentQuery = useQuery({
    queryKey: ["classContent", yogaClass.id],
    queryFn: () => call<typeof getClassContent>("getClassContent", { classId: yogaClass.id }),
    enabled: isPurchased,
  });

  const displayUrl = contentUrl || contentQuery.data?.contentUrl || purchase?.contentUrl || "";

  const startPurchase = () => {
    setPaymentState("paying");
    setErrorMessage("");
    unlockMutation.mutate();
  };

  const classImage = getClassImage(yogaClass.title);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Hero Image Header */}
      <div className="relative h-64 sm:h-80">
        <img
          src={classImage}
          alt={yogaClass.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 ${
              isPurchased || paymentState === "success"
                ? "bg-stone-100/20 text-stone-100"
                : "bg-stone-900/40 text-stone-100"
            }`}
          >
            {isPurchased || paymentState === "success" ? (
              <>
                <Unlock className="w-4 h-4" />
                <span className="text-sm font-light tracking-wide">Unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-sm font-light tracking-wide">{yogaClass.price}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-foreground font-['Cormorant_Garamond']">
            {yogaClass.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Video/Content area */}
        {(isPurchased || paymentState === "success") && displayUrl ? (
          <div className="bg-black rounded-xl overflow-hidden mb-6">
            <div className="aspect-video flex items-center justify-center">
              {displayUrl.includes("youtube") ? (
                <iframe
                  src={displayUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 text-white"
                >
                  <Play className="w-16 h-16" />
                  <span className="font-light tracking-wide">Open Full Class</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={classImage}
              alt={yogaClass.title}
              className="w-full aspect-video object-cover opacity-30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Lock className="w-12 h-12 mb-3 opacity-60" />
              <p className="font-light tracking-wide">Purchase to unlock full content</p>
            </div>
          </div>
        )}

        {/* Purchase button or status */}
        {!isPurchased && paymentState !== "success" && (
          <div className="space-y-4">
            {paymentState === "idle" && (
              <button
                onClick={startPurchase}
                className="w-full py-4 px-6 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-light tracking-widest uppercase rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
              >
                Unlock for {yogaClass.price}
              </button>
            )}

            {paymentState === "paying" && (
              <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                <LoadingIcon className="mb-3" />
                <span className="font-light tracking-wide">Unlocking class...</span>
              </div>
            )}

            {paymentState === "error" && (
              <div className="text-center">
                <p className="text-destructive mb-4 font-light">{errorMessage}</p>
                <p className="text-sm text-muted-foreground mb-4 font-light">
                  Your USDC payment signature was created successfully. The payment service may be experiencing issues.
                </p>
                <button
                  onClick={startPurchase}
                  className="px-6 py-3 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-light tracking-wide rounded-lg"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Purchase confirmation */}
        {(isPurchased || paymentState === "success") && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-stone-600 dark:text-stone-400 mx-auto mb-3" />
            <p className="font-light tracking-wide text-muted-foreground">You own this class</p>
            {purchase && (
              <p className="text-sm text-muted-foreground mt-1 font-light">
                Purchased {dayjs(purchase.purchasedAt).tz(getUserTimeZone()).format("MMMM D, YYYY")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Catalog View - Luxury Minimal Design
function CatalogView({
  classes,
  products,
  purchases,
  onSelectClass,
}: {
  classes: YogaClass[];
  products: YogaProduct[];
  purchases: Purchase[];
  onSelectClass: (yogaClass: YogaClass) => void;
}) {
  const [activeTab, setActiveTab] = useState<"classes" | "products" | "library">("library");
  const [showSettings, setShowSettings] = useState(false);
  const purchasedClasses = classes.filter((c) => isClassPurchased(c.id, purchases));

  return (
    <>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-xl overflow-hidden flex flex-col m-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-light font-['Cormorant_Garamond']">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              <WalletConfigSettings />
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col bg-background">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-56">
        <img
          src={YOGA_IMAGES.hero}
          alt="Yoga practice"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        {/* Settings Gear Icon - Top Right */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors z-10"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Studio</p>
          <h1 className="text-3xl sm:text-4xl font-light text-foreground font-['Cormorant_Garamond']">
            Yoga Practice
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        <button
          onClick={() => setActiveTab("library")}
          className={`py-4 mr-8 text-sm font-light tracking-widest uppercase transition-colors border-b-2 -mb-px ${
            activeTab === "library"
              ? "text-foreground border-foreground"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab("classes")}
          className={`py-4 mr-8 text-sm font-light tracking-widest uppercase transition-colors border-b-2 -mb-px ${
            activeTab === "classes"
              ? "text-foreground border-foreground"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`py-4 text-sm font-light tracking-widest uppercase transition-colors border-b-2 -mb-px ${
            activeTab === "products"
              ? "text-foreground border-foreground"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Materials
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "classes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((yogaClass) => (
              <ClassCard
                key={yogaClass.id}
                yogaClass={yogaClass}
                isPurchased={isClassPurchased(yogaClass.id, purchases)}
                purchase={getPurchaseForClass(yogaClass.id, purchases)}
                onSelect={() => onSelectClass(yogaClass)}
              />
            ))}
            {classes.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p className="font-light tracking-wide">No classes available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p className="font-light tracking-wide">No materials available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "library" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {purchasedClasses.map((yogaClass) => (
              <ClassCard
                key={yogaClass.id}
                yogaClass={yogaClass}
                isPurchased={true}
                purchase={getPurchaseForClass(yogaClass.id, purchases)}
                onSelect={() => onSelectClass(yogaClass)}
              />
            ))}
            {purchasedClasses.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <Lock className="w-10 h-10 mx-auto mb-4 opacity-40" />
                <p className="font-light tracking-wide mb-2">Your library is empty</p>
                <p className="text-sm font-light opacity-70">Purchase classes to add them here</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
}

// Wallet Config Settings Component
function WalletConfigSettings() {
  const queryClient = useQueryClient();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // Load current wallet config
  const walletQuery = useQuery({
    queryKey: ["walletConfig"],
    queryFn: () => call<typeof getWalletConfig>("getWalletConfig", {}),
  });

  const saveWalletMutation = useMutation({
    mutationFn: (key: string) => call<typeof setWalletConfig>("setWalletConfig", { privateKey: key }),
    onSuccess: (data) => {
      console.log("Wallet config save response:", data);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["walletConfig"] });
        setIsSaving(false);
        setPrivateKey("");
        setError("");
      } else {
        setIsSaving(false);
        setError(data.error || "Failed to save wallet configuration");
      }
    },
    onError: (err: any) => {
      console.error("Wallet config save error:", err);
      setIsSaving(false);
      setError(err.message || err.error || "Failed to save wallet configuration");
    },
  });

  const handleSave = () => {
    if (!privateKey.trim()) {
      setError("Please enter a private key");
      return;
    }

    // Normalize the key - add 0x if missing, but don't validate here (server will do it)
    let normalizedKey = privateKey.trim();
    if (!normalizedKey.startsWith("0x")) {
      normalizedKey = "0x" + normalizedKey;
    }

    // Basic validation
    if (normalizedKey.length !== 66) {
      setError(`Invalid private key length. Expected 64 hex characters (with or without 0x prefix), got ${normalizedKey.length - 2} characters.`);
      return;
    }

    setIsSaving(true);
    setError("");
    saveWalletMutation.mutate(normalizedKey);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-light mb-6 font-['Cormorant_Garamond']">Wallet Configuration</h2>
      <p className="text-sm text-muted-foreground mb-6 font-light">
        Add your wallet private key to enable automatic payment signing. This allows classes to unlock automatically without requiring MetaMask confirmation.
      </p>

      {walletQuery.data?.hasPrivateKey && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-light">Wallet configured</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono mb-2">
            ✓ Wallet configured: {walletQuery.data.privateKey}
          </p>
          {walletQuery.data.address && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Wallet Address</p>
              <p className="text-sm font-mono break-all mb-3">{walletQuery.data.address}</p>
              {walletQuery.data.balance !== null && walletQuery.data.balance !== undefined ? (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Balance</p>
                  <p className="text-lg font-light">{parseFloat(walletQuery.data.balance).toFixed(4)} ETH</p>
                  {(walletQuery.data as any).usdcBalance !== null && (walletQuery.data as any).usdcBalance !== undefined && (
                    <p className="text-lg font-light mt-2">{parseFloat((walletQuery.data as any).usdcBalance).toFixed(2)} USDC</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Payments require USDC on Base network. Send USDC to this address to fund your wallet for purchases.
                  </p>
                  {(!(walletQuery.data as any).usdcBalance || parseFloat((walletQuery.data as any).usdcBalance || "0") < 1) && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
                      ⚠️ Low USDC balance. You need USDC (not ETH) for payments.
                    </p>
                  )}
                </div>
              ) : (walletQuery.data as any).error ? (
                <p className="text-xs text-red-500">Error loading balance: {(walletQuery.data as any).error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Loading balance...</p>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-light">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-light mb-2">Wallet Private Key</label>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
              setError("");
            }}
            placeholder="0x... or paste without 0x prefix"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground font-light font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 font-light">
            Your private key must have 64 hex characters (0x prefix will be added automatically if missing). This key is stored securely and only used for automatic payment signing on Base network (mainnet).
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !privateKey.trim()}
          className="px-6 py-3 bg-foreground text-background rounded-lg font-light tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : walletQuery.data?.hasPrivateKey ? "Update Wallet Key" : "Save Wallet Key"}
        </button>
      </div>
    </div>
  );
}

// Widget View - Luxury Compact Display
function WidgetView({
  classes,
  purchases,
  onSelectClass,
}: {
  classes: YogaClass[];
  purchases: Purchase[];
  onSelectClass: (yogaClass: YogaClass) => void;
}) {
  const purchasedCount = purchases.length;
  const totalClasses = classes.length;

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <img
        src={YOGA_IMAGES.hero}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-0.5">Studio</p>
          <h2 className="text-lg font-light text-white font-['Cormorant_Garamond']">Yoga</h2>
        </div>

        {/* Class list */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {classes.slice(0, 3).map((yogaClass) => {
            const isPurchased = isClassPurchased(yogaClass.id, purchases);
            return (
              <div
                key={yogaClass.id}
                onClick={() => onSelectClass(yogaClass)}
                className="flex items-center justify-between p-2 rounded-lg bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isPurchased ? (
                    <Unlock className="w-3 h-3 text-stone-300 flex-shrink-0" />
                  ) : (
                    <Lock className="w-3 h-3 text-stone-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-light text-white truncate">
                    {yogaClass.title}
                  </span>
                </div>
                <span className="text-[10px] font-light text-stone-300 flex-shrink-0 ml-2">
                  {isPurchased ? "Owned" : yogaClass.price}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] text-stone-400 font-light tracking-wide text-center">
            {purchasedCount} of {totalClasses} unlocked
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MainApp({ renderContext }: { renderContext: RenderContext }) {
  const { classes, products, purchases, isLoading, error } = useYogaData();
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background">
        <LoadingIcon className="w-8 h-8 mb-4" />
        <p className="text-sm text-muted-foreground font-light tracking-wide">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-destructive bg-background">
        <p className="font-light">Error loading data: {String(error)}</p>
      </div>
    );
  }

  // Widget view
  if (renderContext.type === "widget") {
    return (
      <WidgetView
        classes={classes}
        purchases={purchases}
        onSelectClass={setSelectedClass}
      />
    );
  }

  // Full app view
  if (selectedClass) {
    return (
      <div className="h-full pt-safe pb-safe">
        <ClassDetailView
          yogaClass={selectedClass}
          isPurchased={isClassPurchased(selectedClass.id, purchases)}
          purchase={getPurchaseForClass(selectedClass.id, purchases)}
          onBack={() => setSelectedClass(null)}
          onPurchaseComplete={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="h-full pt-safe pb-safe">
      <CatalogView
        classes={classes}
        products={products}
        purchases={purchases}
        onSelectClass={setSelectedClass}
      />
    </div>
  );
}

export default function App({ renderContext }: { renderContext: RenderContext }) {
  return (
    <QueryClientProvider client={agentQueryClient}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
      `}</style>
      <MainApp renderContext={renderContext} />
    </QueryClientProvider>
  );
}
