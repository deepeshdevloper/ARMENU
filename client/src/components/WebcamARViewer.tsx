import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, AlertTriangle, Play, Check, X } from "lucide-react";
import { useARMenu } from "@/lib/stores/useARMenu";

function Model({ 
  modelPath, 
  scale = 2.5, 
  rotation = { x: 0, y: 0 },
  autoRotate = true
}: { 
  modelPath: string; 
  scale?: number;
  rotation?: { x: number; y: number };
  autoRotate?: boolean;
}) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      if (autoRotate) {
        modelRef.current.rotation.y += 0.005;
      } else {
        modelRef.current.rotation.x = rotation.x;
        modelRef.current.rotation.y = rotation.y;
      }
    }
  });

  const clonedScene = scene.clone();

  return (
    <group ref={modelRef} scale={scale} position={[0, -0.5, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function WebcamARViewer({ 
  modelPath, 
  onClose 
}: { 
  modelPath: string; 
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [modelScale, setModelScale] = useState(2.5);
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0 });
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { selectedDish } = useARMenu();

  useEffect(() => {
    let mounted = true;

    const startWebcam = async () => {
      try {
        console.log("Requesting webcam access...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log("Webcam access granted");
        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              videoRef.current?.play();
              setCameraReady(true);
              console.log("Webcam video playing");
            }
          };
        }
      } catch (err: any) {
        console.error("Webcam access error:", err);
        if (mounted) {
          setError(err.message || "Failed to access webcam");
          setCameraReady(false);
        }
      }
    };

    startWebcam();

    return () => {
      mounted = false;
      if (streamRef.current) {
        console.log("Stopping webcam stream");
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!cameraReady || isPlaced) return;

    const detectSurfaceTimer = setTimeout(() => {
      setSurfaceDetected(true);
      console.log("Surface detected - ready to place");
    }, 1500);

    return () => clearTimeout(detectSurfaceTimer);
  }, [cameraReady, isPlaced]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: isPlaced ? 'auto' : 'none' }}
        onWheel={(e) => {
          if (isPlaced) {
            const delta = e.deltaY * -0.001;
            setModelScale(prev => Math.max(0.5, Math.min(10, prev + delta)));
          }
        }}
        onMouseDown={(e) => {
          if (isPlaced) {
            setIsMouseDown(true);
            setMouseStart({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseMove={(e) => {
          if (isPlaced && isMouseDown && mouseStart) {
            const deltaX = e.clientX - mouseStart.x;
            const deltaY = e.clientY - mouseStart.y;

            setModelRotation((prev) => ({
              x: prev.x - deltaY * 0.01,
              y: prev.y + deltaX * 0.01,
            }));

            setMouseStart({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={() => {
          setIsMouseDown(false);
          setMouseStart(null);
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
          setMouseStart(null);
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <pointLight position={[-5, 5, 5]} intensity={0.8} />
          <spotLight 
            position={[0, 10, 0]} 
            intensity={1} 
            angle={0.3} 
            penumbra={1}
            castShadow
          />

          {!isPlaced && (
            <mesh position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.4, 0.5, 32]} />
              <meshBasicMaterial color="white" opacity={0.7} transparent side={THREE.DoubleSide} />
            </mesh>
          )}

          <Suspense fallback={null}>
            <Model 
              modelPath={modelPath} 
              scale={modelScale}
              rotation={modelRotation}
              autoRotate={!isPlaced}
            />
          </Suspense>

          {!isPlaced && (
            <OrbitControls 
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
            />
          )}
        </Canvas>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-colors pointer-events-auto safe-top safe-left"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="sm:w-6 sm:h-6"
        >
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>


      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40 pointer-events-auto px-4">
          <div className="bg-red-500/90 backdrop-blur-xl border border-red-300/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center max-w-sm mx-auto">
            <p className="text-white font-semibold text-base sm:text-lg mb-2">
              ⚠️ Camera Access Error
            </p>
            <p className="text-white/90 text-xs sm:text-sm mb-4">
              {error}
            </p>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {cameraReady && !error && !isPlaced && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
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

          <motion.div
            className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-auto safe-bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
              {!surfaceDetected ? (
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-white text-center border border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <p className="font-bold text-xs sm:text-sm">Finding Surface...</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/80">
                    Keep camera steady on table
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-md p-3 rounded-xl text-white text-center shadow-xl border-2 border-green-300/30"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className="font-bold text-sm sm:text-base">Surface Detected!</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/90">
                    Ready to place your dish
                  </p>
                </motion.div>
              )}
              <button
                onClick={() => setIsPlaced(true)}
                disabled={!surfaceDetected}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg ${
                  surfaceDetected
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white cursor-pointer'
                    : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                }`}
              >
                Place Dish Here
              </button>
            </div>
          </motion.div>
        </>
      )}

      {cameraReady && !error && isPlaced && selectedDish && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 sm:top-20 left-4 right-4 z-40 flex gap-2 justify-center safe-top pointer-events-auto"
          >
            <button
              onClick={() => {
                setShowIngredients(!showIngredients);
                setShowAllergens(false);
                setShowVideo(false);
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
                className="absolute top-32 sm:top-36 left-4 right-4 z-40 mx-auto max-w-xs safe-top pointer-events-auto"
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
                className="absolute top-32 sm:top-36 left-4 right-4 z-40 mx-auto max-w-xs safe-top pointer-events-auto"
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
                className="absolute top-32 sm:top-36 left-4 right-4 z-40 mx-auto max-w-sm safe-top pointer-events-auto"
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

      {cameraReady && !error && isPlaced && (
        <motion.div
          className="absolute bottom-4 sm:bottom-6 right-4 z-40 pointer-events-auto safe-bottom safe-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-2.5 sm:p-3 text-right max-w-[180px] sm:max-w-[200px]">
            <p className="text-white text-xs font-semibold mb-1">
              ✨ Dish Placed!
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs leading-tight">
              Drag to rotate<br/>
              Scroll to zoom
            </p>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-white/50 text-[9px] sm:text-[10px]">
                Scale: {modelScale.toFixed(1)}x
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
