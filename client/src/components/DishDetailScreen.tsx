import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useARMenu } from "@/lib/stores/useARMenu";
import { ChevronLeft, Camera } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";

function IngredientHalo({ ingredients }: { ingredients: string[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const icons = useMemo(() => {
    const radius = 4;
    return ingredients.slice(0, 6).map((ingredient, i) => {
      const angle = (i / ingredients.slice(0, 6).length) * Math.PI * 2;
      return {
        ingredient,
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * 0.5,
          Math.sin(angle) * radius
        ] as [number, number, number],
      };
    });
  }, [ingredients]);

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
      </mesh>

      {icons.map((item, i) => (
        <Text
          key={i}
          position={item.position}
          fontSize={0.25}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {item.ingredient.slice(0, 8)}
        </Text>
      ))}
    </group>
  );
}

function FloatingDish({ modelPath }: { modelPath: string }) {
  const dishRef = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (dishRef.current) {
      dishRef.current.rotation.y += 0.008;
      const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      dishRef.current.position.y = 1 + floatY;
    }

    if (plateRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      plateRef.current.scale.setScalar(pulse);
    }

    if (lightRef.current) {
      const progress = (state.clock.elapsedTime * 0.3) % 1;
      const angle = progress * Math.PI * 2;
      lightRef.current.position.x = Math.cos(angle) * 5;
      lightRef.current.position.z = Math.sin(angle) * 5;
    }
  });

  return (
    <>
      <mesh ref={plateRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5, 64]} />
        <meshPhysicalMaterial
          color="#E8E8E8"
          metalness={0.3}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.5, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <group ref={dishRef} scale={3.5} rotation={[0, 0, 0]}>
        <primitive object={clonedScene} castShadow />
      </group>

      <pointLight
        ref={lightRef}
        position={[5, 4, 0]}
        intensity={0.8}
        color="#FFD700"
        distance={10}
      />
    </>
  );
}

function Scene3D({ modelPath, ingredients }: { modelPath: string; ingredients: string[] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={45} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.4} color="#ffffff" />

      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#FF69B4" />
      <pointLight position={[5, 3, -5]} intensity={0.6} color="#00CED1" />

      <directionalLight position={[0, 10, 0]} intensity={0.5} color="#FFD700" />

      <Suspense fallback={null}>
        <FloatingDish modelPath={modelPath} />
        <IngredientHalo ingredients={ingredients} />
      </Suspense>

      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
}

export function DishDetailScreen() {
  const { selectedDish, setScreen } = useARMenu();
  const { trigger } = useHaptics();
  const [isARSupported, setIsARSupported] = useState(false);

  if (!selectedDish) return null;

  const handleEnterAR = () => {
    console.log('DishDetailScreen: Entering AR mode');
    trigger('heavy');
    setScreen("ar");
  };

  const handleBack = () => {
    console.log('DishDetailScreen: Going back to dish list');
    trigger('light');
    setScreen("dishList");
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-neutral-900" />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 30% 70%, rgba(255, 215, 0, 0.06) 0%, transparent 60%)',
            'radial-gradient(circle at 70% 30%, rgba(184, 134, 11, 0.08) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600/20 to-amber-700/20 backdrop-blur-xl border border-yellow-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ChevronLeft className="w-6 h-6 text-yellow-400" />
      </motion.button>

      <div className="absolute inset-0 flex flex-col">
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Canvas shadows>
            <Scene3D modelPath={selectedDish.modelPath} ingredients={selectedDish.ingredients} />
          </Canvas>
        </motion.div>

        <motion.div
          className="relative z-10 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl px-6 pb-8 pt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
              >
                {selectedDish.emoji} {selectedDish.name}
              </motion.h1>

              <motion.p
                className="text-gray-300 text-base mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {selectedDish.description}
              </motion.p>

              <motion.div
                className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-600/20 to-amber-700/20 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">{selectedDish.calories} cal</span>
              </motion.div>
            </div>

            <motion.button
              onClick={handleEnterAR}
              className="w-full py-4 rounded-full font-bold text-white relative overflow-hidden group mb-4"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                boxShadow: '0 10px 40px rgba(212, 175, 55, 0.5)',
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 15px 50px rgba(212, 175, 55, 0.7)',
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                <Camera className="w-6 h-6" />
                Place on Your Table in AR
              </span>
            </motion.button>

            <motion.div
              className="bg-yellow-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-yellow-200/80 text-sm text-center">
                📱 Mobile: Place on real tables | 💻 Desktop: View with webcam
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
