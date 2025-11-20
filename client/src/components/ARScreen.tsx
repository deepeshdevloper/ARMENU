import { useRef, useState, useEffect } from "react";
import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { ChevronLeft, RotateCw, Video, Scan } from "lucide-react";
import { WebcamARViewer } from "./WebcamARViewer";
import { ARTableDetection } from "./ARTableDetection";
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
  const [showTableDetection, setShowTableDetection] = useState(false);
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

  if (showTableDetection) {
    return (
      <ARTableDetection
        modelPath={selectedDish.modelPath}
        onClose={() => setShowTableDetection(false)}
      />
    );
  }

  if (showWebcamViewer && !isMobile) {
    return (
      <WebcamARViewer
        modelPath={selectedDish.modelPath}
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
                {isMobile ? "📱 Tap AR button below" : '💻 Use "View with Camera"'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-40 flex flex-col gap-2 safe-top safe-right">
        <button
          onClick={() => setShowTableDetection(true)}
          className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 backdrop-blur-md text-white hover:from-orange-500 hover:to-red-500 transition-colors shadow-lg border border-white/30"
          title="AR Table Detection"
        >
          <Scan size={16} className="sm:w-5 sm:h-5" />
        </button>
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
