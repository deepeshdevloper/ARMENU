import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Text } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { categories as defaultCategories } from "@/data/menuData";
import { useARMenu, Category } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import menuJson from "@/data/menu.json";

const categoryModelMap: Record<string, string> = menuJson.categories.reduce((acc: any, cat: any) => {
  if (cat.model) {
    acc[cat.id] = cat.model;
  }
  return acc;
}, {});

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
  
  const modelScale = isMobile ? 2.8 : 3.5;
  
  return (
    <group ref={modelRef} scale={modelScale}>
      <primitive object={clonedScene} />
    </group>
  );
}

function DonutRing({ category, position, isSelected, onClick, isMobile, totalCategories }: { 
  category: Category; 
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
  isMobile: boolean;
  totalCategories: number;
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
  
  const ringSize = isMobile ? 2.2 : 3.0;
  const ringThickness = isMobile ? 0.18 : 0.22;

  return (
    <group 
      ref={groupRef}
      position={position}
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
          position={[0, -1.5, 0]}
          fontSize={isMobile ? 0.22 : 0.28}
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

function Scene({ selectedCategory, onSelect, onVibrate, isMobile, categories, carouselOffset }: { 
  selectedCategory: Category | null; 
  onSelect: (cat: Category) => void;
  onVibrate: () => void;
  isMobile: boolean;
  categories: Category[];
  carouselOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const spacing = isMobile ? 6.5 : 7.5;
    const numRings = categories.length;
    const startX = -spacing * (numRings - 1) / 2;
    
    return categories.map((_, index) => {
      const x = startX + index * spacing;
      const z = -8;
      const y = 0;
      
      return [x, y, z] as [number, number, number];
    });
  }, [categories.length, isMobile]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
      <group ref={groupRef}>
        {categories.map((category, index) => (
          <DonutRing
            key={category.id}
            category={category}
            position={positions[index]}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => {
              onVibrate();
              onSelect(category);
            }}
            isMobile={isMobile}
            totalCategories={categories.length}
          />
        ))}
      </group>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
        enableRotate={false}
        rotateSpeed={0.5}
      />
    </>
  );
}

export function CategoryRingsScreen() {
  const selectCategory = useARMenu(state => state.selectCategory);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [carouselPage, setCarouselPage] = useState(0);
  const { trigger } = useHaptics();
  const isMobile = useIsMobile();

  const categories = defaultCategories;
  const RINGS_PER_PAGE = isMobile ? 3 : 4;
  const totalPages = Math.ceil(categories.length / RINGS_PER_PAGE);

  const cameraConfig = useMemo(() => {
    return {
      position: [0, 0, isMobile ? 14 : 12] as [number, number, number],
      fov: isMobile ? 65 : 60
    };
  }, [isMobile]);

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

  const handleNextPage = () => {
    if (carouselPage < totalPages - 1) {
      setCarouselPage(prev => prev + 1);
      trigger('light');
    }
  };

  const handlePrevPage = () => {
    if (carouselPage > 0) {
      setCarouselPage(prev => prev - 1);
      trigger('light');
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && carouselPage < totalPages - 1) {
      handleNextPage();
    } else if (info.offset.x > threshold && carouselPage > 0) {
      handlePrevPage();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-orange-800 via-green-900 to-amber-950"
        style={{
          filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
          transition: 'filter 0.5s ease-out'
        }}
      />
      
      <motion.div 
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <Canvas camera={{ position: cameraConfig.position, fov: cameraConfig.fov }}>
          <Suspense fallback={null}>
            <Scene 
              selectedCategory={selectedCat} 
              onSelect={handleSelect} 
              onVibrate={handleVibrate}
              isMobile={isMobile}
              categories={categories.slice(carouselPage * RINGS_PER_PAGE, (carouselPage + 1) * RINGS_PER_PAGE)}
              carouselOffset={0}
            />
          </Suspense>
        </Canvas>
      </motion.div>
      
      {carouselPage > 0 && (
        <motion.button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition-colors z-10 border border-white/20"
          onClick={handlePrevPage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      )}
      
      {carouselPage < totalPages - 1 && (
        <motion.button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition-colors z-10 border border-white/20"
          onClick={handleNextPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center safe-bottom pb-6 sm:pb-10 md:pb-14 pointer-events-none px-2 sm:px-4 gap-4">
        <div className="flex gap-2 pointer-events-auto">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCarouselPage(index);
                trigger('light');
              }}
              className={`h-2 rounded-full transition-all ${
                index === carouselPage 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        
        <div className="w-full max-w-6xl pointer-events-auto overflow-hidden">
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center px-2 pb-2">
            {categories
              .slice(carouselPage * RINGS_PER_PAGE, (carouselPage + 1) * RINGS_PER_PAGE)
              .map((category) => (
                <motion.div
                  key={category.id}
                  className="text-center flex-shrink-0 pointer-events-auto cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: selectedCat && selectedCat.id !== category.id ? 0.3 : 1,
                    y: 0,
                    scale: selectedCat?.id === category.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => handleSelect(category)}
                >
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors">
                    <p className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide whitespace-nowrap">
                      {category.emoji} {category.name}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
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
          <div className="bg-gradient-to-r from-orange-600/30 via-green-600/30 to-amber-600/30 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 shadow-lg">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1">
              🙏 स्वागत है बापू की कुटिया में
            </h1>
            <p className="text-white/90 text-xs sm:text-sm font-medium">
              Welcome to Bapu Ki Kutiya • Roshanpura, Bhopal
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
