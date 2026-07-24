import { Route, Routes } from 'react-router-dom'
import { AdminDashboard, AdminGuard, AdminLogin, ListYourProperty } from './Admin'
import AdminLeads from './AdminLeads'
import AdminPropertyForm from './AdminPropertyForm'
import PublicProperties from './PublicProperties'
import ContactPage from './components/ContactPage'
import AreaPage from './components/AreaPage'
import HomePage from './components/HomePage'
import PropertyDetail from './components/PropertyDetail'
import { FloatingContact, SiteFooter, SiteHeader } from './components/SiteChrome'

export default function Router() {
  return <><SiteHeader/><main><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/properties" element={<PublicProperties/>}/>
    <Route path="/areas/:slug" element={<AreaPage/>}/>
    <Route path="/property/:slug" element={<PropertyDetail/>}/>
    <Route path="/buy" element={<PublicProperties/>}/><Route path="/rent" element={<PublicProperties/>}/>
    <Route path="/commercial" element={<PublicProperties/>}/><Route path="/plots" element={<PublicProperties/>}/>
    <Route path="/contact" element={<ContactPage/>}/><Route path="/list-your-property" element={<ListYourProperty/>}/>
    <Route path="/admin/login" element={<AdminLogin/>}/>
    <Route path="/admin" element={<AdminGuard><AdminDashboard/></AdminGuard>}/>
    <Route path="/admin/leads" element={<AdminGuard><AdminLeads/></AdminGuard>}/>
    <Route path="/admin/properties/new" element={<AdminGuard><AdminPropertyForm/></AdminGuard>}/>
    <Route path="/admin/properties/:id/edit" element={<AdminGuard><AdminPropertyForm/></AdminGuard>}/>
    <Route path="*" element={<HomePage/>}/>
  </Routes></main><FloatingContact/><SiteFooter/></>
}
