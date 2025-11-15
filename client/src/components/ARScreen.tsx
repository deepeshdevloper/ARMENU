import { XR, createXRStore } from "@react-three/xr";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useARMenu } from "@/lib/stores/useARMenu";
import { ChevronLeft, RotateCw, Maximize2 } from "lucide-react";

const xrStore = createXRStore();

function Reticle({ color }: { color: string }) {
  const reticleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reticleRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      reticleRef.current.scale.setScalar(scale * 0.5);
    }
  });

  return (
    <group ref={reticleRef} position={[0, 0, -2]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function ARDishModel({ modelPath, color }: { 
  modelPath: string; 
  color: string;
}) {
  const gltf = useGLTF(modelPath);
  const clonedModel = useRef<THREE.Group | null>(null);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;
    if (scene && !clonedModel.current) {
      clonedModel.current = scene.clone();
      if (clonedModel.current) {
        clonedModel.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }
  }, [gltf]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, -1.5]} scale={2.5}>
      {clonedModel.current && (
        <primitive object={clonedModel.current} />
      )}
      <pointLight color={color} intensity={0.8} distance={3} />
    </group>
  );
}

function ARScene({ dish }: { dish: any }) {
  const color = dish.emoji === '🔥' ? '#EF4444' : 
                dish.emoji === '🍫' ? '#F9A8D4' :
                dish.emoji === '🍹' ? '#67E8F9' : '#6EE7B7';

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.3} />
      
      <Reticle color={color} />
      <ARDishModel 
        modelPath={dish.modelPath} 
        color={color}
      />
    </>
  );
}

function FallbackViewer({ dish }: { dish: any }) {
  const gltf = useGLTF(dish.modelPath);
  const clonedModel = useRef<THREE.Group | null>(null);
  
  const color = dish.emoji === '🔥' ? '#EF4444' : 
                dish.emoji === '🍫' ? '#F9A8D4' :
                dish.emoji === '🍹' ? '#67E8F9' : '#6EE7B7';

  useEffect(() => {
    const scene = Array.isArray(gltf) ? gltf[0]?.scene : gltf?.scene;
    if (scene && !clonedModel.current) {
      clonedModel.current = scene.clone();
      if (clonedModel.current) {
        clonedModel.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }
  }, [gltf]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      <spotLight position={[0, 5, 0]} intensity={0.5} color={color} />
      
      {clonedModel.current && (
        <primitive object={clonedModel.current} scale={2.5} />
      )}
      
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
}

export function ARScreen() {
  const { selectedDish, setScreen } = useARMenu();
  const [isARSupported, setIsARSupported] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showNoSurfaceWarning, setShowNoSurfaceWarning] = useState(false);
  const [infoVisible, setInfoVisible] = useState(true);

  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
        } catch {
          setIsARSupported(false);
        }
      } else {
        setIsARSupported(false);
      }
    };

    checkARSupport();

    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 4000);

    const infoTimer = setTimeout(() => {
      setInfoVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(infoTimer);
    };
  }, []);

  if (!selectedDish) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <button
        onClick={() => setScreen("dishDetail")}
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-w-md px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-white text-lg mb-2">
                📱 Move your device slowly
              </p>
              <p className="text-white/70 text-sm">
                Point at a flat surface to detect the table
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoVisible && (
          <motion.div
            className="absolute bottom-20 left-0 right-0 z-40 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
              <p className="text-white/60 text-xs">
                {selectedDish.ingredients.slice(0, 3).join(' • ')}
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
        <button
          onClick={() => {}}
          className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {isARSupported ? (
        <>
          <button
            onClick={() => {
              xrStore.enterAR();
            }}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              padding: '16px 32px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Start AR Experience
          </button>

          <Canvas>
            <XR store={xrStore}>
              <Suspense fallback={null}>
                <ARScene dish={selectedDish} />
              </Suspense>
            </XR>
          </Canvas>
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <Suspense fallback={null}>
                <FallbackViewer dish={selectedDish} />
              </Suspense>
            </Canvas>
          </div>
          <div className="p-6 bg-black/80 backdrop-blur-xl border-t border-white/20">
            <p className="text-white text-center mb-2">
              ⚠️ AR Not Supported
            </p>
            <p className="text-white/70 text-sm text-center">
              Your device doesn't support AR. Showing 3D view instead. Drag to rotate, scroll to zoom.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
