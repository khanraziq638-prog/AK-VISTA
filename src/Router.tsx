import { Route, Routes } from 'react-router-dom'
import { AdminDashboard, AdminGuard, AdminLogin, ListYourProperty } from './Admin'
import AdminPropertyForm from './AdminPropertyForm'
import PublicProperties from './PublicProperties'
import ContactPage from './components/ContactPage'
import HomePage from './components/HomePage'
import PropertyDetail from './components/PropertyDetail'
import { FloatingContact, SiteFooter, SiteHeader } from './components/SiteChrome'

function SimplePage({title}:{title:string}){return <section className="simple-page"><p className="kicker">AK Vista · Nashik</p><h1>{title}</h1><p>For verified property options, personal guidance and an arranged site visit, speak with the AK Vista team.</p></section>}
export default function Router(){return <><SiteHeader/><main><Routes><Route path="/" element={<HomePage/>}/><Route path="/properties" element={<PublicProperties/>}/><Route path="/property/:slug" element={<PropertyDetail/>}/><Route path="/buy" element={<PublicProperties/>}/><Route path="/rent" element={<PublicProperties/>}/><Route path="/commercial" element={<PublicProperties/>}/><Route path="/plots" element={<PublicProperties/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/list-your-property" element={<ListYourProperty/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<AdminGuard><AdminDashboard/></AdminGuard>}/><Route path="/admin/properties/new" element={<AdminGuard><AdminPropertyForm/></AdminGuard>}/><Route path="/admin/properties/:id/edit" element={<AdminGuard><AdminPropertyForm/></AdminGuard>}/><Route path="*" element={<HomePage/>}/></Routes></main><FloatingContact/><SiteFooter/></>}
