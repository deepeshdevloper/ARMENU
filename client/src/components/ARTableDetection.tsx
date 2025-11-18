import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useHaptics } from "@/hooks/useHaptics";
import { X, ZoomIn, ZoomOut, RotateCw, Check } from "lucide-react";

interface DishModelProps {
  modelPath: string;
  position: [number, number, number];
  scale: number;
  rotation: { x: number; y: number };
  isPlaced: boolean;
}

function DishModel({
  modelPath,
  position,
  scale,
  rotation,
  isPlaced,
}: DishModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = rotation.x;
      modelRef.current.rotation.y = rotation.y;
    }
  });

  const clonedScene = scene.clone();

  return (
    <group ref={modelRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
      {isPlaced && (
        <>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.28, 32]} />
            <meshBasicMaterial color="#4CAF50" transparent opacity={0.1} />
          </mesh>
        </>
      )}
    </group>
  );
}

function PlacementGrid({ visible }: { visible: boolean }) {
  return visible ? (
    <group position={[0, -0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, 20, 20]} />
        <meshBasicMaterial
          color="#FFD700"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
      </mesh>
    </group>
  ) : null;
}

interface ARSceneProps {
  modelPath: string;
  dishPosition: [number, number, number] | null;
  scale: number;
  rotation: { x: number; y: number };
}

function ARScene({ modelPath, dishPosition, scale, rotation }: ARSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 3]} fov={60} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.8} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      <PlacementGrid visible={!dishPosition} />

      {dishPosition && (
        <Suspense fallback={null}>
          <DishModel
            modelPath={modelPath}
            position={dishPosition}
            scale={scale}
            rotation={rotation}
            isPlaced={true}
          />
        </Suspense>
      )}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.51, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2a2a2a" opacity={0.8} transparent />
      </mesh>
    </>
  );
}

interface ARTableDetectionProps {
  modelPath: string;
  onClose: () => void;
}

export function ARTableDetection({
  modelPath,
  onClose,
}: ARTableDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [dishPosition, setDishPosition] = useState<
    [number, number, number] | null
  >(null);
  const [scale, setScale] = useState(2);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trigger } = useHaptics();

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        console.log("Requesting camera access for AR...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log("Camera access granted");
        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              videoRef.current?.play();
              setCameraReady(true);
              console.log("Camera ready for AR");
            }
          };
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setError(err.message || "Unable to access camera");
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handlePlacement = () => {
    if (!dishPosition) {
      setDishPosition([0, -0.5, 0]);
      trigger("medium");
      console.log("Dish placed on table");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!dishPosition) return;

    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dishPosition) return;

    if (e.touches.length === 1 && touchStart) {
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;

      setRotation((prev) => ({
        x: prev.x - deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));

      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && lastDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );

      const delta = distance - lastDistance;
      setScale((prev) => Math.max(0.5, Math.min(5, prev + delta * 0.01)));
      setLastDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setLastDistance(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dishPosition) return;
    setIsMouseDown(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dishPosition || !isMouseDown || !mouseStart) return;

    const deltaX = e.clientX - mouseStart.x;
    const deltaY = e.clientY - mouseStart.y;

    setRotation((prev) => ({
      x: prev.x - deltaY * 0.01,
      y: prev.y + deltaX * 0.01,
    }));

    console.log("Mouse rotation delta:", {
      deltaX,
      deltaY,
      newRotationX: rotation.x - deltaY * 0.01,
      newRotationY: rotation.y + deltaX * 0.01,
    });

    setMouseStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setMouseStart(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!dishPosition) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(5, prev + 0.3));
    trigger("light");
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.3));
    trigger("light");
  };

  const handleReset = () => {
    setRotation({ x: 0, y: 0 });
    setScale(2);
    trigger("light");
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden px-4">
        <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center max-w-md mx-auto">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            Camera Access Required
          </h3>
          <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
            {error}. Please allow camera access to use AR features.
          </p>
          <button
            onClick={onClose}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {cameraReady && (
        <div className="absolute inset-0 w-full h-full">
          <Canvas
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: dishPosition ? "none" : "auto" }}
          >
            <ARScene
              modelPath={modelPath}
              dishPosition={dishPosition}
              scale={scale}
              rotation={rotation}
            />
          </Canvas>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-10 safe-top"
      >
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition-all shadow-lg flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {dishPosition && (
            <button
              onClick={handleReset}
              className="p-2 sm:p-3 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg"
            >
              <RotateCw size={16} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Reset</span>
            </button>
          )}
        </div>
      </motion.div>

      {!dishPosition && cameraReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 sm:bottom-24 left-4 right-4 z-10 safe-bottom"
        >
          <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-lg p-4 sm:p-6 rounded-xl sm:rounded-2xl text-white text-center shadow-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
              <p className="font-bold text-base sm:text-lg">Table Detected</p>
            </div>
            <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
              Point your camera at a flat surface. The golden grid shows where
              the dish will be placed.
            </p>
            <button
              onClick={handlePlacement}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-white/90 transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              <Check size={20} className="sm:w-6 sm:h-6" />
              Place Dish Here
            </button>
          </div>
        </motion.div>
      )}

      {dishPosition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 right-4 z-10 safe-bottom"
        >
          <div className="bg-white/10 backdrop-blur-lg p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <button
                onClick={handleZoomOut}
                className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all shadow-lg flex-shrink-0"
              >
                <ZoomOut size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex-1 text-center min-w-0">
                <p className="text-white font-semibold text-xs sm:text-sm mb-1">
                  🎯 Dish Placed!
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  • Drag to rotate 360°
                  <br className="hidden sm:inline" />
                  <span className="hidden sm:inline"> • </span>Scroll to zoom
                  <br className="hidden sm:inline" />
                  <span className="hidden sm:inline"> • </span>Buttons for control
                </p>
              </div>

              <button
                onClick={handleZoomIn}
                className="p-2 sm:p-2.5 md:p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all shadow-lg flex-shrink-0"
              >
                <ZoomIn size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
              <p className="text-white/60 text-xs mb-1">
                Scale: {scale.toFixed(1)}x
              </p>
              <div className="h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                  style={{ width: `${((scale - 0.5) / 4.5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
