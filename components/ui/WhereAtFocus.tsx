'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SoloSocietyFocusProps {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  animationInterval?: number | null // Time in seconds between animation cycles (null = continuous)
  className?: string
  textSize?: string
}

const SoloSocietyFocus = ({
  sentence = 'Solo Society',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#2563eb', // primary-600
  glowColor = 'rgba(37, 99, 235, 0.6)', // primary-600 with opacity
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  animationInterval = null, // null = continuous, number = seconds between cycles
  className = '',
  textSize = 'text-3xl',
}: SoloSocietyFocusProps) => {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(animationInterval === null ? true : true)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  // Handle animation cycling
  useEffect(() => {
    if (!manualMode && isAnimating) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => {
            const next = (prev + 1) % words.length
            // If we've completed a full cycle and animationInterval is set, stop animating
            if (next === 0 && animationInterval !== null) {
              setIsAnimating(false)
              // Set to -1 to show all words
              return -1
            }
            return next
          })
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      )
      return () => clearInterval(interval)
    }
  }, [manualMode, isAnimating, animationDuration, pauseBetweenAnimations, words.length, animationInterval])

  // Handle interval-based animation restart
  useEffect(() => {
    if (!manualMode && animationInterval !== null && !isAnimating) {
      const timeout = setTimeout(() => {
        setIsAnimating(true)
        setCurrentIndex(0)
      }, animationInterval * 1000)
      return () => clearTimeout(timeout)
    }
  }, [manualMode, animationInterval, isAnimating])

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex, words.length])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index)
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0)
    }
  }

  return (
    <div
      className={`relative flex gap-2 justify-center items-center flex-wrap ${className}`}
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        const showAll = currentIndex === -1 // Show all words when not animating

        return (
          <span
            key={index}
            ref={(el) => { wordRefs.current[index] = el }}
            className={`relative ${textSize} font-black cursor-pointer`}
            style={{
              filter: showAll
                ? 'blur(0px)' // Show all words clearly when not animating
                : manualMode
                  ? isActive
                    ? 'blur(0px)'
                    : `blur(${blurAmount}px)`
                  : isActive
                    ? 'blur(0px)'
                    : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
              // custom CSS variables:
              '--border-color': borderColor,
              '--glow-color': glowColor,
            } as any}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0, // Hide when showing all words
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{
          // @ts-ignore
          '--border-color': borderColor,
          '--glow-color': glowColor,
        } as any}
      >
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] left-[-10px] border-r-0 border-b-0"
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] top-[-10px] right-[-10px] border-l-0 border-b-0"
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] left-[-10px] border-r-0 border-t-0"
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
        <span
          className="absolute w-4 h-4 border-[3px] rounded-[3px] bottom-[-10px] right-[-10px] border-l-0 border-t-0"
          style={{
            borderColor: 'var(--border-color)',
            filter: 'drop-shadow(0 0 4px var(--border-color))',
          }}
        ></span>
      </motion.div>
    </div>
  )
}

export default SoloSocietyFocus

