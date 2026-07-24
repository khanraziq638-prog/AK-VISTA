import { Menu, Phone, X, MessageCircle, ArrowUpRight, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { business } from '../config/business'

const links = [['Buy', '/buy'], ['Rent', '/rent'], ['Commercial', '/commercial'], ['Plots', '/plots'], ['Properties', '/properties'], ['About', '/#about'], ['Contact', '/contact']]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const location = useLocation()
  useEffect(() => { const onScroll = () => setCompact(window.scrollY > 48); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  return <header className={`premium-header ${compact ? 'compact' : ''} ${location.pathname === '/' ? 'over-hero' : ''}`}><Link className="premium-logo" to="/" aria-label="AK Vista home"><span>AK</span> VISTA<i/></Link><nav aria-label="Primary navigation">{links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}</nav><div className="header-contact"><a className="nav-call" aria-label="Call AK Vista now" href={business.phoneHref}><Phone size={16}/><span>Call Now</span></a><a className="nav-whatsapp" href={business.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a><Link className="nav-list" to="/list-your-property">List Property <ArrowUpRight size={14}/></Link></div><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button><AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div>{links.map((link, index) => <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} key={link[0]}><Link to={link[1]}>{link[0]}</Link></motion.div>)}</div><a className="gold-button" href={business.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp AK Vista</a></motion.div>}</AnimatePresence></header>
}

export function FloatingContact() {
  const [shown, setShown] = useState(false)
  const location = useLocation()
  useEffect(() => { const update = () => setShown(window.scrollY > window.innerHeight * .25); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  const showMobileBar = !location.pathname.startsWith('/property/')
  return <><a className={`floating-whatsapp ${shown ? 'show' : ''}`} href={business.whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat with AK Vista on WhatsApp"><MessageCircle size={21}/><span>WhatsApp us</span></a>{showMobileBar && <div className="mobile-contact-bar" aria-label="Quick contact options"><a href={business.phoneHref}><Phone size={16}/> Call</a><a href={business.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><Link to="/contact"><Send size={15}/> Enquire</Link></div>}</>
}

export function SiteFooter() { return <footer className="premium-footer"><div className="footer-mark">AK <em>VISTA</em></div><div className="footer-grid"><div><b>AK Vista Realty</b><p>Independent real estate consultant in Nashik, helping buyers, sellers and investors make confident decisions.</p></div><div><b>Explore</b><Link to="/properties">Properties</Link><Link to="/list-your-property">List your property</Link><Link to="/contact">Contact us</Link></div><div><b>Contact</b><a href={business.phoneHref}>{business.phone}</a><a href={business.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a><a href={business.instagram} target="_blank" rel="noreferrer">@ak_vista_realty</a></div></div><small>© {new Date().getFullYear()} AK Vista. Property prices, availability and details are subject to change. Please independently verify all legal and MahaRERA information.</small></footer> }
