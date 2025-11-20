import { Canvas, useFrame } from "@react-three/fiber";
import { Text, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import * as THREE from "three";
import { categories as defaultCategories } from "@/data/menuData";
import { useARMenu, Category } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { ChevronLeft, ChevronRight } from "lucide-react";
import menuJson from "@/data/menu.json";

const categoryModelMap: Record<string, string> = menuJson.categories.reduce(
  (acc: any, cat: any) => {
    if (cat.model) {
      acc[cat.id] = cat.model;
    }
    return acc;
  },
  {},
);

const materialConfigs: Record<string, { color: string; metalness: number; name: string }> = {
  paneer: { color: "#FFD700", metalness: 0.9, name: "Gold" },
  kofta: { color: "#50C878", metalness: 0.85, name: "Emerald" },
  mushroom: { color: "#C19A6B", metalness: 0.8, name: "Bronze" },
  kaju: { color: "#D4AF37", metalness: 0.95, name: "Rose Gold" },
  chole: { color: "#DC143C", metalness: 0.85, name: "Ruby" },
  vegetables: { color: "#32CD32", metalness: 0.8, name: "Jade" },
  breads: { color: "#E5C7A9", metalness: 0.7, name: "Champagne" },
  rice: { color: "#F4A460", metalness: 0.75, name: "Amber" },
  dal: { color: "#FF8C00", metalness: 0.8, name: "Topaz" },
  salads: { color: "#00FA9A", metalness: 0.85, name: "Mint" },
  desserts: { color: "#FF69B4", metalness: 0.9, name: "Pink Diamond" },
};

function FloatingParticles({ color }: { color: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0015;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function SimpleBase() {
  const baseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (baseRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      baseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh
      ref={baseRef}
      position={[0, -0.15, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[0.25, 32]} />
      <meshPhysicalMaterial
        color="#D4AF37"
        emissive="#D4AF37"
        emissiveIntensity={0.3}
        metalness={0.95}
        roughness={0.1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function DishModel({
  modelPath,
  isHovered,
  isSelected,
}: {
  modelPath: string | undefined;
  isHovered: boolean;
  isSelected: boolean;
}) {
  const modelRef = useRef<THREE.Group>(null);

  if (!modelPath) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#888888"
          emissive="#888888"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );
  }

  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = -Math.PI / 2;
    }
  }, []);

  useFrame((state) => {
    if (modelRef.current) {
      const rotationSpeed = isHovered || isSelected ? 0.012 : 0.006;
      modelRef.current.rotation.z += rotationSpeed;

      const floatY = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
      modelRef.current.position.y = floatY;
    }
  });

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={modelRef} scale={0.6}>
      <primitive object={clonedScene} />
    </group>
  );
}

function PremiumTorusRing({
  category,
  position,
  isSelected,
  onClick,
}: {
  category: Category;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const wobbleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const materialConfig = materialConfigs[category.id] || materialConfigs.paneer;

  useFrame((state) => {
    if (ringRef.current && groupRef.current) {
      ringRef.current.rotation.y += 0.003;

      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 0.5 + wobbleOffset) * 0.15;
      const wobble = Math.sin(time * 0.25 + wobbleOffset) * 0.03;

      groupRef.current.position.y = floatY;
      groupRef.current.rotation.z = wobble;
    }

    if (glowRef.current) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      glowRef.current.scale.setScalar(pulseScale);
      glowRef.current.rotation.z += 0.008;
    }
  });

  const scale = isHovered ? 1.08 : isSelected ? 1.12 : 1.0;
  const modelPath = categoryModelMap[category.id];

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <mesh ref={glowRef} rotation={[0, 0, 0]} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.45, 0.65, 64]} />
        <meshBasicMaterial
          color={materialConfig.color}
          transparent
          opacity={isHovered ? 0.4 : isSelected ? 0.5 : 0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ringRef} scale={scale}>
        <torusGeometry args={[0.55, 0.05, 32, 100]} />
        <meshPhysicalMaterial
          color={materialConfig.color}
          emissive={materialConfig.color}
          emissiveIntensity={isHovered ? 1.8 : isSelected ? 2.2 : 0.8}
          metalness={materialConfig.metalness}
          roughness={0.1}
          clearcoat={0.7}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      <FloatingParticles color={materialConfig.color} />

      <Suspense fallback={null}>
        <SimpleBase />
      </Suspense>

      <Suspense fallback={null}>
        <DishModel
          modelPath={modelPath}
          isHovered={isHovered}
          isSelected={isSelected}
        />
      </Suspense>

    </group>
  );
}

function Scene({
  selectedCategory,
  onSelect,
  categories,
  carouselOffset,
}: {
  selectedCategory: Category | null;
  onSelect: (cat: Category) => void;
  categories: Category[];
  carouselOffset: number;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.5, 7]} fov={70} />

      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#FFF8E1" />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.6}
        color="#E3F2FD"
      />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#FFD700" />
      <spotLight
        position={[0, 12, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={1.0}
        color="#ffffff"
        castShadow
      />

      {categories.map((category, index) => {
        const angle =
          (index / categories.length) * Math.PI * 2 + carouselOffset;
        const radius = 4.0;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const isSelected = selectedCategory?.id === category.id;

        return (
          <PremiumTorusRing
            key={category.id}
            category={category}
            position={[x, 0, z]}
            isSelected={isSelected}
            onClick={() => {
              console.log("Ring clicked:", category.name);
              onSelect(category);
            }}
          />
        );
      })}
    </>
  );
}

export function CategoryRingsScreen() {
  const selectCategory = useARMenu((state) => state.selectCategory);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trigger } = useHaptics();
  const [carouselOffset, setCarouselOffset] = useState(0);

  const categories = defaultCategories;

  const handleSelect = (category: Category) => {
    console.log("CategoryRingsScreen: handleSelect called", category.name);
    setSelectedCategory(category);
    trigger("light");

    setTimeout(() => {
      console.log("CategoryRingsScreen: Transitioning to dish list");
      selectCategory(category);
    }, 600);
  };

  const nextCategory = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setCarouselOffset((offset) => offset - (Math.PI * 2) / categories.length);
    trigger("light");
  };

  const prevCategory = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length,
    );
    setCarouselOffset((offset) => offset + (Math.PI * 2) / categories.length);
    trigger("light");
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      prevCategory();
    } else if (info.offset.x < -100) {
      nextCategory();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50" />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 50%, rgba(255, 105, 180, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 70%, rgba(0, 206, 209, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Scene
              selectedCategory={selectedCategory}
              onSelect={handleSelect}
              categories={categories}
              carouselOffset={carouselOffset}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-10 px-4">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            textShadow: "0 4px 30px rgba(212, 175, 55, 0.3)",
            letterSpacing: "0.02em"
          }}
        >
          बापू की कुटिया
        </motion.h1>
        <motion.p
          className="text-gray-800 text-sm sm:text-base mt-2 text-center font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Explore Our Menu
        </motion.p>
        <motion.p
          className="text-gray-500 text-xs sm:text-sm mt-1 text-center font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tap a ring or swipe to browse categories
        </motion.p>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-10">
        <motion.button
          onClick={prevCategory}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center"
          whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </motion.button>
        <motion.button
          onClick={nextCategory}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center"
          whileHover={{ scale: 1.1, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </motion.button>
      </div>

      <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 z-10 px-4 w-full max-w-md">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 mx-auto cursor-pointer"
          style={{
            boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 0 40px ${materialConfigs[categories[currentIndex]?.id]?.color || "#FFD700"}20`
          }}
          onClick={() => {
            const category = categories[currentIndex];
            if (category) {
              console.log("Category card clicked:", category.name);
              handleSelect(category);
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="text-5xl sm:text-6xl">
              {categories[currentIndex]?.emoji || "🍽️"}
            </div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
              style={{ 
                color: materialConfigs[categories[currentIndex]?.id]?.color || "#FFD700",
                textShadow: `0 2px 30px ${materialConfigs[categories[currentIndex]?.id]?.color || "#FFD700"}40`,
                letterSpacing: "0.02em"
              }}
            >
              {categories[currentIndex]?.name}
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium text-center max-w-sm">
              {categories[currentIndex]?.description || "Tap to explore dishes"}
            </p>
            <div className="mt-2 px-6 py-2 rounded-full border-2" 
              style={{ 
                borderColor: materialConfigs[categories[currentIndex]?.id]?.color,
                backgroundColor: `${materialConfigs[categories[currentIndex]?.id]?.color}15`
              }}>
              <span className="text-sm font-bold" style={{ color: materialConfigs[categories[currentIndex]?.id]?.color }}>
                👆 Tap to View {materialConfigs[categories[currentIndex]?.id]?.name} Collection
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-amber-500 w-6 sm:w-8" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
