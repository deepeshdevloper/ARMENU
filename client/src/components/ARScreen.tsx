import { XR, createXRStore, useXR } from "@react-three/xr";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { ChevronLeft, RotateCw, Maximize2 } from "lucide-react";

const xrStore = createXRStore();

type ReticleState = 'searching' | 'found' | 'placed';

function Reticle({ 
  color, 
  state,
  onPlaced 
}: { 
  color: string; 
  state: ReticleState;
  onPlaced: (position: THREE.Vector3) => void;
}) {
  const reticleRef = useRef<THREE.Group>(null);
  const [hitPosition, setHitPosition] = useState<THREE.Vector3 | null>(null);
  const { trigger } = useHaptics();

  const { session } = useXR();
  
  useFrame(() => {
    if (session && reticleRef.current && state !== 'placed') {
      const referenceSpace = (session as any).referenceSpace;
      if (referenceSpace) {
        reticleRef.current.visible = true;
        
        if (!hitPosition && state === 'searching') {
          const tempPosition = new THREE.Vector3(0, -0.5, -1.5);
          setHitPosition(tempPosition);
          trigger('light');
        }
      }
    }
  });

  useFrame((frameState) => {
    if (reticleRef.current && state !== 'placed') {
      const baseScale = state === 'found' ? 0.6 : 0.5;
      const pulse = 1 + Math.sin(frameState.clock.elapsedTime * 4) * 0.15;
      reticleRef.current.scale.setScalar(baseScale * pulse);
    }
  });

  useEffect(() => {
    const handleTouch = () => {
      if (hitPosition && state === 'found') {
        trigger('heavy');
        onPlaced(hitPosition);
      }
    };

    window.addEventListener('click', handleTouch);
    return () => window.removeEventListener('click', handleTouch);
  }, [hitPosition, state, onPlaced, trigger]);

  const reticleColor = state === 'searching' ? '#FCD34D' : 
                       state === 'found' ? '#10B981' : color;
  const reticleOpacity = state === 'placed' ? 0 : 0.8;

  return (
    <group ref={reticleRef} matrixAutoUpdate={false} visible={false}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial 
          color={reticleColor} 
          transparent 
          opacity={reticleOpacity}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color={reticleColor} opacity={reticleOpacity} transparent />
      </mesh>
      {state === 'found' && (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
            <ringGeometry args={[0.15, 0.16, 32]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.3} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
            <ringGeometry args={[0.18, 0.19, 32]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.2} />
          </mesh>
        </>
      )}
    </group>
  );
}

function ARDishModel({ 
  modelPath, 
  color,
  position,
  isPlaced 
}: { 
  modelPath: string; 
  color: string;
  position: THREE.Vector3 | null;
  isPlaced: boolean;
}) {
  const gltf = useGLTF(modelPath);
  const clonedModel = useRef<THREE.Group | null>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

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

  useEffect(() => {
    if (isPlaced) {
      setAnimationProgress(0);
    }
  }, [isPlaced]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      if (isPlaced && position) {
        if (animationProgress < 1) {
          setAnimationProgress(Math.min(1, animationProgress + delta * 2));
          const currentY = THREE.MathUtils.lerp(position.y + 0.3, position.y, animationProgress);
          modelRef.current.position.set(position.x, currentY, position.z);
          modelRef.current.scale.setScalar(2.5 * animationProgress);
        }
        modelRef.current.rotation.y += 0.005;
      }
    }
  });

  if (!isPlaced || !position) return null;

  return (
    <group ref={modelRef} scale={0}>
      {clonedModel.current && (
        <primitive object={clonedModel.current} />
      )}
      <pointLight color={color} intensity={0.8} distance={3} position={[0, 0.5, 0]} />
      <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function ARScene({ dish }: { dish: any }) {
  const [reticleState, setReticleState] = useState<ReticleState>('searching');
  const [modelPosition, setModelPosition] = useState<THREE.Vector3 | null>(null);
  const { trigger } = useHaptics();
  const { session } = useXR();

  const color = dish.emoji === '🔥' ? '#EF4444' : 
                dish.emoji === '🍫' ? '#F9A8D4' :
                dish.emoji === '🍹' ? '#67E8F9' : '#6EE7B7';

  useEffect(() => {
    if (session) {
      console.log('AR session started');
      trigger('medium');
    }
  }, [session, trigger]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reticleState === 'searching') {
        setReticleState('found');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [reticleState]);

  const handlePlaced = (position: THREE.Vector3) => {
    console.log('Dish placed at:', position);
    setModelPosition(position);
    setReticleState('placed');
    trigger('heavy');
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.3} />
      
      <Reticle color={color} state={reticleState} onPlaced={handlePlaced} />
      <ARDishModel 
        modelPath={dish.modelPath} 
        color={color}
        position={modelPosition}
        isPlaced={reticleState === 'placed'}
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
  const [arStatus, setARStatus] = useState<'loading' | 'ready' | 'active' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoVisible, setInfoVisible] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { trigger } = useHaptics();

  useEffect(() => {
    const checkARSupport = async () => {
      console.log('Checking AR support...');
      
      if (!('xr' in navigator)) {
        console.warn('WebXR not available - device or browser does not support AR');
        setIsARSupported(false);
        setARStatus('error');
        setErrorMessage('Your browser doesn\'t support AR features. Please use Chrome or Safari on a compatible device.');
        return;
      }

      try {
        const xr = (navigator as any).xr;
        if (!xr) {
          throw new Error('XR object not found');
        }

        const supported = await xr.isSessionSupported('immersive-ar');
        console.log('AR session support:', supported);
        
        setIsARSupported(supported);
        
        if (supported) {
          setARStatus('ready');
          trigger('light');
        } else {
          setARStatus('error');
          setErrorMessage('AR is not available on this device. You can still view the 3D model below.');
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setIsARSupported(false);
        setARStatus('error');
        setErrorMessage('Unable to initialize AR. Please ensure you have camera permissions enabled.');
      }
    };

    checkARSupport();

    const infoTimer = setTimeout(() => {
      setInfoVisible(false);
    }, 3000);

    return () => {
      clearTimeout(infoTimer);
    };
  }, [trigger, retryCount]);

  const handleRetry = () => {
    console.log('Retrying AR initialization...');
    setARStatus('loading');
    setErrorMessage('');
    setRetryCount(prev => prev + 1);
    trigger('light');
  };

  const handleARStart = () => {
    trigger('medium');
    setARStatus('active');
    try {
      xrStore.enterAR();
      console.log('Entering AR mode...');
    } catch (error) {
      console.error('Error starting AR:', error);
      setARStatus('error');
      setErrorMessage('Failed to start AR session. Please try again.');
    }
  };

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
        {arStatus === 'loading' && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 max-w-md px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <div className="mb-3">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              </div>
              <p className="text-white text-lg">
                Initializing AR...
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

      {isARSupported && arStatus === 'ready' ? (
        <>
          <motion.button
            onClick={handleARStart}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-base shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🚀 Start AR Experience
          </motion.button>

          <Canvas onCreated={() => setModelLoading(false)}>
            <XR store={xrStore}>
              <Suspense fallback={null}>
                <ARScene dish={selectedDish} />
              </Suspense>
            </XR>
          </Canvas>
          
          {modelLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p>Loading 3D model...</p>
              </div>
            </div>
          )}
        </>
      ) : arStatus === 'active' ? (
        <Canvas onCreated={() => setModelLoading(false)}>
          <XR store={xrStore}>
            <Suspense fallback={null}>
              <ARScene dish={selectedDish} />
            </Suspense>
          </XR>
        </Canvas>
      ) : arStatus === 'error' ? (
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
