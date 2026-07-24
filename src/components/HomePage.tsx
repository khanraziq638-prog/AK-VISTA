import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Building2, CalendarCheck, CheckCircle2, Handshake, KeyRound, MapPin, MapPinned, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from './animations/Reveal'
import { animation } from '../config/animation'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { business } from '../config/business'
import { supabase, type Property } from '../lib/supabase'
import FounderSection from '../FounderSection'
import { areaSlugByName } from '../config/areas'

const locations = ['Gangapur Road', 'College Road', 'Indira Nagar', 'Govind Nagar', 'Pathardi Phata', 'Panchavati', 'Nashik Road', 'Trimbak Road']
const categories = [
  ['Apartments', 'Residential homes for contemporary living', '/assets/categories/apartments.webp'],
  ['Villas', 'Private spaces with room to grow', '/assets/categories/villas.webp'],
  ['Commercial', 'Spaces that work as hard as you do', '/assets/categories/commercial.webp'],
  ['Plots', 'Land for your next chapter', '/assets/categories/plots.webp'],
  ['Rentals', 'Flexible homes in the right location', '/assets/categories/apartments.webp'],
  ['New Projects', 'Early access to emerging addresses', '/assets/ak-vista-hero.webp'],
]
const trust = [
  ['Verified Properties', 'Every listing is reviewed before it goes live.'],
  ['Local Nashik Expertise', 'Clear, neighbourhood-level guidance when it matters.'],
  ['Transparent Guidance', 'Honest advice at every stage of the decision.'],
  ['End-to-End Support', 'From discovery to documentation, your next step is supported.'],
]
const heroTrust = [
  [BadgeCheck, 'Verified Properties'],
  [MapPinned, 'Local Nashik Expertise'],
  [CalendarCheck, 'Site Visit Support'],
  [Handshake, 'Transparent Guidance'],
] as const

function FeaturedCard({ property }: { property: Property }) {
  const image = property.cover_image || property.images?.[0] || '/assets/ak-vista-hero.webp'
  const price = property.price_text || (property.purpose === 'rent' ? `₹${(property.rent || 0).toLocaleString('en-IN')} / month` : `₹${(property.price || 0).toLocaleString('en-IN')}`)
  return <article className="featured-card"><Link to={`/property/${property.slug}`} className="featured-image"><img src={image} alt={property.title} loading="lazy"/><span>For {property.purpose === 'sale' ? 'Sale' : 'Rent'}</span>{property.featured && <b>Featured</b>}<i>View property <ArrowRight size={16}/></i></Link><div><p><MapPin size={13}/>{property.locality}, Nashik</p><h3>{property.title}</h3><strong>{price}</strong><small>{property.bedrooms ? `${property.bedrooms} BHK · ` : ''}{property.bathrooms ? `${property.bathrooms} Bath · ` : ''}{property.carpet_area ? `${property.carpet_area} ${property.area_unit || 'sq ft'}` : property.category}</small><a href={`${business.whatsappHref}?text=${encodeURIComponent(`Hello AK Vista, I am interested in ${property.title}.`)}`} target="_blank" rel="noreferrer">WhatsApp enquiry <ArrowRight size={14}/></a></div></article>
}

function StorySection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !ref.current || window.innerWidth < 900) return
    let context: { revert: () => void } | undefined
    let cancelled = false
    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !ref.current) return
      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        gsap.fromTo('.story-image', { scale: 1.08 }, { scale: 1, scrollTrigger: { trigger: ref.current, start: 'top 72%', end: 'bottom 30%', scrub: true } })
        gsap.utils.toArray<HTMLElement>('.story-point').forEach(point => gsap.fromTo(point, { opacity: .28, x: -16 }, { opacity: 1, x: 0, scrollTrigger: { trigger: point, start: 'top 78%', end: 'top 52%', scrub: true } }))
      }, ref)
    })()
    return () => { cancelled = true; context?.revert() }
  }, [reduced])
  const points = ['Local market expertise', 'Verified property options', 'Honest advisory', 'End-to-end support']
  return <section ref={ref} className="story-section" id="about"><div className="story-media"><img className="story-image" src="/assets/ak-vista-hero.webp" alt="Contemporary residence in a leafy neighbourhood"/></div><div className="story-copy"><p className="kicker">The AK Vista approach</p><h2>Property guidance<br/><em>that feels personal.</em></h2>{points.map((point, index) => <div className="story-point" key={point}><span>0{index + 1}</span><div><h3>{point}</h3><p>{trust[index][1]}</p></div></div>)}</div></section>
}

type SearchFieldsProps = { location: string; setLocation: (value: string) => void; compact?: boolean }
function SearchFields({ location, setLocation, compact }: SearchFieldsProps) {
  return <>
    <label><span>Looking to</span><select name="intent" defaultValue="buy" aria-label="Looking to"><option value="buy">Buy</option><option value="rent">Rent</option></select></label>
    <label><span>Property type</span><select name="propertyType" aria-label="Property type"><option>All property types</option><option>Apartment</option><option>Villa</option><option>Commercial</option><option>Plot</option></select></label>
    <label><span>Location</span><input name="location" value={location} onChange={event => setLocation(event.target.value)} placeholder="Any Nashik locality" aria-label="Preferred Nashik locality"/></label>
    {!compact && <><label className="search-optional"><span>Budget range</span><select name="budget" aria-label="Budget range"><option>Any budget</option><option>Up to ₹50 Lakh</option><option>₹50 Lakh – ₹1 Cr</option><option>Above ₹1 Cr</option></select></label><label className="search-optional"><span>Bedrooms</span><select name="bedrooms" aria-label="Bedrooms"><option>Any</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK+</option></select></label></>}
  </>
}

export default function HomePage() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [location, setLocation] = useState('')
  const [featured, setFeatured] = useState<Property[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setFiltersOpen(false); navigate(`/properties${location ? `?location=${encodeURIComponent(location)}` : ''}`) }
  const itemAnimation = (delay: number) => reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: .58, delay, ease: animation.ease } }

  useEffect(() => { if (!supabase) return; supabase.from('properties').select('*').eq('status', 'published').order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(3).then(({ data }) => setFeatured((data || []) as Property[])) }, [])
  return <>
    <section className={`cinematic-hero ${reduced ? 'hero-reduced' : ''}`}>
      <div className="hero-film"/>
      <div className="hero-inner">
        <motion.p className="hero-tag" {...itemAnimation(.04)}>AK Vista · Nashik, Maharashtra</motion.p>
        <h1><motion.span {...itemAnimation(.12)}>Find your perfect</motion.span><motion.em {...itemAnimation(.23)}>property in Nashik.</motion.em></h1>
        <motion.p className="hero-lead" {...itemAnimation(.35)}>Buy, sell, rent and invest with trusted local guidance from a team that knows what makes an address feel right.</motion.p>
        <motion.div className="hero-actions" {...itemAnimation(.46)}><Link className="gold-button" to="/properties">Explore properties <ArrowRight size={16}/></Link><Link className="hero-outline" to="/list-your-property">List your property <ArrowRight size={16}/></Link></motion.div>
      </div>
      <motion.form className="hero-search" onSubmit={submitSearch} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .58, delay: .56, ease: animation.ease }}>
        <SearchFields location={location} setLocation={setLocation}/><button type="submit" aria-label="Search properties"><Search size={19}/> Search</button>
      </motion.form>
      <button className="mobile-search-trigger" type="button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog"><SlidersHorizontal size={17}/> Search Nashik properties</button>
      <motion.div className="hero-trust-strip" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .72 }}>
        {heroTrust.map(([Icon, label]) => <div key={label}><Icon size={18}/><span>{label}</span></div>)}
      </motion.div>
    </section>
    <AnimatePresence>{filtersOpen && <motion.div className="mobile-filter-dialog" role="dialog" aria-modal="true" aria-label="Search properties" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="mobile-filter-sheet" initial={reduced ? false : { y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: .35, ease: animation.ease }}><div className="filter-sheet-top"><div><p className="kicker">Property finder</p><h2>Find your next address.</h2></div><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close property search"><X size={20}/></button></div><form onSubmit={submitSearch} className="mobile-filter-form"><SearchFields compact location={location} setLocation={setLocation}/><button className="gold-button" type="submit"><Search size={17}/> Search properties</button></form></motion.div></motion.div>}</AnimatePresence>
    <section className="premium-section categories-section"><Reveal><p className="kicker">Explore by intent</p><div className="section-heading"><h2>Every move begins<br/><em>with the right space.</em></h2><Link to="/properties">Browse all properties <ArrowRight size={16}/></Link></div></Reveal><div className="category-rail">{categories.map((category, index) => <Reveal key={category[0]} delay={index * .06}><Link className="category-card" to={`/properties?category=${encodeURIComponent(category[0])}`}><img src={category[2]} alt="" loading="lazy"/><span>0{index + 1}</span><h3>{category[0]}</h3><p>{category[1]}</p><ArrowRight size={19}/></Link></Reveal>)}</div></section>
    <section className="premium-section featured-section"><Reveal><p className="kicker">Selected listings</p><div className="section-heading"><h2>Homes worth<br/><em>coming home to.</em></h2><Link to="/properties">View all properties <ArrowRight size={16}/></Link></div></Reveal>{featured.length ? <div className="featured-grid">{featured.map(property => <FeaturedCard key={property.id} property={property}/>)}</div> : <div className="premium-empty"><Building2/><h3>New verified listings are being added.</h3><p>Speak to AK Vista for a private shortlist tailored to your requirement.</p><a className="gold-button" href={business.whatsappHref} target="_blank" rel="noreferrer">WhatsApp us</a></div>}</section>
    <StorySection/>
    <section className="premium-section trust-section"><Reveal><p className="kicker">Why AK Vista</p><h2>A calmer, clearer way<br/><em>to make your next move.</em></h2></Reveal><div className="trust-grid">{trust.map(([title, copy], index) => <Reveal key={title} delay={index * .08}><article><span>{index === 0 ? <ShieldCheck/> : index === 1 ? <MapPin/> : index === 2 ? <CheckCircle2/> : <KeyRound/>}</span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div></section>
    <FounderSection/>
    <section className="locations-section"><div><p className="kicker">Nashik, neighbourhood by neighbourhood</p><h2>Know the address.<br/><em>Understand the opportunity.</em></h2></div><div className="locations-list">{locations.map((item, index) => <Link key={item} to={areaSlugByName[item] ? `/areas/${areaSlugByName[item]}` : `/properties?location=${encodeURIComponent(item)}`}><span>0{index + 1}</span><b>{item}</b><ArrowRight size={18}/></Link>)}</div></section>
    <section className="owner-cta"><div><p className="kicker">Owners & developers</p><h2>Ready to list your<br/><em>property well?</em></h2><p>Reach verified buyers with a considered presentation and guidance from the AK Vista team.</p><Link className="gold-button" to="/list-your-property">List your property <ArrowRight size={16}/></Link></div><a className="owner-contact" href={business.phoneHref}><span>Speak directly with AK Vista</span><strong>{business.phone}</strong></a></section>
  </>
}
