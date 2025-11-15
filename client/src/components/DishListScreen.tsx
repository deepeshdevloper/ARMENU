import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { getDishesForCategory } from "@/data/menuData";
import { ChevronLeft } from "lucide-react";
import type { Dish } from "@/lib/stores/useARMenu";

function DishCard({ dish, index, isActive, onClick }: {
  dish: Dish;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const rotation = isActive ? 0 : (index * 2 - 4);
  const yOffset = isActive ? 0 : index * 20;
  const scale = isActive ? 1 : 0.9 - (index * 0.05);
  const zIndex = isActive ? 10 : 5 - index;

  return (
    <motion.div
      className="absolute inset-x-8 top-1/2 -translate-y-1/2"
      style={{ zIndex }}
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: 1,
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
        className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
        style={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${dish.emoji === '🔥' ? 'rgba(239, 68, 68, 0.3)' : 
                     dish.emoji === '🍫' ? 'rgba(249, 168, 212, 0.3)' :
                     dish.emoji === '🍹' ? 'rgba(103, 232, 249, 0.3)' : 
                     'rgba(110, 231, 183, 0.3)'}`
        }}
      >
        <div className="relative h-80 overflow-hidden">
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
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-3xl font-bold tracking-wide">
              {dish.emoji} {dish.name}
            </h3>
            <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {dish.calories} cal
            </span>
          </div>
          
          <p className="text-white/90 text-sm mb-4">
            {dish.description}
          </p>
          
          {isActive && (
            <motion.button
              className="w-full py-3 rounded-full font-bold text-white relative overflow-hidden"
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

  useEffect(() => {
    if (selectedCategory) {
      const categoryDishes = getDishesForCategory(selectedCategory.id);
      setDishes(categoryDishes);
    }
  }, [selectedCategory]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      selectDish(dish);
    } else {
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
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
        <p className="text-white text-sm font-semibold">
          {selectedCategory.emoji} {selectedCategory.name}
        </p>
      </div>

      <div className="relative h-full">
        {dishes.map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            index={Math.abs(index - activeIndex)}
            isActive={index === activeIndex}
            onClick={() => handleDishClick(dish, index)}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
        {dishes.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
