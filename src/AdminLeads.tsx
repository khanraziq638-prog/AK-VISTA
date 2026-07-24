import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, Filter, Mail, MapPin, MessageCircle, Phone, Save, UsersRound } from 'lucide-react'
import { supabase, type Lead } from './lib/supabase'

const statuses = ['New', 'Contacted', 'Site Visit', 'Closed', 'Not interested']
const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [draftStatus, setDraftStatus] = useState('New')
  const [notes, setNotes] = useState('')

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: loadError } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (loadError) setError('Unable to load enquiries. Please sign in again and retry.')
    else { const result = (data || []) as Lead[]; setLeads(result); if (!selectedId && result[0]) setSelectedId(result[0].id) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  const selected = leads.find(lead => lead.id === selectedId) || null
  useEffect(() => { if (selected) { setDraftStatus(selected.lead_status || 'New'); setNotes(selected.internal_notes || ''); setSaved(false) } }, [selectedId, selected?.lead_status, selected?.internal_notes])
  const visible = useMemo(() => leads.filter(lead => { const text = `${lead.name} ${lead.mobile} ${lead.property_title || ''} ${lead.preferred_location || ''}`.toLowerCase(); return (statusFilter === 'All' || lead.lead_status === statusFilter) && text.includes(search.toLowerCase()) }), [leads, search, statusFilter])
  const update = async (nextStatus = draftStatus) => {
    if (!supabase || !selected) return
    setSaving(true); setError(''); setSaved(false)
    const { error: updateError } = await supabase.from('leads').update({ lead_status: nextStatus, internal_notes: notes.trim() || null }).eq('id', selected.id)
    setSaving(false)
    if (updateError) { setError('The enquiry could not be updated. Please try again.'); return }
    setLeads(current => current.map(lead => lead.id === selected.id ? { ...lead, lead_status: nextStatus, internal_notes: notes.trim() || null } : lead)); setDraftStatus(nextStatus); setSaved(true)
  }
  const statusClass = (status: string) => `lead-status status-${status.toLowerCase().replace(/ /g, '-')}`
  return <section className="admin-page leads-page"><div className="admin-top"><div><p className="kicker">AK Vista control room</p><h1>Enquiries & leads</h1><p className="admin-lead-copy">Every website enquiry is private to your AK Vista administrator account.</p></div><Link className="outline-button" to="/admin"><ArrowLeft size={16}/> Dashboard</Link></div><div className="lead-stat-grid"><div><UsersRound size={18}/><b>{leads.length}</b><span>Total enquiries</span></div><div><Clock3 size={18}/><b>{leads.filter(lead => lead.lead_status === 'New').length}</b><span>New leads</span></div><div><MapPin size={18}/><b>{leads.filter(lead => lead.lead_status === 'Site Visit').length}</b><span>Site visits</span></div><div><CheckCircle2 size={18}/><b>{leads.filter(lead => lead.lead_status === 'Closed').length}</b><span>Closed</span></div></div><div className="lead-workspace"><div className="lead-list-panel"><div className="lead-toolbar"><label><Filter size={15}/><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter lead status"><option>All</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, property or locality" aria-label="Search leads"/></div>{loading ? <div className="empty">Loading enquiries…</div> : <div className="lead-list">{visible.map(lead => <button type="button" key={lead.id} onClick={() => setSelectedId(lead.id)} className={lead.id === selectedId ? 'active' : ''}><span className={statusClass(lead.lead_status)}>{lead.lead_status}</span><b>{lead.name}</b><small>{lead.property_title || lead.enquiry_type}</small><time>{formatDate(lead.created_at)}</time></button>)}{!visible.length && <div className="empty">No enquiries match this view.</div>}</div>}</div><aside className="lead-detail">{selected ? <><div className="lead-detail-heading"><div><p className="kicker">Lead details</p><h2>{selected.name}</h2><span>{formatDate(selected.created_at)}</span></div><span className={statusClass(selected.lead_status)}>{selected.lead_status}</span></div><div className="lead-contact-actions"><a href={`tel:+91${selected.mobile.replace(/\D/g, '').slice(-10)}`}><Phone size={16}/> Call</a><a href={`https://wa.me/91${(selected.whatsapp || selected.mobile).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${selected.name}, this is AK Vista regarding your enquiry.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>{selected.email && <a href={`mailto:${selected.email}`}><Mail size={16}/> Email</a>}</div><dl className="lead-info"><div><dt>Interested in</dt><dd>{selected.property_title || 'General property enquiry'}</dd></div><div><dt>Mobile number</dt><dd>{selected.mobile}</dd></div>{selected.preferred_location && <div><dt>Preferred locality</dt><dd>{selected.preferred_location}</dd></div>}{selected.budget && <div><dt>Budget</dt><dd>{selected.budget}</dd></div>}{selected.source && <div><dt>Source</dt><dd>{selected.source}</dd></div>}{selected.message && <div className="wide"><dt>Requirement</dt><dd>{selected.message}</dd></div>}</dl><div className="lead-editor"><label>Lead status<select value={draftStatus} onChange={event => { setDraftStatus(event.target.value); setSaved(false) }}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label><label>Internal notes<textarea value={notes} onChange={event => { setNotes(event.target.value); setSaved(false) }} rows={5} placeholder="Add private call notes, next steps or site visit details"/></label>{error && <p className="lead-error">{error}</p>}{saved && <p className="lead-saved">Changes saved.</p>}<div><button className="gold-button" onClick={() => update()} disabled={saving}>{saving ? 'Saving…' : 'Save lead'} <Save size={15}/></button>{selected.lead_status === 'New' && <button className="lead-secondary" onClick={() => update('Contacted')} disabled={saving}>Mark contacted</button>}</div></div></> : <div className="empty">Choose an enquiry to view its details.</div>}</aside></div></section>
}
