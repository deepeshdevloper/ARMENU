import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { categories } from "@/data/menuData";
import { useARMenu, Category } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { useIsMobile } from "@/hooks/use-is-mobile";

const categoryModelMap: Record<string, string> = {
  spicy: "/models/burger.glb",
  dessert: "/models/cake.glb",
  drinks: "/models/cocktail.glb",
  veg: "/models/salad.glb"
};

function DishModel({ modelPath, isHovered, isSelected, isMobile }: { 
  modelPath: string | undefined; 
  isHovered: boolean;
  isSelected: boolean;
  isMobile: boolean;
}) {
  if (!modelPath) {
    return (
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#888888" emissive="#888888" emissiveIntensity={0.3} />
      </mesh>
    );
  }
  
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (modelRef.current) {
      const rotationSpeed = isHovered || isSelected ? 0.02 : 0.01;
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const modelScale = isMobile ? 0.8 : 1.0;
  
  return (
    <group ref={modelRef} scale={modelScale}>
      <primitive object={clonedScene} />
    </group>
  );
}

function DonutRing({ category, index, isSelected, onClick, isMobile }: { 
  category: Category; 
  index: number; 
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const circleRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const wobbleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.003;
      
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 0.5 + wobbleOffset) * 0.15;
      const wobble = Math.sin(time * 0.25 + wobbleOffset) * 0.03;
      
      if (groupRef.current) {
        groupRef.current.position.y = floatY;
        groupRef.current.rotation.z = wobble;
      }
    }
    
    if (circleRef.current) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      circleRef.current.scale.setScalar(pulseScale);
    }
  });

  const scale = isHovered ? 1.08 : isSelected ? 1.2 : 1.0;
  const opacity = isSelected ? 1 : isHovered ? 1 : 0.85;
  const modelPath = categoryModelMap[category.id];
  
  const ringSize = isMobile ? 1.4 : 1.6;
  const ringThickness = isMobile ? 0.12 : 0.15;

  return (
    <group 
      ref={groupRef}
      position={[(index - 1.5) * (isMobile ? 3.8 : 4.2), 0, 0]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <mesh ref={circleRef} rotation={[0, 0, 0]} position={[0, 0, -0.2]}>
        <circleGeometry args={[ringSize * 0.85, 64]} />
        <meshStandardMaterial 
          color={category.color} 
          emissive={category.color}
          emissiveIntensity={isHovered ? 0.4 : isSelected ? 0.6 : 0.2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh ref={ringRef} scale={scale}>
        <torusGeometry args={[ringSize, ringThickness, 32, 64]} />
        <meshStandardMaterial 
          color={category.neonColor} 
          emissive={category.neonColor}
          emissiveIntensity={isHovered ? 1.2 : isSelected ? 1.5 : 0.6}
          transparent
          opacity={opacity}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      <Suspense fallback={null}>
        <DishModel 
          modelPath={modelPath} 
          isHovered={isHovered}
          isSelected={isSelected}
          isMobile={isMobile}
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <Text
          position={[0, -1.2, 0]}
          fontSize={isMobile ? 0.18 : 0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {category.emoji}
        </Text>
      </Suspense>
    </group>
  );
}

function Scene({ selectedCategory, onSelect, onVibrate, isMobile }: { 
  selectedCategory: Category | null; 
  onSelect: (cat: Category) => void;
  onVibrate: () => void;
  isMobile: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
      {categories.map((category, index) => (
        <DonutRing
          key={category.id}
          category={category}
          index={index}
          isSelected={selectedCategory?.id === category.id}
          onClick={() => {
            onVibrate();
            onSelect(category);
          }}
          isMobile={isMobile}
        />
      ))}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export function CategoryRingsScreen() {
  const selectCategory = useARMenu(state => state.selectCategory);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { trigger } = useHaptics();
  const isMobile = useIsMobile();

  const handleSelect = (category: Category) => {
    if (isTransitioning) return;
    
    setSelectedCat(category);
    setIsTransitioning(true);
    trigger('medium');
    
    setTimeout(() => {
      selectCategory(category);
      setIsTransitioning(false);
    }, 600);
  };

  const handleVibrate = () => {
    trigger('light');
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black"
        style={{
          filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
          transition: 'filter 0.5s ease-out'
        }}
      />
      
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, isMobile ? 11 : 9], fov: isMobile ? 50 : 45 }}>
          <Suspense fallback={null}>
            <Scene 
              selectedCategory={selectedCat} 
              onSelect={handleSelect} 
              onVibrate={handleVibrate}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end safe-bottom pb-8 sm:pb-12 md:pb-16 pointer-events-none px-4">
        <div className="flex flex-wrap gap-3 sm:gap-5 md:gap-6 justify-center max-w-4xl">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: selectedCat && selectedCat.id !== category.id ? 0.3 : 1,
                y: 0,
                scale: selectedCat?.id === category.id ? 1.15 : 1
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <p className="text-white text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                  {category.emoji} {category.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div
        className="absolute top-4 sm:top-6 left-0 right-0 text-center safe-top px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="inline-block"
        >
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 shadow-lg">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">
              👋 Welcome to AR Menu
            </h1>
            <p className="text-white/70 text-xs sm:text-sm">Tap a ring to explore delicious dishes</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
