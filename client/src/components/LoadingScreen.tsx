import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";

export function LoadingScreen() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const setScreen = useARMenu(state => state.setScreen);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowSecondLine(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setScreen("categories");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setScreen]);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-white/30"
          animate={{
            scale: [1, 1.02, 1],
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
        
        <div className="text-center">
          <motion.p 
            className="text-white text-2xl font-bold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading Menu...
          </motion.p>
          
          {showSecondLine && (
            <motion.p
              className="text-white/80 text-sm mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Fetching AR models...
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
