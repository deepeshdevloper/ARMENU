import { useRef, useState, useEffect } from "react";
import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { ChevronLeft, RotateCw } from "lucide-react";

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
  const [modelLoading, setModelLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { trigger } = useHaptics();
  const modelViewerRef = useRef<HTMLElement>(null);
  const scriptCreatedByThisComponent = useRef(false);

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
        setHasError(true);
        setModelLoading(false);
      };

      document.head.appendChild(script);
      scriptCreatedByThisComponent.current = true;
    }

    trigger("light");

    const infoTimer = setTimeout(() => {
      setInfoVisible(false);
    }, 3000);

    return () => {
      clearTimeout(infoTimer);
      if (scriptCreatedByThisComponent.current) {
        const script = document.getElementById(MODEL_VIEWER_SCRIPT_ID);
        if (script && document.head.contains(script)) {
          document.head.removeChild(script);
        }
      }
    };
  }, [trigger]);

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      console.log("Auto-clearing loading state after timeout");
      setModelLoading(false);
    }, 3000);

    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      const handleLoad = () => {
        console.log("Model loaded successfully");
        setModelLoading(false);
        setHasError(false);
        trigger("medium");
      };

      const handleError = (event: any) => {
        console.error("Model loading error:", event);
        setModelLoading(false);
        setHasError(true);
      };

      const handleProgress = (event: any) => {
        const { totalProgress } = event.detail;
        if (totalProgress === 1) {
          setModelLoading(false);
        }
      };

      modelViewer.addEventListener("load", handleLoad);
      modelViewer.addEventListener("error", handleError);
      modelViewer.addEventListener("progress", handleProgress);

      return () => {
        modelViewer.removeEventListener("load", handleLoad);
        modelViewer.removeEventListener("error", handleError);
        modelViewer.removeEventListener("progress", handleProgress);
        clearTimeout(loadTimeout);
      };
    }

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [trigger]);

  if (!selectedDish) return null;

  const dishColor =
    selectedDish.emoji === "🔥"
      ? "#EF4444"
      : selectedDish.emoji === "🍫"
        ? "#F9A8D4"
        : selectedDish.emoji === "🍹"
          ? "#67E8F9"
          : "#6EE7B7";

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <button
        onClick={() => setScreen("dishDetail")}
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <AnimatePresence>
        {infoVisible && (
          <motion.div
            className="absolute top-20 left-0 right-0 z-40 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-lg">
                  {selectedDish.emoji} {selectedDish.name}
                </h3>
                <span className="text-white/70 text-sm">
                  {selectedDish.calories} cal
                </span>
              </div>
              <p className="text-white/60 text-xs mb-2">
                {selectedDish.ingredients.slice(0, 3).join(" • ")}
              </p>
              <p className="text-green-400 text-xs">
                📱 Tap "View in your space" to see it on your table!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={() => setInfoVisible(!infoVisible)}
          className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
        >
          <RotateCw size={20} />
        </button>
      </div>

      {modelLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white">Loading 3D model...</p>
            <p className="text-white/60 text-sm mt-1">
              Preparing AR experience
            </p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute bottom-24 left-0 right-0 z-40 px-6">
          <div className="bg-red-500/90 backdrop-blur-xl border border-red-300/20 rounded-2xl p-4 text-center">
            <p className="text-white font-semibold mb-1">
              ⚠️ Model Loading Error
            </p>
            <p className="text-white/80 text-sm">
              Unable to load the 3D model. The AR viewer may still work with
              touch controls.
            </p>
          </div>
        </div>
      )}

      <model-viewer
        ref={modelViewerRef as any}
        src={selectedDish.modelPath}
        alt={`3D model of ${selectedDish.name}`}
        ar
        ar-modes="scene-viewer webxr quick-look"
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
      >
        <div
          slot="ar-button"
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
        >
          <motion.button
            onClick={() => trigger("medium")}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base shadow-2xl border-2 border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              boxShadow: `0 0 40px ${dishColor}`,
            }}
          >
            📱 View in your space
          </motion.button>
        </div>

        <div
          slot="progress-bar"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "4px solid rgba(255,255,255,0.2)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </model-viewer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
