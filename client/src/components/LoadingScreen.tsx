import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useGLTF } from "@react-three/drei";
import menuJson from "@/data/menu.json";

const MODEL_PATHS = [
  "/models/categories/breads.glb",
  "/models/categories/chole.glb",
  "/models/categories/dal.glb",
  "/models/categories/desserts.glb",
  "/models/categories/kaju.glb",
  "/models/categories/kofta.glb",
  "/models/categories/mushroom.glb",
  "/models/categories/paneer.glb",
  "/models/categories/rice.glb",
  "/models/categories/salads.glb",
  "/models/categories/vegetables.glb",
  "/models/dishes/butter-naan.glb",
  "/models/dishes/butter-paneer-masala.glb",
  "/models/dishes/dal-makhani.glb",
  "/models/dishes/dal-tadka.glb",
  "/models/dishes/garlic-naan.glb",
  "/models/dishes/gulab-jamun.glb",
  "/models/dishes/kadhai-paneer.glb",
  "/models/dishes/malai-kofta.glb",
  "/models/dishes/palak-paneer.glb",
  "/models/dishes/veg-biryani.glb",
];

export function LoadingScreen() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [modelsLoaded, setModelsLoaded] = useState(0);
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  const particles = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
  }, [dimensions]);

  useEffect(() => {
    console.log('LoadingScreen: Component mounted, starting model preload');
    let mounted = true;
    
    setTimeout(() => {
      if (mounted) {
        console.log('LoadingScreen: Showing second line');
        setShowSecondLine(true);
      }
    }, 300);

    console.log(`LoadingScreen: Preloading ${MODEL_PATHS.length} models...`);
    MODEL_PATHS.forEach(path => {
      useGLTF.preload(path);
    });

    let loadedCount = 0;
    const progressInterval = setInterval(() => {
      if (!mounted) return;
      
      loadedCount++;
      const currentProgress = Math.min((loadedCount / MODEL_PATHS.length) * 100, 100);
      setProgress(currentProgress);
      setModelsLoaded(loadedCount);
      
      if (loadedCount >= MODEL_PATHS.length) {
        clearInterval(progressInterval);
        console.log('LoadingScreen: All models preloaded!');
        
        setTimeout(() => {
          if (mounted) {
            console.log('LoadingScreen: Transitioning to categories screen');
            useARMenu.getState().setScreen("categories");
          }
        }, 300);
      }
    }, 100);

    return () => {
      console.log('LoadingScreen: Cleanup called');
      mounted = false;
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-green-600 to-amber-700" />
      
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 w-full max-w-xs sm:max-w-md md:max-w-lg">
        <motion.div
          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-3 sm:border-4 border-white/30"
            animate={{
              scale: [1, 1.05, 1],
              borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.3)"],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm" />
          </motion.div>
          
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray={`${progress * 2.8}, 280`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </motion.div>
        
        <div className="text-center w-full">
          <motion.p 
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            बापू की कुटिया
          </motion.p>
          
          {showSecondLine && (
            <motion.p
              className="text-white/90 text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-semibold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Bapu Ki Kutiya • Roshanpura, Bhopal
            </motion.p>
          )}
          
          <motion.div
            className="mt-4 sm:mt-5 md:mt-6 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-white via-pink-200 to-white rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
