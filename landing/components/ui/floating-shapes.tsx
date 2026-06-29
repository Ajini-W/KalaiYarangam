'use client'

import { cn } from '@/lib/utils'

interface Shape {
  type: 'circle' | 'square' | 'triangle' | 'hexagon'
  color: string
  size: number
  x: string
  y: string
  delay?: number
  duration?: number
}

const shapeComponents: Record<Shape['type'], (size: number, color: string) => JSX.Element> = {
  circle: (size, color) => (
    <div
      className="rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  ),
  square: (size, color) => (
    <div
      className="rounded-2xl"
      style={{ width: size, height: size, backgroundColor: color, transform: 'rotate(45deg)' }}
    />
  ),
  triangle: (size, color) => (
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      }}
    />
  ),
  hexagon: (size, color) => (
    <div
      className="rounded-xl"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
    />
  ),
}

export function FloatingShapes({
  shapes,
  className,
}: {
  shapes: Shape[]
  className?: string
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: shape.x,
            top: shape.y,
            animationDelay: `${shape.delay ?? 0}s`,
            animationDuration: `${shape.duration ?? 6}s`,
          }}
        >
          {shapeComponents[shape.type](shape.size, shape.color)}
        </div>
      ))}
    </div>
  )
}
