import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { getDishesForCategory } from "@/data/menuData";
import { ChevronLeft } from "lucide-react";
import type { Dish } from "@/lib/stores/useARMenu";
import { useHaptics } from "@/hooks/useHaptics";

function DishCard({ dish, onClick }: {
  dish: Dish;
  onClick: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getCategoryColor = (emoji: string) => {
    switch(emoji) {
      case '🔥': return { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239, 68, 68, 0.3)' };
      case '🍫': case '🍰': case '🍨': case '☕': return { primary: '#F9A8D4', secondary: '#EC4899', glow: 'rgba(249, 168, 212, 0.3)' };
      case '🍹': case '🥤': case '🫐': return { primary: '#67E8F9', secondary: '#06B6D4', glow: 'rgba(103, 232, 249, 0.3)' };
      case '🥗': case '🥙': case '🌯': case '🍅': return { primary: '#6EE7B7', secondary: '#10B981', glow: 'rgba(110, 231, 183, 0.3)' };
      case '🍳': case '🥞': case '🥑': case '🍞': return { primary: '#FCD34D', secondary: '#F59E0B', glow: 'rgba(252, 211, 77, 0.3)' };
      case '🍕': case '🍝': case '🍚': return { primary: '#FCA5A5', secondary: '#EF4444', glow: 'rgba(252, 165, 165, 0.3)' };
      default: return { primary: '#6EE7B7', secondary: '#10B981', glow: 'rgba(110, 231, 183, 0.3)' };
    }
  };

  const colors = getCategoryColor(dish.emoji);

  return (
    <motion.div
      className="w-full mb-4 px-3 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div 
        className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10"
        onClick={onClick}
        style={{
          boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${colors.glow}`
        }}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-56 sm:w-48 lg:w-56 overflow-hidden flex-shrink-0 bg-gray-800">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-white/50">Loading...</div>
              </div>
            )}
            <img 
              src={dish.image} 
              alt={dish.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r sm:bg-gradient-to-r from-transparent via-transparent to-gray-900/80" />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">{dish.calories} cal</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                {dish.emoji} {dish.name}
              </h3>
              
              <p className="text-white/80 text-sm sm:text-base mb-3 line-clamp-2">
                {dish.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {dish.ingredients.slice(0, 3).map((ingredient, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm"
                  >
                    {ingredient}
                  </span>
                ))}
                {dish.ingredients.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                    +{dish.ingredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <motion.button
              className="w-full sm:w-auto py-2.5 px-6 rounded-full font-bold text-white relative overflow-hidden text-sm sm:text-base shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DishListScreen() {
  const { selectedCategory, selectDish, setScreen } = useARMenu();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { trigger } = useHaptics();

  useEffect(() => {
    if (selectedCategory) {
      const categoryDishes = getDishesForCategory(selectedCategory.id);
      setDishes(categoryDishes);
    }
  }, [selectedCategory]);

  const handleDishClick = (dish: Dish) => {
    trigger('medium');
    selectDish(dish);
  };

  if (!selectedCategory || dishes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-4 sm:py-6 safe-top border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={() => setScreen("categories")}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
          <p className="text-white text-sm sm:text-base font-bold whitespace-nowrap">
            {selectedCategory.emoji} {selectedCategory.name}
          </p>
        </div>

        <div className="w-10 sm:w-11" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() => handleDishClick(dish)}
              />
            ))}
          </motion.div>
          
          <div className="text-center py-8 text-white/40 text-sm">
            {dishes.length} delicious {dishes.length === 1 ? 'dish' : 'dishes'} available
          </div>
        </div>
      </div>
    </div>
  );
}
