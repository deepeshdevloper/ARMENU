import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useARMenu } from "@/lib/stores/useARMenu";
import { useGLTF } from "@react-three/drei";

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
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const goldenParticles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    console.log("LoadingScreen: Starting luxury preload");
    let mounted = true;

    MODEL_PATHS.forEach((path) => {
      useGLTF.preload(path);
    });

    let loadedCount = 0;
    const progressInterval = setInterval(() => {
      if (!mounted) return;

      loadedCount++;
      const currentProgress = Math.min(
        (loadedCount / MODEL_PATHS.length) * 100,
        100,
      );
      setProgress(currentProgress);

      if (loadedCount >= MODEL_PATHS.length) {
        clearInterval(progressInterval);

        setTimeout(() => {
          if (mounted) {
            console.log("LoadingScreen: Transitioning to categories");
            useARMenu.getState().setScreen("categories");
          }
        }, 500);
      }
    }, 80);

    return () => {
      mounted = false;
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-white">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(184, 134, 11, 0.08) 0%, transparent 50%)",
        }}
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {goldenParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-yellow-500/50 via-amber-400/70 to-orange-400/50 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              y: [-20, -60, -100],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)",
            "radial-gradient(circle at 60% 40%, rgba(255, 215, 0, 0.12) 0%, transparent 60%)",
            "radial-gradient(circle at 40% 60%, rgba(184, 134, 11, 0.08) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <motion.div
          className="relative w-32 h-32"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #D4AF37, #FFD700, #B8860B, #D4AF37)",
              filter: "blur(20px)",
              opacity: 0.4,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="absolute inset-2 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center border border-amber-200 shadow-lg">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                strokeDasharray={`${progress * 2.8}, 280`}
                strokeLinecap="round"
                className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              />
              <defs>
                <linearGradient
                  id="goldGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            className="absolute inset-0 rounded-full border border-yellow-500/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="text-center">
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent"
              style={{
                textShadow: "0 2px 20px rgba(212, 175, 55, 0.2)",
              }}
            >
              AR Menu Experience
            </motion.h1>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.p
            className="text-gray-600 text-sm mt-3 font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Loading premium experience...
          </motion.p>

          <motion.div
            className="mt-6 text-amber-600 text-xs font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
      </div>
    </div>
  );
}
