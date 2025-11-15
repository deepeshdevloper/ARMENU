import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { ChevronLeft, Camera } from "lucide-react";
import { useGyroParallax } from "@/hooks/useGyroParallax";
import { useHaptics } from "@/hooks/useHaptics";

export function DishDetailScreen() {
  const { selectedDish, setScreen } = useARMenu();
  const { tilt, requestPermission, permissionGranted } = useGyroParallax(10, 0.15);
  const { trigger } = useHaptics();

  if (!selectedDish) return null;

  const handleEnterAR = async () => {
    if (permissionGranted === null) {
      const granted = await requestPermission();
      if (!granted) {
        console.warn('Device orientation permission denied - gyroscope effects disabled');
      }
    }
    trigger('heavy');
    setScreen("ar");
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
      <button
        onClick={() => {
          trigger('light');
          setScreen("dishList");
        }}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 p-2 sm:p-3 rounded-full glass-effect text-white hover:bg-white/20 transition-all safe-top safe-left"
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
      </button>

      <div className="flex flex-col items-center justify-start min-h-full py-16 sm:py-20 px-4 sm:px-6">
        <motion.div
          className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`
          }}
        >
          <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={selectedDish.image} 
              alt={selectedDish.name}
              className="w-full h-44 sm:h-56 md:h-64 lg:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 flex justify-center">
            <div className="glass-effect rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2">
              <p className="text-white text-xs sm:text-sm font-semibold">
                {selectedDish.calories} calories
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-6 sm:mb-8 w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 neon-text px-2">
            {selectedDish.emoji} {selectedDish.name}
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 px-4">
            {selectedDish.description}
          </p>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center px-4 max-w-xl mx-auto">
            {selectedDish.ingredients.map((ingredient, i) => (
              <span 
                key={i}
                className="text-xs sm:text-sm glass-effect text-white px-2.5 sm:px-3 py-1 rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={handleEnterAR}
          className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-white overflow-hidden shadow-2xl text-sm sm:text-base md:text-lg"
          style={{
            background: `linear-gradient(135deg, ${selectedDish.emoji === '🔥' ? '#EF4444' : 
                       selectedDish.emoji === '🍫' ? '#F9A8D4' :
                       selectedDish.emoji === '🍹' ? '#67E8F9' : 
                       '#6EE7B7'} 0%, ${selectedDish.emoji === '🔥' ? '#DC2626' : 
                       selectedDish.emoji === '🍫' ? '#EC4899' :
                       selectedDish.emoji === '🍹' ? '#06B6D4' : 
                       '#10B981'} 100%)`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative flex items-center justify-center gap-2">
            <Camera size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span>Enter AR Mode</span>
          </div>
        </motion.button>

        <motion.div
          className="mt-4 sm:mt-6 max-w-sm sm:max-w-md lg:max-w-lg safe-bottom px-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4">
            <p className="text-yellow-200 text-xs sm:text-sm text-center">
              ⚠️ Point your camera at a flat table or plate. The 3D dish will only appear when a real surface is detected.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
