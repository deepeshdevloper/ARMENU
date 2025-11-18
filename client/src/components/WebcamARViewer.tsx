import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

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

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
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
        className="absolute top-6 left-6 z-50 p-3 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-colors pointer-events-auto"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>


      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40 pointer-events-auto">
          <div className="bg-red-500/90 backdrop-blur-xl border border-red-300/20 rounded-2xl p-6 text-center max-w-sm">
            <p className="text-white font-semibold text-lg mb-2">
              ⚠️ Camera Access Error
            </p>
            <p className="text-white/90 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {cameraReady && !error && !isPlaced && (
        <motion.div
          className="absolute bottom-6 left-0 right-0 z-40 px-6 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center max-w-md mx-auto">
            <p className="text-white text-sm font-semibold mb-2">
              📍 Click to Place on Table
            </p>
            <p className="text-white/70 text-xs">
              Click anywhere on the white ring to place the dish
            </p>
          </div>
          <button
            onClick={() => setIsPlaced(true)}
            className="mt-4 mx-auto block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-colors"
          >
            Place Dish Here
          </button>
        </motion.div>
      )}

      {cameraReady && !error && isPlaced && (
        <motion.div
          className="absolute bottom-6 left-0 right-0 z-40 px-6 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center max-w-md mx-auto">
            <p className="text-white text-sm font-semibold mb-1">
              ✨ Dish Placed!
            </p>
            <p className="text-white/70 text-xs">
              • Drag to rotate 360° on all axes<br/>
              • Scroll to zoom
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
