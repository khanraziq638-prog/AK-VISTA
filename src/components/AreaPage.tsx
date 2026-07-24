import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Search, ShieldCheck } from 'lucide-react'
import { areaGuides, areaGuideBySlug } from '../config/areas'
import { business } from '../config/business'

function useAreaSeo(title: string, description: string, area: string) {
  useEffect(() => {
    const previousTitle = document.title
    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') || ''
    document.title = title
    descriptionTag?.setAttribute('content', description)
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: `AK Vista properties in ${area}`, description, areaServed: { '@type': 'City', name: 'Nashik' }, provider: { '@type': 'RealEstateAgent', name: business.name, telephone: business.phone, email: business.email } })
    document.head.appendChild(script)
    return () => { document.title = previousTitle; descriptionTag?.setAttribute('content', previousDescription); script.remove() }
  }, [area, description, title])
}

export default function AreaPage() {
  const { slug } = useParams()
  const area = slug ? areaGuideBySlug[slug] : undefined
  if (!area) return <Navigate to="/properties" replace/>
  useAreaSeo(area.title, area.metaDescription, area.name)
  const nearby = areaGuides.filter(item => item.slug !== area.slug)
  return <section className="area-page"><div className="area-hero"><p className="kicker">Nashik property guide</p><p className="area-crumb"><Link to="/">AK Vista</Link><span>/</span><Link to="/properties">Nashik properties</Link><span>/</span>{area.name}</p><h1>Properties in<br/><em>{area.name}, Nashik.</em></h1><p>{area.summary}</p><div className="area-hero-actions"><Link className="gold-button" to={`/properties?location=${encodeURIComponent(area.name)}`}><Search size={16}/> Browse properties <ArrowRight size={16}/></Link><Link className="hero-outline area-outline" to="/contact">Speak with AK Vista</Link></div></div><div className="area-intro-grid"><article><p className="kicker">Local property support</p><h2>Make the search<br/><em>more certain.</em></h2></article><article><p>{area.description}</p><p>We can help you move from a broad requirement to a relevant shortlist, arrange a site visit, and keep the process clear from first call to final decision.</p></article></div><section className="area-focus"><p className="kicker">Explore in {area.name}</p><div>{area.propertyFocus.map((item, index) => <Link key={item} to={`/properties?location=${encodeURIComponent(area.name)}`}><span>0{index + 1}</span><b>{item}</b><ArrowRight size={18}/></Link>)}</div></section><section className="area-trust"><article><ShieldCheck size={22}/><h3>Verified options</h3><p>Every public AK Vista listing is reviewed before it is shared.</p></article><article><MapPin size={22}/><h3>Area-focused guidance</h3><p>Get a shortlist shaped around your locality and requirement.</p></article><article><CheckCircle2 size={22}/><h3>Site visit support</h3><p>Move forward with a clear, practical next step when an option fits.</p></article></section><section className="area-cta"><div><p className="kicker">Looking in {area.name}?</p><h2>Let’s narrow the<br/><em>right options.</em></h2></div><div><a className="gold-button" href={`${business.whatsappHref}?text=${encodeURIComponent(`Hello AK Vista, I am looking for a property in ${area.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp AK Vista</a><Link className="area-contact-link" to="/contact">Send an enquiry <ArrowRight size={15}/></Link></div></section><section className="area-nearby"><p className="kicker">Explore more Nashik areas</p><div>{nearby.map(item => <Link key={item.slug} to={`/areas/${item.slug}`}>{item.name}<ArrowRight size={16}/></Link>)}</div></section></section>
}
