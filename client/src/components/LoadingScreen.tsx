import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";

export function LoadingScreen() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [progress, setProgress] = useState(0);
  const setScreen = useARMenu(state => state.setScreen);
  
  const particles = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
  }, []);

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
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
      
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full"
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

      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-6 w-full max-w-md">
        <motion.div
          className="relative w-24 h-24 sm:w-32 sm:h-32"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
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
            className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide neon-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Loading Menu...
          </motion.p>
          
          {showSecondLine && (
            <motion.p
              className="text-white/80 text-sm sm:text-base mt-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Fetching AR models...
            </motion.p>
          )}
          
          <motion.div
            className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden"
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
