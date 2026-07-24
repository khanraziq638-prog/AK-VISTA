import { type FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2, ClipboardList, LogOut, Plus, ShieldCheck, Upload } from 'lucide-react'
import { isAdmin, type Property, supabase } from './lib/supabase'

export function ListYourProperty() {
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setResult(null)
    if (!supabase) { setResult('error'); return }
    const form = new FormData(event.currentTarget)
    const mobile = String(form.get('mobile'))
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ''))) { setResult('error'); return }
    setSending(true)
    const files = form.getAll('images').filter((item): item is File => item instanceof File && item.size > 0)
    const paths: string[] = []
    for (const file of files) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()}`
      const { error } = await supabase.storage.from('owner-submissions').upload(path, file, { contentType: file.type })
      if (error) { setSending(false); setResult('error'); return }
      paths.push(path)
    }
    const { error } = await supabase.from('property_owner_submissions').insert({ owner_name: form.get('owner_name'), mobile, whatsapp: form.get('whatsapp') || mobile, email: form.get('email') || null, property_type: form.get('property_type'), purpose: form.get('purpose'), location: form.get('location'), expected_price: form.get('expected_price'), details: form.get('details'), images: paths, status: 'pending', consent: true })
    setSending(false)
    if (error) setResult('error'); else { setResult('success'); event.currentTarget.reset() }
  }
  return <section className="page form-page"><p className="kicker">Owners & developers</p><h1>List your property<br/><em>with AK Vista.</em></h1><p className="form-intro">Your submission is reviewed by our team before it appears on the website. Public visitors can never publish properties directly.</p>{result === 'success' && <div className="notice success"><CheckCircle2/> Thank you — your property is pending AK Vista’s review.</div>}{result === 'error' && <div className="notice error">Please provide a valid 10-digit Indian mobile number and ensure Supabase is configured before submitting.</div>}<form className="form-grid" onSubmit={submit}><label>Owner name<input required name="owner_name"/></label><label>Mobile number<input required name="mobile" inputMode="numeric" placeholder="10-digit number"/></label><label>WhatsApp number<input name="whatsapp" inputMode="numeric"/></label><label>Email<input type="email" name="email"/></label><label>Property type<select name="property_type"><option>Apartment</option><option>Villa / Bungalow</option><option>Commercial</option><option>Plot / Land</option><option>Shop</option></select></label><label>For<select name="purpose"><option value="sale">Sale</option><option value="rent">Rent</option></select></label><label>Property location<input required name="location" placeholder="Locality, Nashik"/></label><label>Expected price / rent<input required name="expected_price" placeholder="e.g. ₹75 Lakh"/></label><label className="wide">Property details<textarea required name="details" rows={5} placeholder="Configuration, area, landmark and other useful details"/></label><label className="wide">Upload property images<input type="file" name="images" accept="image/*" multiple/></label><label className="check wide"><input type="checkbox" required/> I consent to AK Vista contacting me about this property and confirm that these details are accurate.</label><button className="gold-button wide" disabled={sending}>{sending ? 'Submitting…' : 'Submit for review'} <Upload size={16}/></button></form></section>
}

export function AdminLogin() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState('')
  const navigate = useNavigate()
  const login = async (event: FormEvent) => { event.preventDefault(); if (!supabase) { setError('Add your Supabase environment values first.'); return }; const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password }); if (authError || !isAdmin(data.user)) { await supabase.auth.signOut(); setError('This account is not an AK Vista administrator.'); return }; navigate('/admin') }
  return <section className="auth-page"><form className="auth-card" onSubmit={login}><ShieldCheck size={30}/><p className="kicker">Protected area</p><h1>Admin sign in</h1><p>Only authorised AK Vista administrators can access property management.</p>{error && <div className="notice error">{error}</div>}<label>Email<input type="email" required value={email} onChange={event => setEmail(event.target.value)}/></label><label>Password<input type="password" required value={password} onChange={event => setPassword(event.target.value)}/></label><button className="gold-button" type="submit">Sign in</button></form></section>
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!supabase), [allowed, setAllowed] = useState(false)
  useEffect(() => { if (!supabase) return; supabase.auth.getUser().then(({ data }) => { setAllowed(isAdmin(data.user)); setReady(true) }) }, [])
  if (!ready) return <div className="loading">Checking secure session…</div>
  return allowed ? <>{children}</> : <Navigate to="/admin/login" replace/>
}

export function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [submissions, setSubmissions] = useState<{ id: string; owner_name: string; property_type: string; location: string; status: string }[]>([])
  const [leadCount, setLeadCount] = useState(0)
  const load = async () => {
    if (!supabase) return
    const [{ data: propertyData }, { data: submissionData }, { count }] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('property_owner_submissions').select('id,owner_name,property_type,location,status').order('created_at', { ascending: false }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('lead_status', 'New'),
    ])
    setProperties((propertyData || []) as Property[]); setSubmissions(submissionData || []); setLeadCount(count || 0)
  }
  useEffect(() => { load() }, [])
  const changeStatus = async (id: string, status: string) => { if (!supabase) return; await supabase.from('properties').update({ status, published_at: status === 'published' ? new Date().toISOString() : null }).eq('id', id); load() }
  const remove = async (id: string) => { if (!supabase || !confirm('Delete this property? This cannot be undone.')) return; await supabase.from('properties').delete().eq('id', id); load() }
  return <section className="admin-page"><div className="admin-top"><div><p className="kicker">AK Vista control room</p><h1>Property dashboard</h1></div><div><Link className="outline-button" to="/admin/leads"><ClipboardList size={16}/> Leads {leadCount ? `(${leadCount})` : ''}</Link><Link className="gold-button" to="/admin/properties/new"><Plus size={16}/> Add property</Link><button onClick={() => supabase?.auth.signOut().then(() => location.assign('/admin/login'))}><LogOut size={16}/> Sign out</button></div></div><div className="stat-grid"><div><b>{properties.length}</b><span>Total properties</span></div><div><b>{properties.filter(property => property.status === 'published').length}</b><span>Published</span></div><div><b>{properties.filter(property => property.status === 'draft').length}</b><span>Drafts</span></div><div><b>{leadCount}</b><span>New enquiries</span></div></div><div className="admin-card"><div className="admin-card-header"><h2>Properties</h2><Link to="/admin/properties/new">Add new →</Link></div><div className="table-wrap"><table><thead><tr><th>Property</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{properties.map(property => <tr key={property.id}><td><b>{property.title}</b><small>{property.locality}</small></td><td>{property.category}<small>For {property.purpose}</small></td><td>{property.price_text || '—'}</td><td><span className={`status ${property.status}`}>{property.status}</span></td><td className="actions"><Link to={`/admin/properties/${property.id}/edit`}>Edit</Link>{property.status === 'published' ? <button onClick={() => changeStatus(property.id, 'draft')}>Unpublish</button> : <button onClick={() => changeStatus(property.id, 'published')}>Publish</button>}<button className="danger" onClick={() => remove(property.id)}>Delete</button></td></tr>)}</tbody></table>{!properties.length && <div className="empty">No properties yet. Add your first verified property.</div>}</div></div><div className="admin-card"><div className="admin-card-header"><h2>Owner submissions awaiting review</h2></div><div className="submission-list">{submissions.map(submission => <div key={submission.id}><b>{submission.owner_name}</b><span>{submission.property_type} · {submission.location}</span><span className={`status ${submission.status}`}>{submission.status}</span></div>)}{!submissions.length && <p>No owner submissions yet.</p>}</div></div></section>
}

export { default as PropertyForm } from './AdminPropertyForm'
