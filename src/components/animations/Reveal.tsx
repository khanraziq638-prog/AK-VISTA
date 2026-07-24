import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { animation } from '../../config/animation'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Reveal({children,delay=0,className}:{children:ReactNode;delay?:number;className?:string}){const reduced=useReducedMotion();return <motion.div className={className} initial={reduced?false:{opacity:0,y:22}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:animation.standard,delay,ease:animation.ease}}>{children}</motion.div>}
