import { FC, useEffect, useState } from "react";
import { Particle } from "./particle";

interface ParticleBackgroundProps {
  particleCount?: number;
}

export const ParticleBackground: FC<ParticleBackgroundProps> = ({
  particleCount = 1000,
}) => {
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    window.addEventListener("resize", generateParticles);
    return () => window.removeEventListener("resize", generateParticles);
  }, [particleCount]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br">
      {particles.map((particle, index) => (
        <Particle key={index} x={particle.x} y={particle.y} />
      ))}
    </div>
  );
};
