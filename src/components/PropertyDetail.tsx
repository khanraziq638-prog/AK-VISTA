import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bath, BedDouble, Building2, ChevronLeft, Check, Maximize2, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { business } from '../config/business'
import { supabase, type Property } from '../lib/supabase'
import LeadForm from './LeadForm'

const fallbackImage = '/assets/ak-vista-hero.webp'
const displayPrice = (property: Property) => property.price_text || (property.purpose === 'rent' ? `₹${(property.rent || 0).toLocaleString('en-IN')} / month` : `₹${(property.price || 0).toLocaleString('en-IN')}`)

export default function PropertyDetail() {
  const { slug } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let alive = true
    if (!supabase || !slug) { setNotFound(true); setLoading(false); return }
    supabase.from('properties').select('*').eq('slug', slug).eq('status', 'published').maybeSingle().then(({ data }) => {
      if (!alive) return
      setProperty(data as Property | null)
      setNotFound(!data)
      setLoading(false)
    })
    return () => { alive = false }
  }, [slug])

  if (loading) return <section className="detail-state"><p className="kicker">AK Vista listings</p><h1>Loading property…</h1></section>
  if (notFound || !property) return <section className="detail-state"><p className="kicker">Listing unavailable</p><h1>This property is no longer available.</h1><p>Browse current verified listings or let AK Vista create a personal shortlist for you.</p><Link className="gold-button" to="/properties">Browse properties</Link></section>

  const images = property.images?.length ? property.images : [property.cover_image || fallbackImage]
  const facts = [
    property.bedrooms !== undefined && property.bedrooms !== null ? [BedDouble, `${property.bedrooms} BHK`] : null,
    property.bathrooms !== undefined && property.bathrooms !== null ? [Bath, `${property.bathrooms} Bath`] : null,
    property.carpet_area ? [Maximize2, `${property.carpet_area} ${property.area_unit || 'sq ft'}`] : null,
    property.category ? [Building2, property.category] : null,
  ].filter(Boolean) as [typeof BedDouble, string][]

  return <section className="property-detail-page">
    <Link className="detail-back" to="/properties"><ChevronLeft size={17}/> All properties</Link>
    <div className="detail-heading"><div><p className="kicker">Verified AK Vista listing</p><h1>{property.title}</h1><p className="detail-location"><MapPin size={16}/>{property.locality}, {property.city}</p></div><div className="detail-price"><span>For {property.purpose === 'sale' ? 'Sale' : 'Rent'}</span><strong>{displayPrice(property)}</strong></div></div>
    <div className="detail-grid">
      <div>
        <div className="property-gallery"><img src={images[activeImage]} alt={property.title}/>{images.length > 1 && <span>{activeImage + 1} / {images.length}</span>}</div>
        {images.length > 1 && <div className="gallery-thumbnails">{images.map((image, index) => <button type="button" key={`${image}-${index}`} className={index === activeImage ? 'active' : ''} onClick={() => setActiveImage(index)}><img src={image} alt={`${property.title} view ${index + 1}`}/></button>)}</div>}
        <div className="detail-facts">{facts.map(([Icon, value]) => <div key={value}><Icon size={18}/><b>{value}</b></div>)}</div>
        <article className="detail-copy"><p className="kicker">About this property</p><h2>A considered space in {property.locality}.</h2><p>{property.description || 'Contact AK Vista for complete property details, availability, and to arrange a private visit.'}</p>{property.rera_number && <p className="rera"><ShieldCheck size={16}/> RERA: {property.rera_number}</p>}</article>
        {property.amenities?.length ? <article className="amenities"><p className="kicker">Highlights</p><h2>Thoughtful details</h2><div>{property.amenities.map(item => <span key={item}><Check size={15}/>{item}</span>)}</div></article> : null}
      </div>
      <aside className="detail-enquiry"><div className="enquiry-top"><p className="kicker">Arrange a visit</p><h2>Interested in this property?</h2><p>Share your details and AK Vista will confirm availability and arrange the next step.</p></div><LeadForm property={property} source="property detail"/><div className="quick-actions"><a href={business.phoneHref}><Phone size={16}/> Call AK Vista</a><a href={`${business.whatsappHref}?text=${encodeURIComponent(`Hello AK Vista, I am interested in ${property.title}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a></div></aside>
    </div>
    <div className="mobile-detail-actions"><a href={business.phoneHref}><Phone size={17}/> Call</a><a href={`${business.whatsappHref}?text=${encodeURIComponent(`Hello AK Vista, I am interested in ${property.title}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a></div>
  </section>
}
