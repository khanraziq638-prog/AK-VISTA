import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LoadingScreen(){const [visible,setVisible]=useState(true);useEffect(()=>{const hide=()=>setTimeout(()=>setVisible(false),250);if(document.readyState==='complete')hide();else window.addEventListener('load',hide,{once:true});return()=>window.removeEventListener('load',hide)},[]);return <AnimatePresence>{visible&&<motion.div className="page-loader" exit={{opacity:0}} transition={{duration:.35}}><div><b>AKV</b><span/></div></motion.div>}</AnimatePresence>}
