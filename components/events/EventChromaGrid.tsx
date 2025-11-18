'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'

interface EventItem {
  id: string
  image: string
  title: string
  subtitle: string
  dateTime: string
  location: string
  price: string
  seatsLeft: number
  borderColor: string
  gradient: string
  url: string
}

interface EventChromaGridProps {
  events: EventItem[]
  className?: string
  radius?: number
  damping?: number
  fadeOut?: number
  ease?: string
}

const EventChromaGrid = ({
  events,
  className = '',
  radius = 400,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
}: EventChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const setX = useRef<((value: number) => void) | null>(null)
  const setY = useRef<((value: number) => void) | null>(null)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    setX.current = gsap.quickSetter(el, '--x', 'px')
    setY.current = gsap.quickSetter(el, '--y', 'px')

    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }

    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current?.getBoundingClientRect()
    if (!r) return

    moveTo(e.clientX - r.left, e.clientY - r.top)
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
    }
  }

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: fadeOut,
        overwrite: true,
      })
    }
  }

  const handleCardMove = (e: React.MouseEvent) => {
    const c = e.currentTarget as HTMLElement
    const rect = c.getBoundingClientRect()
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  if (events.length === 0) return null

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full min-h-[600px] flex flex-wrap justify-center items-start gap-4 p-4 ${className}`}
      style={{
        '--r': `${radius}px`,
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      {events.map((event) => (
        <Link key={event.id} href={event.url}>
          <article
            onMouseMove={handleCardMove}
            className="group relative flex flex-col w-[320px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
            style={{
              '--card-border': event.borderColor || 'transparent',
              background: event.gradient,
              '--spotlight-color': 'rgba(255,255,255,0.25)',
            } as React.CSSProperties}
          >
            {/* Spotlight effect on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
              }}
            />

            {/* Event Image */}
            <div className="relative z-10 flex-1 p-[10px] box-border">
              <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-gray-900">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Event Info Footer */}
            <footer className="relative z-10 p-4 text-white font-sans">
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 mb-2">
                <h3 className="m-0 text-lg font-bold line-clamp-2">{event.title}</h3>
                <span className="text-base font-semibold text-right">{event.price}</span>
              </div>
              <p className="m-0 text-sm opacity-90 mb-1">{event.subtitle}</p>
              <div className="flex items-center gap-2 text-xs opacity-85 mb-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{event.dateTime}</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-85">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">{event.location}</span>
              </div>
              {event.seatsLeft > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  {event.seatsLeft} seats left
                </div>
              )}
            </footer>
          </article>
        </Link>
      ))}

      {/* Grayscale overlay - reveals color in spotlight area */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
        }}
      />

      {/* Fade overlay */}
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
          opacity: 1,
        }}
      />
    </div>
  )
}

export default EventChromaGrid

