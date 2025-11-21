import { useRef, useState, useEffect } from "react";
import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import {
  ChevronLeft,
  RotateCw,
  Video,
  ChefHat,
  AlertTriangle,
  Play,
  Check,
  X,
} from "lucide-react";
import { WebcamARViewer } from "./WebcamARViewer";
import { useIsMobile } from "@/hooks/use-is-mobile";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          exposure?: string;
          "environment-image"?: string;
          loading?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "interaction-prompt"?: string;
          style?: CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

const MODEL_VIEWER_SCRIPT_ID = "model-viewer-script";

export function ARScreen() {
  const { selectedDish, setScreen } = useARMenu();
  const [infoVisible, setInfoVisible] = useState(true);
  const [showWebcamViewer, setShowWebcamViewer] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFloatingBoxes, setShowFloatingBoxes] = useState(false);
  const { trigger } = useHaptics();
  const modelViewerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let existingScript = document.getElementById(MODEL_VIEWER_SCRIPT_ID);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = MODEL_VIEWER_SCRIPT_ID;
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

      script.onload = () => {
        console.log("model-viewer script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load model-viewer script");
      };

      document.head.appendChild(script);
    }

    trigger("light");

    const infoTimer = setTimeout(() => {
      setInfoVisible(false);
    }, 3000);

    return () => {
      clearTimeout(infoTimer);
    };
  }, [trigger]);

  if (!selectedDish) return null;

  if (showWebcamViewer && !isMobile) {
    console.log("ARScreen: Rendering WebcamARViewer");
    console.log("ARScreen: selectedDish =", selectedDish);
    console.log("ARScreen: selectedDish.name =", selectedDish?.name);
    console.log("ARScreen: selectedDish.ingredients =", selectedDish?.ingredients);
    return (
      <WebcamARViewer
        modelPath={selectedDish.modelPath}
        dish={selectedDish}
        onClose={() => setShowWebcamViewer(false)}
      />
    );
  }

  const dishColor =
    selectedDish.emoji === "🔥"
      ? "#EF4444"
      : selectedDish.emoji === "🍫"
        ? "#F9A8D4"
        : selectedDish.emoji === "🍹"
          ? "#67E8F9"
          : "#6EE7B7";

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden">
      <button
        onClick={() => setScreen("dishDetail")}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 shadow-lg text-amber-700 hover:bg-white transition-colors safe-top safe-left"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      <AnimatePresence>
        {infoVisible && (
          <motion.div
            className="absolute top-16 sm:top-20 left-4 right-4 z-40 safe-top"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white/90 backdrop-blur-md border border-amber-200 rounded-lg p-3 max-w-xs mx-auto shadow-lg">
              <div className="flex items-center justify-between mb-1 gap-2">
                <h3 className="text-amber-800 font-bold text-sm truncate">
                  {selectedDish.emoji} {selectedDish.name}
                </h3>
                <span className="text-gray-600 text-xs whitespace-nowrap">
                  {selectedDish.calories} cal
                </span>
              </div>
              <p className="text-amber-700 text-xs font-semibold">
                {isMobile
                  ? "📱 Tap AR button below"
                  : '💻 Use "View with Camera"'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!infoVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 sm:top-20 left-4 right-4 z-40 flex gap-2 justify-center safe-top"
          >
            <button
              onClick={() => {
                setShowFloatingBoxes(!showFloatingBoxes);
                if (showFloatingBoxes) {
                  setShowIngredients(false);
                  setShowAllergens(false);
                  setShowVideo(false);
                }
              }}
              className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                showFloatingBoxes
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                  : "bg-amber-500/80 backdrop-blur-md hover:bg-amber-600/80"
              }`}
              title="Toggle Floating Info"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="hidden sm:inline">Floating</span>
            </button>
            {!showFloatingBoxes && (
              <>
                <button
                  onClick={() => {
                    setShowIngredients(!showIngredients);
                    setShowAllergens(false);
                    setShowVideo(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                    showIngredients
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "bg-amber-500/80 backdrop-blur-md hover:bg-amber-600/80"
                  }`}
                >
                  <ChefHat size={14} />
                  <span className="hidden sm:inline">Ingredients</span>
                </button>
                <button
                  onClick={() => {
                    setShowAllergens(!showAllergens);
                    setShowIngredients(false);
                    setShowVideo(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                    showAllergens
                      ? "bg-gradient-to-r from-orange-500 to-red-600"
                      : "bg-amber-500/80 backdrop-blur-md hover:bg-amber-600/80"
                  }`}
                >
                  <AlertTriangle size={14} />
                  <span className="hidden sm:inline">Allergens</span>
                </button>
                {selectedDish.videoUrl && (
                  <button
                    onClick={() => {
                      setShowVideo(!showVideo);
                      setShowIngredients(false);
                      setShowAllergens(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                      showVideo
                        ? "bg-gradient-to-r from-purple-500 to-pink-600"
                        : "bg-amber-500/80 backdrop-blur-md hover:bg-amber-600/80"
                    }`}
                  >
                    <Play size={14} />
                    <span className="hidden sm:inline">Recipe</span>
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showFloatingBoxes && showIngredients && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-28 sm:top-32 left-4 right-4 z-40 mx-auto max-w-xs safe-top"
          >
            <div className="bg-gradient-to-br from-green-500/95 to-emerald-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-green-300/30">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat size={18} className="text-white" />
                <h3 className="text-white font-bold text-sm">Ingredients</h3>
              </div>
              <div className="space-y-1.5">
                {selectedDish.ingredients.map((ingredient, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-white/90"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="text-xs">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!showFloatingBoxes && showAllergens && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-28 sm:top-32 left-4 right-4 z-40 mx-auto max-w-xs safe-top"
          >
            <div className="bg-gradient-to-br from-orange-500/95 to-red-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-orange-300/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-white" />
                <h3 className="text-white font-bold text-sm">
                  Allergen Information
                </h3>
              </div>
              {selectedDish.allergens.includes("None") ? (
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={14} className="text-white" />
                  <span className="text-xs">No common allergens</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedDish.allergens.map((allergen, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-white/90"
                    >
                      <AlertTriangle size={12} className="text-white" />
                      <span className="text-xs font-semibold">{allergen}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!showFloatingBoxes && showVideo && selectedDish.videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-28 sm:top-32 left-4 right-4 z-40 mx-auto max-w-sm safe-top"
          >
            <div className="bg-gradient-to-br from-purple-500/95 to-pink-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-purple-300/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-white" />
                  <h3 className="text-white font-bold text-sm">Recipe Video</h3>
                </div>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                <iframe
                  src={selectedDish.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}

        {showFloatingBoxes && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 max-w-[200px] pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-green-500/95 to-emerald-600/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border-2 border-green-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat size={14} className="text-white" />
                  <h3 className="text-white font-bold text-xs">Ingredients</h3>
                </div>
                <div className="space-y-1">
                  {selectedDish.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-white/90"
                    >
                      <div className="w-1 h-1 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[10px]">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 max-w-[200px] pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-orange-500/95 to-red-600/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border-2 border-orange-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-white" />
                  <h3 className="text-white font-bold text-xs">Allergens</h3>
                </div>
                {selectedDish.allergens.includes("None") ? (
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Check size={12} className="text-white" />
                    <span className="text-[10px]">No common allergens</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {selectedDish.allergens.map((allergen, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-white/90"
                      >
                        <AlertTriangle
                          size={10}
                          className="text-white flex-shrink-0"
                        />
                        <span className="text-[10px] font-semibold">
                          {allergen}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {selectedDish.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-32 z-40 max-w-[280px] sm:max-w-sm pointer-events-auto"
              >
                <div className="bg-gradient-to-br from-purple-500/95 to-pink-600/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border-2 border-purple-300/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Play size={14} className="text-white" />
                      <h3 className="text-white font-bold text-xs">
                        Recipe Video
                      </h3>
                    </div>
                  </div>
                  <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                    <iframe
                      src={selectedDish.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-40 flex flex-col gap-2 safe-top safe-right">
        <button
          onClick={() => setInfoVisible(!infoVisible)}
          className="p-2 sm:p-2.5 rounded-lg bg-white/90 backdrop-blur-md border border-amber-200 text-amber-700 hover:bg-white transition-colors shadow-lg"
          title="Toggle Info"
        >
          <RotateCw size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {isMobile ? (
        <model-viewer
          ref={modelViewerRef as any}
          src={selectedDish.modelPath}
          alt={`3D model of ${selectedDish.name}`}
          ar
          ar-modes="scene-viewer webxr quick-look"
          ar-placement="floor"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1"
          camera-orbit="0deg 75deg 2.5m"
          min-camera-orbit="auto 0deg auto"
          max-camera-orbit="auto 120deg auto"
          field-of-view="30deg"
          interaction-prompt="auto"
          loading="eager"
          disable-zoom="false"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        >
          <div
            slot="ar-button"
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
          >
            <motion.button
              onClick={() => trigger("medium")}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm sm:text-base shadow-2xl border-2 border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                boxShadow: `0 0 40px ${dishColor}`,
              }}
            >
              📱 Place on Table
            </motion.button>
          </div>
        </model-viewer>
      ) : (
        <>
          {!showWebcamViewer && (
            <model-viewer
              ref={modelViewerRef as any}
              src={selectedDish.modelPath}
              alt={`3D model of ${selectedDish.name}`}
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
              camera-orbit="0deg 75deg 2.5m"
              min-camera-orbit="auto 0deg auto"
              max-camera-orbit="auto 120deg auto"
              field-of-view="30deg"
              interaction-prompt="auto"
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            />
          )}

          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 safe-bottom">
            <motion.button
              onClick={() => {
                trigger("medium");
                setShowWebcamViewer(true);
              }}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm sm:text-base shadow-2xl border-2 border-white/30 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                boxShadow: `0 0 40px ${dishColor}`,
              }}
            >
              <Video size={16} className="sm:w-5 sm:h-5" />
              View with Camera
            </motion.button>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
