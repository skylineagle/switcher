import type React from "react";
import { motion } from "framer-motion";

interface ParticleProps {
  x: number;
  y: number;
}

export const Particle: React.FC<ParticleProps> = ({ x, y }) => {
  const size = Math.random() * 7 + 1;
  return (
    <motion.div
      className="absolute rounded-full bg-blue-400"
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: [x, x + Math.random() * 100 - 50],
        y: [y, y + Math.random() * 100 - 50],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  );
};
