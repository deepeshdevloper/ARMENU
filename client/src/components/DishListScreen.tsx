import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { getDishesForCategory } from "@/data/menuData";
import { ChevronLeft } from "lucide-react";
import type { Dish } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";

function DishCard({ dish, index, isActive, onClick }: {
  dish: Dish;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const maxRotation = 3;
  const maxOffset = 25;
  const rotation = isActive ? 0 : Math.min(index * 2, maxRotation);
  const yOffset = isActive ? 0 : Math.min(index * 20, maxOffset);
  const scale = isActive ? 1 : Math.max(0.85, 0.9 - (index * 0.03));
  const zIndex = isActive ? 1000 : Math.max(0, 999 - index);
  const opacity = isActive ? 1 : index < 3 ? 0.95 - (index * 0.15) : 0.5;

  return (
    <motion.div
      className="absolute inset-x-3 sm:inset-x-6 md:inset-x-10 lg:inset-x-16 top-1/2 -translate-y-1/2 max-w-2xl mx-auto"
      style={{ zIndex }}
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity,
        y: yOffset,
        scale,
        rotateZ: rotation,
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      onClick={onClick}
    >
      <div 
        className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
        style={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${dish.emoji === '🔥' ? 'rgba(239, 68, 68, 0.3)' : 
                     dish.emoji === '🍫' ? 'rgba(249, 168, 212, 0.3)' :
                     dish.emoji === '🍹' ? 'rgba(103, 232, 249, 0.3)' : 
                     'rgba(110, 231, 183, 0.3)'}`
        }}
      >
        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
          <img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-full object-cover"
            style={{
              transform: isActive ? 'scale(1)' : 'scale(1.1)',
              transition: 'transform 0.3s ease'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide neon-text">
              {dish.emoji} {dish.name}
            </h3>
            <span className="text-xs sm:text-sm glass-effect px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
              {dish.calories} cal
            </span>
          </div>
          
          <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {dish.description}
          </p>
          
          {isActive && (
            <motion.button
              className="w-full py-2 sm:py-3 rounded-full font-bold text-white relative overflow-hidden text-sm sm:text-base"
              style={{
                background: `linear-gradient(135deg, ${dish.emoji === '🔥' ? '#EF4444' : 
                           dish.emoji === '🍫' ? '#F9A8D4' :
                           dish.emoji === '🍹' ? '#67E8F9' : 
                           '#6EE7B7'} 0%, ${dish.emoji === '🔥' ? '#DC2626' : 
                           dish.emoji === '🍫' ? '#EC4899' :
                           dish.emoji === '🍹' ? '#06B6D4' : 
                           '#10B981'} 100%)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              View in AR
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function DishListScreen() {
  const { selectedCategory, selectDish, setScreen } = useARMenu();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const { trigger } = useHaptics();

  useEffect(() => {
    if (selectedCategory) {
      const categoryDishes = getDishesForCategory(selectedCategory.id);
      setDishes(categoryDishes);
    }
  }, [selectedCategory]);

  const handleNext = () => {
    if (dishes.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % dishes.length);
    trigger('light');
  };

  const handlePrev = () => {
    if (dishes.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
    trigger('light');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dishes.length <= 1) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleDishClick = (dish: Dish, index: number) => {
    if (index === activeIndex) {
      trigger('medium');
      selectDish(dish);
    } else {
      trigger('light');
      setActiveIndex(index);
    }
  };

  if (!selectedCategory || dishes.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={() => setScreen("categories")}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors safe-top safe-left"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md safe-top safe-right">
        <p className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
          {selectedCategory.emoji} {selectedCategory.name}
        </p>
      </div>

      <div className="relative h-full">
        {dishes.map((dish, dishIndex) => {
          const relativeIndex = (dishIndex - activeIndex + dishes.length) % dishes.length;
          
          if (relativeIndex > 5) return null;
          
          return (
            <DishCard
              key={dish.id}
              dish={dish}
              index={relativeIndex}
              isActive={dishIndex === activeIndex}
              onClick={() => handleDishClick(dish, dishIndex)}
            />
          );
        })}
      </div>

      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 right-0 flex justify-center items-center gap-1.5 sm:gap-2 safe-bottom px-4">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full scrollbar-hide px-2">
          {dishes.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all flex-shrink-0 ${
                index === activeIndex 
                  ? 'w-6 sm:w-8 bg-white' 
                  : 'w-1.5 sm:w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
