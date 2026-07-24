import { type FormEvent, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { business } from '../config/business'
import { supabase, type Property } from '../lib/supabase'

type LeadFormProps = {
  property?: Property
  source?: string
}

export default function LeadForm({ property, source = 'website' }: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const mobile = String(form.get('mobile') || '').replace(/\D/g, '')
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }
    if (!supabase) {
      setError('The enquiry service is not configured yet. Please call us directly.')
      return
    }

    setSubmitting(true)
    setError('')
    const { error: insertError } = await supabase.from('leads').insert({
      name: String(form.get('name') || '').trim(),
      mobile,
      whatsapp: mobile,
      email: String(form.get('email') || '').trim() || null,
      enquiry_type: property ? 'property enquiry' : 'general enquiry',
      property_id: property?.id || null,
      property_title: property?.title || null,
      budget: String(form.get('budget') || '').trim() || null,
      preferred_location: String(form.get('preferred_location') || '').trim() || null,
      message: String(form.get('message') || '').trim() || null,
      source,
    })
    setSubmitting(false)
    if (insertError) {
      setError('We could not send your enquiry. Please try again or WhatsApp us directly.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    const message = property
      ? `Hello AK Vista, I have submitted an enquiry for ${property.title}.`
      : 'Hello AK Vista, I have submitted an enquiry on your website.'
    return <div className="lead-success"><CheckCircle2 size={28}/><h3>Thank you — we have your enquiry.</h3><p>AK Vista will contact you shortly with the right next steps.</p><a className="outline-button" href={`${business.whatsappHref}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a></div>
  }

  return <form className="lead-form" onSubmit={submit}>
    {property && <p className="lead-property">Enquiring about <b>{property.title}</b></p>}
    <label>Your name<input name="name" required autoComplete="name" placeholder="Full name"/></label>
    <label>Mobile number<input name="mobile" required inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"/></label>
    <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com"/></label>
    <label>Preferred locality <span>(optional)</span><input name="preferred_location" placeholder="e.g. Gangapur Road"/></label>
    <label>Budget <span>(optional)</span><input name="budget" placeholder="e.g. ₹80 Lakh to ₹1 Cr"/></label>
    <label>How can we help? <span>(optional)</span><textarea name="message" rows={4} placeholder="Tell us your requirement"/></label>
    <label className="lead-consent"><input type="checkbox" required/> <span>I agree to be contacted by AK Vista about this enquiry.</span></label>
    {error && <p className="lead-error" role="alert">{error}</p>}
    <button className="gold-button" disabled={submitting}>{submitting ? 'Sending enquiry…' : 'Request a callback'} <Send size={16}/></button>
    <small>Your details are shared only with the AK Vista team.</small>
  </form>
}
