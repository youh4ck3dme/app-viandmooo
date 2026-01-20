import Script from 'next/script';

// Type definitions for JSON-LD LocalBusiness schema
interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

interface AreaServed {
  '@type': 'AdministrativeArea' | 'City' | 'Place';
  name: string;
}

interface LocalBusinessSchemaData {
  '@context': 'https://schema.org';
  '@type': 'MovingCompany';
  name: string;
  image: string | string[];
  '@id'?: string;
  url?: string;
  telephone?: string;
  email?: string;
  priceRange: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
  areaServed: AreaServed[];
  openingHoursSpecification: OpeningHoursSpecification;
  sameAs?: string[];
  description?: string;
}

interface LocalBusinessSchemaProps {
  /** Business name - defaults to "Viandmo" */
  name?: string;
  /** Image URL(s) for the business */
  image?: string | string[];
  /** Price range indicator (e.g., "€", "€€", "€€€") */
  priceRange?: string;
  /** Business phone number */
  telephone?: string;
  /** Business email */
  email?: string;
  /** Business website URL */
  url?: string;
  /** Business description */
  description?: string;
  /** Social media and other profile URLs */
  sameAs?: string[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viandmo.sk';

/**
 * LocalBusinessSchema component for injecting MovingCompany JSON-LD structured data
 * Optimized for SEO with all required and recommended properties
 */
export function LocalBusinessSchema({
  name = 'Viandmo',
  image = `${siteUrl}/images/viandmo-logo.jpg`,
  priceRange = '€€',
  telephone = '+421 123 456 789',
  email = 'info@viandmo.sk',
  url = siteUrl,
  description = 'Profesionálne sťahovacie služby v Bratislave a okolí. Sťahovanie bytov, domov, kancelárií a ťažkých bremien.',
  sameAs = [
    'https://www.facebook.com/p/VI-MO-stahovanie-upratovanie-100063524682338/',
    'https://www.instagram.com/viamoservice/',
  ],
}: LocalBusinessSchemaProps) {
  // Bratislava districts as AreaServed
  const bratislavaDistricts: AreaServed[] = [
    { '@type': 'AdministrativeArea', name: 'Bratislava I' },
    { '@type': 'AdministrativeArea', name: 'Bratislava II' },
    { '@type': 'AdministrativeArea', name: 'Bratislava III' },
    { '@type': 'AdministrativeArea', name: 'Bratislava IV' },
    { '@type': 'AdministrativeArea', name: 'Bratislava V' },
  ];

  // Geo coordinates for Bratislava city center
  const bratislavaGeo: GeoCoordinates = {
    '@type': 'GeoCoordinates',
    latitude: 48.1486,
    longitude: 17.1077,
  };

  // Opening hours: Monday to Sunday 08:00-20:00
  const openingHours: OpeningHoursSpecification = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '08:00',
    closes: '20:00',
  };

  // Address in Bratislava
  const address: PostalAddress = {
    '@type': 'PostalAddress',
    addressLocality: 'Bratislava',
    addressRegion: 'Bratislavský kraj',
    addressCountry: 'SK',
  };

  const localBusinessJsonLd: LocalBusinessSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name,
    image,
    '@id': `${url}/#localbusiness`,
    url,
    telephone,
    email,
    priceRange,
    description,
    address,
    geo: bratislavaGeo,
    areaServed: bratislavaDistricts,
    openingHoursSpecification: openingHours,
    sameAs,
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessJsonLd, null, 0),
      }}
    />
  );
}

export default LocalBusinessSchema;