import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptics } from "@/hooks/useHaptics";
import { X, ZoomIn, ZoomOut, RotateCw, Check, ChefHat, AlertTriangle, Play } from "lucide-react";
import { getDishById } from "@/data/menuData";
import { useARMenu } from "@/lib/stores/useARMenu";

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
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.4, 32]} />
            <meshBasicMaterial color="#4CAF50" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.33, 32]} />
            <meshBasicMaterial color="#4CAF50" transparent opacity={0.15} />
          </mesh>
        </>
      )}
    </group>
  );
}

function PlacementGrid({ visible }: { visible: boolean }) {
  return visible ? (
    <group position={[0, 0, 0]}>
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
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
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
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2a2a2a" opacity={0.5} transparent />
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
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { trigger } = useHaptics();
  const { selectedDish } = useARMenu();

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

  useEffect(() => {
    if (!cameraReady || dishPosition) return;

    const detectSurfaceTimer = setTimeout(() => {
      setSurfaceDetected(true);
      trigger("light");
      console.log("Surface detected - ready to place");
    }, 1500);

    return () => clearTimeout(detectSurfaceTimer);
  }, [cameraReady, dishPosition, trigger]);

  const handlePlacement = () => {
    if (!dishPosition) {
      setDishPosition([0, 0, 0]);
      trigger("medium");
      console.log("Dish placed on table at surface level");
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
          
          {!dishPosition && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className={`w-32 h-32 sm:w-40 sm:h-40 border-2 rounded-lg relative transition-all duration-300 ${
                  surfaceDetected 
                    ? 'border-green-400/80 shadow-lg shadow-green-400/20' 
                    : 'border-yellow-400/60'
                }`}>
                  <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 transition-colors ${
                    surfaceDetected ? 'border-green-400' : 'border-yellow-400'
                  }`}></div>
                  <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 transition-colors ${
                    surfaceDetected ? 'border-green-400' : 'border-yellow-400'
                  }`}></div>
                  <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 transition-colors ${
                    surfaceDetected ? 'border-green-400' : 'border-yellow-400'
                  }`}></div>
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 transition-colors ${
                    surfaceDetected ? 'border-green-400' : 'border-yellow-400'
                  }`}></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    {surfaceDetected ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Check size={20} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className={`backdrop-blur-sm px-3 py-1 rounded-full transition-colors ${
                    surfaceDetected 
                      ? 'bg-green-500/80' 
                      : 'bg-black/60'
                  }`}>
                    <p className={`text-xs font-semibold transition-colors ${
                      surfaceDetected ? 'text-white' : 'text-yellow-400'
                    }`}>
                      {surfaceDetected ? '✓ Surface Locked' : 'Scanning...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          className="absolute bottom-4 sm:bottom-6 left-4 right-4 z-10 safe-bottom"
        >
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
            {!surfaceDetected ? (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-white text-center shadow-lg border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <p className="font-bold text-sm sm:text-base">Finding Surface...</p>
                </div>
                <p className="text-xs sm:text-sm text-white/80 mb-2">
                  Point your camera at a <span className="font-semibold text-yellow-300">table or flat surface</span>
                </p>
                <div className="flex items-start gap-2 bg-white/5 rounded-lg p-2 text-left">
                  <span className="text-yellow-300 text-lg">💡</span>
                  <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed">
                    Keep your camera steady and pointed at the center of the surface
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-md p-4 rounded-xl text-white text-center shadow-xl border-2 border-green-300/30"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <p className="font-bold text-base sm:text-lg">Surface Detected!</p>
                </div>
                <p className="text-xs sm:text-sm text-white/90">
                  Ready to place your dish
                </p>
              </motion.div>
            )}
            <button
              onClick={handlePlacement}
              disabled={!surfaceDetected}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg flex items-center gap-2 ${
                surfaceDetected
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 cursor-pointer'
                  : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
              }`}
            >
              <Check size={18} className="sm:w-5 sm:h-5" />
              Place Dish on Surface
            </button>
          </div>
        </motion.div>
      )}

      {dishPosition && selectedDish && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 sm:top-20 left-4 right-4 z-10 flex gap-2 justify-center safe-top"
          >
            <button
              onClick={() => {
                setShowIngredients(!showIngredients);
                setShowAllergens(false);
                setShowVideo(false);
                trigger("light");
              }}
              className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                showIngredients 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
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
                trigger("light");
              }}
              className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                showAllergens 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                  : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
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
                  trigger("light");
                }}
                className={`px-3 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                  showVideo 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                    : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                }`}
              >
                <Play size={14} />
                <span className="hidden sm:inline">Recipe</span>
              </button>
            )}
          </motion.div>

          <AnimatePresence>
            {showIngredients && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-32 sm:top-36 left-4 right-4 z-10 mx-auto max-w-xs safe-top"
              >
                <div className="bg-gradient-to-br from-green-500/95 to-emerald-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-green-300/30">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat size={18} className="text-white" />
                    <h3 className="text-white font-bold text-sm">Ingredients</h3>
                  </div>
                  <div className="space-y-1.5">
                    {selectedDish.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/90">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <span className="text-xs">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {showAllergens && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-32 sm:top-36 left-4 right-4 z-10 mx-auto max-w-xs safe-top"
              >
                <div className="bg-gradient-to-br from-orange-500/95 to-red-600/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-orange-300/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-white" />
                    <h3 className="text-white font-bold text-sm">Allergen Information</h3>
                  </div>
                  {selectedDish.allergens.includes("None") ? (
                    <div className="flex items-center gap-2 text-white/90">
                      <Check size={14} className="text-white" />
                      <span className="text-xs">No common allergens</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedDish.allergens.map((allergen, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white/90">
                          <AlertTriangle size={12} className="text-white" />
                          <span className="text-xs font-semibold">{allergen}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {showVideo && selectedDish.videoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-32 sm:top-36 left-4 right-4 z-10 mx-auto max-w-sm safe-top"
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
          </AnimatePresence>
        </>
      )}

      {dishPosition && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 sm:bottom-6 right-4 z-10 safe-bottom safe-right"
        >
          <div className="bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-lg shadow-xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all"
                >
                  <ZoomOut size={18} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all"
                >
                  <ZoomIn size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-white/60 text-[10px] sm:text-xs mb-1">
                  {scale.toFixed(1)}x
                </p>
                <div className="h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden w-16 sm:w-20">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                    style={{ width: `${((scale - 0.5) / 4.5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/10">
                <p className="text-white/50 text-[9px] sm:text-[10px]">
                  Drag • Scroll
                </p>
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
