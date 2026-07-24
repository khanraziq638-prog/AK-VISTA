export type AreaGuide = {
  slug: string
  name: string
  summary: string
  description: string
  propertyFocus: string[]
  title: string
  metaDescription: string
}

export const areaGuides: AreaGuide[] = [
  {
    slug: 'gangapur-road', name: 'Gangapur Road',
    title: 'Properties in Gangapur Road, Nashik | AK Vista',
    metaDescription: 'Explore verified apartments, villas and investment property options in Gangapur Road, Nashik with AK Vista.',
    summary: 'A considered shortlist for buyers, renters and owners looking around Gangapur Road.',
    description: 'AK Vista helps you compare verified property options in Gangapur Road with clear guidance on configuration, location, pricing and the next practical step.',
    propertyFocus: ['Apartments', 'Villas', 'Investment options'],
  },
  {
    slug: 'college-road', name: 'College Road',
    title: 'Properties in College Road, Nashik | AK Vista',
    metaDescription: 'Find verified residential and commercial property options in College Road, Nashik with local guidance from AK Vista.',
    summary: 'Focused property support for homes, rentals and commercial requirements around College Road.',
    description: 'From a family home to a rental or business space, AK Vista makes it easier to review suitable options in College Road and arrange a verified site visit.',
    propertyFocus: ['Apartments', 'Commercial spaces', 'Rentals'],
  },
  {
    slug: 'indira-nagar', name: 'Indira Nagar',
    title: 'Properties in Indira Nagar, Nashik | AK Vista',
    metaDescription: 'Browse verified homes, rentals and commercial property options in Indira Nagar, Nashik with AK Vista.',
    summary: 'Verified property guidance for buyers, sellers and tenants in Indira Nagar.',
    description: 'AK Vista offers a practical property search for Indira Nagar, helping you assess homes, rental requirements and commercial choices with local support.',
    propertyFocus: ['Residential homes', 'Rental options', 'Commercial property'],
  },
  {
    slug: 'nashik-road', name: 'Nashik Road',
    title: 'Properties in Nashik Road, Nashik | AK Vista',
    metaDescription: 'Discover verified apartments, family homes, rentals and commercial properties in Nashik Road with AK Vista.',
    summary: 'A clear route to verified residential, rental and commercial property options in Nashik Road.',
    description: 'Tell AK Vista what you need in Nashik Road and we will help narrow the search, verify suitable choices and coordinate a visit when you are ready.',
    propertyFocus: ['Family homes', 'Rental homes', 'Shops and offices'],
  },
  {
    slug: 'pathardi-phata', name: 'Pathardi Phata',
    title: 'Properties in Pathardi Phata, Nashik | AK Vista',
    metaDescription: 'Explore verified new projects, apartments, plots and investment property options in Pathardi Phata, Nashik with AK Vista.',
    summary: 'Property guidance for new projects, homes, plots and investment enquiries around Pathardi Phata.',
    description: 'AK Vista helps you review available property options in Pathardi Phata with straightforward information, verified listings and personal assistance for your next move.',
    propertyFocus: ['New projects', 'Apartments', 'Plots and land'],
  },
]

export const areaGuideBySlug = Object.fromEntries(areaGuides.map(area => [area.slug, area])) as Record<string, AreaGuide>
export const areaSlugByName = Object.fromEntries(areaGuides.map(area => [area.name, area.slug])) as Record<string, string>
