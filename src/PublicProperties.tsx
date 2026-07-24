import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BedDouble, MapPin, Search, ShowerHead } from 'lucide-react'
import type { Property } from './lib/supabase'
import { supabase } from './lib/supabase'

const fallbackImage = '/assets/ak-vista-hero.webp'
const displayPrice = (property: Property) => property.price_text || (property.purpose === 'rent' ? `₹${(property.rent || 0).toLocaleString('en-IN')} / month` : `₹${(property.price || 0).toLocaleString('en-IN')}`)

export default function PublicProperties(){
  const [properties,setProperties]=useState<Property[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [search,setSearch]=useState(new URLSearchParams(useLocation().search).get('location') || '')
  useEffect(()=>{ if(!supabase){setError('Property service is not configured.');setLoading(false);return} supabase.from('properties').select('*').eq('status','published').order('created_at',{ascending:false}).then(({data,error})=>{if(error)setError('Unable to load properties right now.');else setProperties((data||[]) as Property[]);setLoading(false)}) },[])
  const results=useMemo(()=>properties.filter(property=>`${property.title} ${property.locality} ${property.category}`.toLowerCase().includes(search.toLowerCase())),[properties,search])
  return <section className="page public-properties"><p className="kicker">Verified listings</p><h1>Properties in <em>Nashik</em></h1><p className="form-intro">Explore properties personally reviewed by AK Vista. Prices and availability are subject to confirmation.</p><div className="listing-search"><Search size={18}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search location, property or category"/><span>{loading?'Loading…':`${results.length} ${results.length===1?'property':'properties'}`}</span></div>{error&&<p className="notice error">{error}</p>}{!loading&&!error&&<div className="live-property-grid">{results.map(property=><article className="live-property-card" key={property.id}><img src={property.cover_image||property.images?.[0]||fallbackImage} alt={property.title}/><div className="live-property-content"><div className="card-top"><span>For {property.purpose==='sale'?'Sale':'Rent'}</span>{property.featured&&<b>Featured</b>}</div><h2>{property.title}</h2><p><MapPin size={14}/>{property.locality}, {property.city}</p><strong>{displayPrice(property)}</strong><div className="specs">{property.bedrooms!==null&&property.bedrooms!==undefined&&<span><BedDouble size={15}/>{property.bedrooms} BHK</span>}{property.bathrooms!==null&&property.bathrooms!==undefined&&<span><ShowerHead size={15}/>{property.bathrooms} Bath</span>}{property.carpet_area&&<span>{property.carpet_area} {property.area_unit||'sq ft'}</span>}</div><Link to={`/property/${property.slug}`}>View property <span>→</span></Link></div></article>)}</div>}{!loading&&!error&&!results.length&&<div className="empty"><h2>No published properties match your search.</h2><p>Try another locality or contact AK Vista for assistance.</p></div>}</section>
}
