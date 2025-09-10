import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const AnimatedBackground = ({ riskLevel = 'low' }) => {
  const [particles, setParticles] = useState([])

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  // Color schemes based on risk level
  const getBackgroundColors = () => {
    switch (riskLevel) {
      case 'high':
        return {
          primary: 'from-red-50 via-orange-50 to-pink-50',
          secondary: 'from-red-100/30 via-orange-100/30 to-pink-100/30',
          accent: 'bg-red-200/20'
        }
      case 'medium':
        return {
          primary: 'from-orange-50 via-yellow-50 to-amber-50',
          secondary: 'from-orange-100/30 via-yellow-100/30 to-amber-100/30',
          accent: 'bg-orange-200/20'
        }
      default: // low
        return {
          primary: 'from-blue-50 via-slate-50 to-cyan-50',
          secondary: 'from-blue-100/30 via-slate-100/30 to-cyan-100/30',
          accent: 'bg-blue-200/20'
        }
    }
  }

  const colors = getBackgroundColors()

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Main gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colors.primary}`}
        animate={{
          background: [
            `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            `linear-gradient(135deg, var(--tw-gradient-stops))`,
            `linear-gradient(to bottom right, var(--tw-gradient-stops))`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Secondary gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-tl ${colors.secondary}`}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${colors.accent} blur-sm`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}

      {/* Subtle wave animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
        style={{
          background: `linear-gradient(to top, ${riskLevel === 'high' ? '#fecaca' : riskLevel === 'medium' ? '#fed7aa' : '#dbeafe'}, transparent)`
        }}
        animate={{
          transform: [
            'translateY(0px) scaleY(1)',
            'translateY(-10px) scaleY(1.1)',
            'translateY(0px) scaleY(1)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/10" />
    </div>
  )
}

export default AnimatedBackground

