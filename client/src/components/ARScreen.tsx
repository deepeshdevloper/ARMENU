import { XR, Controllers, Hands, XRButton, useHitTest, useXR } from "@react-three/xr";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useARMenu } from "@/lib/stores/useARMenu";
import { ChevronLeft, RotateCw, Maximize2 } from "lucide-react";

function Reticle({ color, isStable }: { color: string; isStable: boolean }) {
  const reticleRef = useRef<THREE.Group>(null);
  const { isPresenting } = useXR();
  
  useHitTest((hitMatrix) => {
    if (reticleRef.current) {
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      );
      reticleRef.current.visible = true;
    }
  });

  useFrame((state) => {
    if (reticleRef.current && isStable) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      reticleRef.current.scale.setScalar(scale * 0.5);
    }
  });

  if (!isPresenting) return null;

  return (
    <group ref={reticleRef} visible={false}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isStable ? 0.8 : 0.4}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.02, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function ARDishModel({ modelPath, color, onPlaced }: { 
  modelPath: string; 
  color: string;
  onPlaced: (position: THREE.Vector3) => void;
}) {
  const { scene: gltfModel } = useGLTF(modelPath);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const modelRef = useRef<THREE.Group>(null);
  const clonedModel = useRef<THREE.Group | null>(null);
  const { isPresenting } = useXR();

  useEffect(() => {
    if (gltfModel && !clonedModel.current) {
      clonedModel.current = gltfModel.clone();
      clonedModel.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltfModel]);

  useHitTest((hitMatrix) => {
    if (clonedModel.current && modelRef.current && isPresenting) {
      const position = new THREE.Vector3();
      hitMatrix.decompose(position, new THREE.Quaternion(), new THREE.Vector3());
      modelRef.current.position.copy(position);
      modelRef.current.position.y += 0.05;
    }
  });

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation;
      modelRef.current.scale.setScalar(scale * 2.5);
    }
  });

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 2 && modelRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const prevDistance = (window as any)._prevDistance || distance;
        const scaleChange = distance / prevDistance;
        
        setScale(prev => Math.max(0.5, Math.min(2.0, prev * scaleChange)));
        (window as any)._prevDistance = distance;
        
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        const prevAngle = (window as any)._prevAngle || angle;
        const rotationChange = angle - prevAngle;
        
        setRotation(prev => prev + rotationChange);
        (window as any)._prevAngle = angle;
      }
    };

    const handleTouchEnd = () => {
      delete (window as any)._prevDistance;
      delete (window as any)._prevAngle;
    };

    window.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <group ref={modelRef}>
      {clonedModel.current && (
        <primitive object={clonedModel.current} />
      )}
      <pointLight color={color} intensity={0.8} distance={3} />
    </group>
  );
}

function ARScene({ dish }: { dish: any }) {
  const [modelPlaced, setModelPlaced] = useState(false);
  const [hitTestStable, setHitTestStable] = useState(false);
  const [noSurfaceTimer, setNoSurfaceTimer] = useState(0);
  const { isPresenting } = useXR();

  useFrame((state, delta) => {
    if (isPresenting && !hitTestStable) {
      setNoSurfaceTimer(prev => prev + delta);
    }
  });

  const color = dish.emoji === '🔥' ? '#EF4444' : 
                dish.emoji === '🍫' ? '#F9A8D4' :
                dish.emoji === '🍹' ? '#67E8F9' : '#6EE7B7';

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {!modelPlaced && (
        <Reticle color={color} isStable={hitTestStable} />
      )}
      
      {modelPlaced && (
        <ARDishModel 
          modelPath={dish.modelPath} 
          color={color}
          onPlaced={(pos) => console.log('Model placed at:', pos)}
        />
      )}
      
      <Controllers />
      <Hands />
    </>
  );
}

function FallbackViewer({ dish }: { dish: any }) {
  const { scene: gltfModel } = useGLTF(dish.modelPath);
  const clonedModel = useRef<THREE.Group | null>(null);
  
  const color = dish.emoji === '🔥' ? '#EF4444' : 
                dish.emoji === '🍫' ? '#F9A8D4' :
                dish.emoji === '🍹' ? '#67E8F9' : '#6EE7B7';

  useEffect(() => {
    if (gltfModel && !clonedModel.current) {
      clonedModel.current = gltfModel.clone();
      clonedModel.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltfModel]);

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
          <XRButton
            mode="AR"
            sessionInit={{
              requiredFeatures: ['hit-test', 'dom-overlay'],
              domOverlay: { root: document.body }
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
          </XRButton>

          <Canvas>
            <XR>
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
