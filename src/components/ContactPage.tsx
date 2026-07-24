import { Clock3, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { business } from '../config/business'
import LeadForm from './LeadForm'

export default function ContactPage() {
  return <section className="contact-page">
    <div className="contact-intro"><p className="kicker">Talk to AK Vista</p><h1>Let’s find the right<br/><em>place to begin.</em></h1><p>Tell us what you are looking for. Whether it is a home, investment, rental or sale, our Nashik team will guide the next step.</p></div>
    <div className="contact-layout">
      <div className="contact-details">
        <a href={business.phoneHref}><Phone size={18}/><span>Call AK Vista<b>{business.phone}</b></span></a>
        <a href={business.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span>WhatsApp<b>{business.whatsapp}</b></span></a>
        <a href={`mailto:${business.email}`}><Mail size={18}/><span>Email<b>{business.email}</b></span></a>
        <div><MapPin size={18}/><span>Office location<b>{business.city}</b><small>Address shared when your visit is arranged.</small></span></div>
        <div><Clock3 size={18}/><span>Working hours<b>{business.hours}</b></span></div>
        <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18}/><span>Instagram<b>@ak_vista_realty</b></span></a>
      </div>
      <div className="contact-form-panel"><p className="kicker">Send an enquiry</p><h2>We’ll call you back.</h2><LeadForm source="contact page"/></div>
    </div>
  </section>
}
