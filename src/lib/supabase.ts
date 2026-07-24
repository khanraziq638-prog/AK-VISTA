import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)
export const supabase = isSupabaseConfigured ? createClient(url, key) : null

export type PropertyStatus = 'draft' | 'published' | 'sold' | 'rented' | 'archived'
export interface Property {
  id: string; title: string; slug: string; description?: string; purpose: 'sale' | 'rent'; category: string; subtype?: string
  city: string; locality: string; price?: number; rent?: number; price_text?: string; bedrooms?: number; bathrooms?: number
  carpet_area?: number; area_unit?: string; images?: string[]; cover_image?: string; status: PropertyStatus; featured?: boolean
  rera_number?: string; amenities?: string[]; furnishing?: string; parking?: string; address?: string
  developer_name?: string; project_name?: string; possession_date?: string; created_at?: string
}

export interface Lead {
  id: string; name: string; mobile: string; whatsapp?: string | null; email?: string | null
  enquiry_type: string; property_title?: string | null; budget?: string | null; preferred_location?: string | null
  message?: string | null; lead_status: string; source?: string | null; internal_notes?: string | null; created_at: string
}

export const isAdmin = (user: { app_metadata?: Record<string, unknown> } | null) => user?.app_metadata?.role === 'admin'
