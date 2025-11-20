import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { getDishesForCategory } from "@/data/menuData";
import { ChevronLeft, Sparkles } from "lucide-react";
import type { Dish } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { WebcamARViewer } from "./WebcamARViewer";
import { ARTableDetection } from "./ARTableDetection";
import { detectARCapabilities, type ARCapabilities } from "@/lib/utils/arDetection";

function LuxuryDishCard({ dish, onClick, index }: {
  dish: Dish;
  onClick: () => void;
  index: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cardOffset = useMemo(() => ({
    x: (Math.random() - 0.5) * 2,
    rotate: (Math.random() - 0.5) * 0.5,
  }), []);

  const steamParticles = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      x: -10 + i * 10,
    })), 
  []);

  return (
    <motion.div
      className="w-full px-4 mb-6"
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden cursor-pointer group"
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 247, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.08),
            0 0 30px rgba(212, 175, 55, ${isHovered ? '0.15' : '0.05'}),
            inset 0 1px 0 rgba(255, 255, 255, 1)
          `,
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative h-56 sm:h-64 sm:w-64 flex-shrink-0 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            )}
            <motion.img 
              src={dish.image} 
              alt={dish.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/40" />
            
            <div className="absolute top-4 left-4">
              <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-amber-200 shadow-lg">
                <span className="text-amber-600 text-sm font-semibold">{dish.calories} cal</span>
              </div>
            </div>
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {isHovered && steamParticles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-amber-200/60 to-transparent blur-sm"
                  style={{
                    left: `${50 + particle.x}%`,
                    bottom: '20%',
                  }}
                  animate={{
                    y: [-10, -80],
                    opacity: [0.6, 0],
                    scale: [0.5, 1.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-300/0 via-amber-200/0 to-amber-400/20"
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-between relative">
            <div>
              <motion.div
                className="flex items-center gap-3 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 + 0.2 }}
              >
                <span className="text-4xl">{dish.emoji}</span>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {dish.name}
                </h3>
              </motion.div>
              
              <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                {dish.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.slice(0, 4).map((ingredient, idx) => (
                  <motion.span 
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 backdrop-blur-sm border border-amber-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 + 0.3 + idx * 0.05 }}
                  >
                    {ingredient}
                  </motion.span>
                ))}
                {dish.ingredients.length > 4 && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-600">
                    +{dish.ingredients.length - 4} more
                  </span>
                )}
              </div>
            </div>
            
            <motion.button
              className="mt-6 w-full sm:w-auto py-3 px-8 rounded-full font-bold text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 30px rgba(212, 175, 55, 0.6)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: isHovered ? ['-100%', '200%'] : '-100%',
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                View in AR
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DishListScreen() {
  const { selectedCategory, selectDish, setScreen } = useARMenu();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishForAR, setSelectedDishForAR] = useState<Dish | null>(null);
  const [arMode, setARMode] = useState<'none' | 'webcam' | 'table-detection'>('none');
  const { trigger } = useHaptics();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (selectedCategory) {
      console.log('DishListScreen: Loading dishes for', selectedCategory.name);
      const categoryDishes = getDishesForCategory(selectedCategory.id);
      console.log('DishListScreen: Found', categoryDishes.length, 'dishes');
      setDishes(categoryDishes);
    }
  }, [selectedCategory]);

  const handleDishSelect = async (dish: Dish) => {
    console.log('DishListScreen: Dish selected', dish.name);
    trigger('medium');
    
    try {
      const arCapabilities = await detectARCapabilities();
      console.log('AR Capabilities:', arCapabilities);
      
      if (arCapabilities.preferredMode === 'native-ar' && isMobile) {
        console.log('DishListScreen: Routing to native AR (via dish detail -> AR screen)');
        selectDish(dish);
      } else if (arCapabilities.preferredMode === 'webcam-ar' && arCapabilities.hasWebcam) {
        console.log('DishListScreen: Routing directly to WebcamAR with table detection');
        setSelectedDishForAR(dish);
        setARMode('table-detection');
      } else {
        console.log('DishListScreen: AR not available, showing detail screen');
        selectDish(dish);
      }
    } catch (error) {
      console.error('Error detecting AR capabilities:', error);
      selectDish(dish);
    }
  };

  const handleBack = () => {
    console.log('DishListScreen: Going back to categories');
    trigger('light');
    setScreen("categories");
  };

  const closeAR = () => {
    setARMode('none');
    setSelectedDishForAR(null);
  };

  if (!selectedCategory) {
    return null;
  }

  if (arMode === 'table-detection' && selectedDishForAR) {
    return (
      <ARTableDetection
        modelPath={selectedDishForAR.modelPath}
        onClose={closeAR}
      />
    );
  }

  if (arMode === 'webcam' && selectedDishForAR) {
    return (
      <WebcamARViewer
        modelPath={selectedDishForAR.modelPath}
        onClose={closeAR}
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 w-full h-full bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50" />
      
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 70%, rgba(184, 134, 11, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/80 border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
            <motion.button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-white backdrop-blur-xl border border-amber-200 shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)' }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-amber-700" />
            </motion.button>
            
            <div className="flex-1">
              <motion.h1
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
              >
                {selectedCategory.emoji} {selectedCategory.name}
              </motion.h1>
              <motion.p
                className="text-gray-600 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {dishes.length} premium dishes
              </motion.p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
          <div className="max-w-5xl mx-auto py-8">
            {dishes.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading dishes...</p>
                </div>
              </div>
            ) : (
              dishes.map((dish, index) => (
                <LuxuryDishCard
                  key={dish.id}
                  dish={dish}
                  onClick={() => handleDishSelect(dish)}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
