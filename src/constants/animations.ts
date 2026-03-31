import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
}

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.22, ease: 'easeOut' } },
}

export const correctFlash = {
  animate: {
    backgroundColor: ['rgba(34,197,94,0)', 'rgba(34,197,94,0.2)', 'rgba(34,197,94,0)'],
    transition: { duration: 0.5 },
  },
}

export const wrongShake = {
  animate: {
    x: [0, -8, 8, -8, 8, 0],
    transition: { duration: 0.4 },
  },
}
