import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { ChevronLeft, Camera } from "lucide-react";
import { useState, useEffect } from "react";

export function DishDetailScreen() {
  const { selectedDish, setScreen } = useARMenu();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta && event.gamma) {
        setTilt({
          x: event.gamma / 10,
          y: event.beta / 10
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  if (!selectedDish) return null;

  const handleEnterAR = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setScreen("ar");
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
      <button
        onClick={() => setScreen("dishList")}
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex flex-col items-center justify-center h-full px-6">
        <motion.div
          className="relative w-full max-w-md mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`
          }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={selectedDish.image} 
              alt={selectedDish.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-full px-6 py-2">
              <p className="text-white text-sm font-semibold">
                {selectedDish.calories} calories
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white text-4xl font-bold mb-3">
            {selectedDish.emoji} {selectedDish.name}
          </h1>
          <p className="text-white/80 text-lg mb-4">
            {selectedDish.description}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedDish.ingredients.slice(0, 4).map((ingredient, i) => (
              <span 
                key={i}
                className="text-xs bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={handleEnterAR}
          className="relative w-full max-w-md py-4 rounded-full font-bold text-white overflow-hidden shadow-2xl"
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
            <Camera size={24} />
            <span className="text-lg">Enter AR Mode</span>
          </div>
        </motion.button>

        <motion.div
          className="mt-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4">
            <p className="text-yellow-200 text-sm text-center">
              ⚠️ Point your camera at a flat table or plate. The 3D dish will only appear when a real surface is detected.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
