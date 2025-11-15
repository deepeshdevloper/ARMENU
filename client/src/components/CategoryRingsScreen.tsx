import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { categories } from "@/data/menuData";
import { useARMenu, Category } from "@/lib/stores/useARMenu";

function DonutRing({ category, index, isSelected, onClick }: { 
  category: Category; 
  index: number; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const wobbleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 0.5 + wobbleOffset) * 0.1;
      const wobble = Math.sin(time * 0.25 + wobbleOffset) * 0.02;
      
      if (groupRef.current) {
        groupRef.current.position.y = floatY;
        groupRef.current.rotation.z = wobble;
      }
    }
  });

  const scale = isHovered ? 1.08 : isSelected ? 1.2 : 1.0;
  const opacity = isSelected ? 1 : isHovered ? 1 : 0.9;

  return (
    <group 
      ref={groupRef}
      position={[(index - 1.5) * 3, 0, 0]}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <mesh ref={meshRef} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial 
          color={category.neonColor} 
          emissive={category.neonColor}
          emissiveIntensity={isHovered ? 0.8 : isSelected ? 1.0 : 0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.3}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={category.color}
          emissive={category.color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function Scene({ selectedCategory, onSelect }: { 
  selectedCategory: Category | null; 
  onSelect: (cat: Category) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      {categories.map((category, index) => (
        <DonutRing
          key={category.id}
          category={category}
          index={index}
          isSelected={selectedCategory?.id === category.id}
          onClick={() => {
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
            onSelect(category);
          }}
        />
      ))}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function CategoryRingsScreen() {
  const selectCategory = useARMenu(state => state.selectCategory);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (category: Category) => {
    setSelectedCat(category);
    setIsTransitioning(true);
    
    setTimeout(() => {
      selectCategory(category);
    }, 800);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/50 to-black"
        style={{
          filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
          transition: 'filter 0.5s ease-out'
        }}
      />
      
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene selectedCategory={selectedCat} onSelect={handleSelect} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-20 pointer-events-none">
        <div className="flex gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: selectedCat && selectedCat.id !== category.id ? 0.4 : 1,
                y: 0,
                scale: selectedCat?.id === category.id ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
                {category.emoji} {category.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div
        className="absolute top-8 left-0 right-0 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-white text-4xl font-bold tracking-wide drop-shadow-xl">
          Choose Your Vibe
        </h1>
        <p className="text-white/80 text-sm mt-2">Tap a ring to explore dishes</p>
      </motion.div>
    </div>
  );
}
