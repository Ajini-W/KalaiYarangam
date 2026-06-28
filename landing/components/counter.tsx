'use client'

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

export function Counter({
  to,
  decimals = 0,
  duration = 2,
}: {
  to: number
  decimals?: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals)
      : Math.round(latest).toLocaleString('en-IN'),
  )

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' })
      return controls.stop
    }
  }, [inView, to, count, duration])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
