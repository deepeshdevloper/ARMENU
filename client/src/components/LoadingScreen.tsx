import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";

export function LoadingScreen() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const setScreen = useARMenu(state => state.setScreen);
  
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
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    const timer1 = setTimeout(() => {
      setShowSecondLine(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setScreen("categories"), 400);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setScreen]);

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
