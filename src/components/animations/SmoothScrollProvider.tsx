import Lenis from 'lenis'
import { ReactNode, useEffect } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function SmoothScrollProvider({children}:{children:ReactNode}){const reduced=useReducedMotion();useEffect(()=>{if(reduced||window.matchMedia('(pointer: coarse)').matches)return;const lenis=new Lenis({duration:1.05,lerp:.09,smoothWheel:true});let frame=0;const raf=(time:number)=>{lenis.raf(time);frame=requestAnimationFrame(raf)};frame=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(frame);lenis.destroy()}},[reduced]);return <>{children}</>}
