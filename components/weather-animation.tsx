"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface WeatherAnimationProps {
  conditionCode: number
  isDay: boolean
  className?: string
}

export default function WeatherAnimation({ conditionCode, isDay, className = "w-16 h-16" }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let animationFrameId: number
    let particles: any[] = []

    // Clear canvas
    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Draw sun
    const drawSun = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3

      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, "rgba(255, 200, 0, 0.8)")
      gradient.addColorStop(1, "rgba(255, 200, 0, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Sun body
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 200, 0, 1)"
      ctx.fill()
    }

    // Draw moon
    const drawMoon = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3

      // Moon glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, "rgba(200, 220, 255, 0.6)")
      gradient.addColorStop(1, "rgba(200, 220, 255, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Moon body
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#e0e8ff"
      ctx.fill()

      // Moon crater
      ctx.beginPath()
      ctx.arc(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(200, 210, 240, 0.8)"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(centerX + radius * 0.2, centerY + radius * 0.3, radius * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(200, 210, 240, 0.8)"
      ctx.fill()
    }

    // Draw cloud
    const drawCloud = (x: number, y: number, scale: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      ctx.beginPath()
      ctx.arc(0, 0, 20, 0, Math.PI * 2)
      ctx.arc(15, -10, 15, 0, Math.PI * 2)
      ctx.arc(-15, -10, 15, 0, Math.PI * 2)
      ctx.arc(-25, 0, 10, 0, Math.PI * 2)
      ctx.arc(25, 0, 10, 0, Math.PI * 2)

      const gradient = ctx.createLinearGradient(0, -20, 0, 10)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)")
      gradient.addColorStop(1, "rgba(230, 230, 250, 0.9)")

      ctx.fillStyle = gradient
      ctx.fill()

      ctx.restore()
    }

    // Initialize rain particles
    const initRainParticles = () => {
      particles = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 5 + 5,
          speed: Math.random() * 10 + 10,
        })
      }
    }

    // Draw rain
    const drawRain = () => {
      ctx.strokeStyle = "rgba(200, 220, 255, 0.8)"
      ctx.lineWidth = 1

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x, particle.y + particle.length)
        ctx.stroke()

        particle.y += particle.speed

        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }
      })
    }

    // Initialize snow particles
    const initSnowParticles = () => {
      particles = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          wind: Math.random() * 1 - 0.5,
        })
      }
    }

    // Draw snow
    const drawSnow = () => {
      ctx.fillStyle = "white"

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()

        particle.y += particle.speed
        particle.x += particle.wind

        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }

        if (particle.x > canvas.width) {
          particle.x = 0
        } else if (particle.x < 0) {
          particle.x = canvas.width
        }
      })
    }

    // Draw lightning
    const drawLightning = () => {
      if (Math.random() > 0.97) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        setTimeout(() => {
          if (Math.random() > 0.5) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
        }, 100)
      }
    }

    // Initialize animation based on weather condition
    let animationFunction: () => void

    if (conditionCode >= 1000 && conditionCode < 1030) {
      // Clear or partly cloudy
      if (isDay) {
        animationFunction = () => {
          clearCanvas()
          drawSun()
          if (conditionCode > 1000) {
            drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
          }
        }
      } else {
        animationFunction = () => {
          clearCanvas()
          drawMoon()
          if (conditionCode > 1000) {
            drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
          }
        }
      }
    } else if (conditionCode >= 1030 && conditionCode < 1100) {
      // Cloudy/foggy
      animationFunction = () => {
        clearCanvas()
        if (isDay) {
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
          gradient.addColorStop(0, "rgba(135, 206, 235, 0.5)")
          gradient.addColorStop(1, "rgba(135, 206, 235, 0.1)")
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else {
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
          gradient.addColorStop(0, "rgba(25, 25, 112, 0.5)")
          gradient.addColorStop(1, "rgba(25, 25, 112, 0.1)")
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        drawCloud(canvas.width * 0.3, canvas.height * 0.3, 1)
        drawCloud(canvas.width * 0.7, canvas.height * 0.5, 0.8)
        drawCloud(canvas.width * 0.5, canvas.height * 0.7, 1.2)
      }
    } else if (conditionCode >= 1100 && conditionCode < 1200) {
      // Rain
      initRainParticles()
      animationFunction = () => {
        clearCanvas()
        drawCloud(canvas.width * 0.3, canvas.height * 0.3, 1)
        drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
        drawRain()
      }
    } else if (conditionCode >= 1200 && conditionCode < 1300) {
      // Snow
      initSnowParticles()
      animationFunction = () => {
        clearCanvas()
        drawCloud(canvas.width * 0.3, canvas.height * 0.3, 1)
        drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
        drawSnow()
      }
    } else if (conditionCode >= 1300 && conditionCode < 1400) {
      // Thunderstorm
      initRainParticles()
      animationFunction = () => {
        clearCanvas()
        drawCloud(canvas.width * 0.3, canvas.height * 0.3, 1)
        drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
        drawRain()
        drawLightning()
      }
    } else {
      // Default animation
      if (isDay) {
        animationFunction = () => {
          clearCanvas()
          drawSun()
          drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
        }
      } else {
        animationFunction = () => {
          clearCanvas()
          drawMoon()
          drawCloud(canvas.width * 0.7, canvas.height * 0.3, 0.8)
        }
      }
    }

    // Animation loop
    const animate = () => {
      animationFunction()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [conditionCode, isDay])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}

