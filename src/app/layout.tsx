import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Playfair_Display, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const APP_NAME = "VI&MO";
const APP_DEFAULT_TITLE = "Sťahovanie Bytov a Firiem Bratislava | VI&MO";
const APP_TITLE_TEMPLATE = "%s | VI&MO";
const APP_DESCRIPTION = "Profesionálne sťahovanie bytov, domov a firiem v Bratislave a okolí. Ponúkame aj vypratávanie a upratovacie služby. Získajte nezáväznú cenovú ponuku.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: siteUrl,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VI&MO Sťahovanie a Upratovanie v Bratislave',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
     images: [
      {
        url: '/og-image.jpg',
        alt: 'VI&MO Sťahovanie a Upratovanie v Bratislave',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(googleSiteVerification && {
    verification: {
      google: googleSiteVerification,
    },
  }),
  alternates: {
    languages: {
      'sk': siteUrl,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#00202e",
};

const fontHeadline = Playfair_Display({
  subsets: ['latin-ext'],
  variable: '--font-headline',
  display: 'swap',
});

const fontBody = Inter({
  subsets: ['latin-ext'],
  variable: '--font-body',
  display: 'swap',
});


/**
 * Comprehensive MovingCompany Schema (JSON-LD)
 * 
 * Single unified schema following Google's best practices:
 * - One comprehensive block instead of multiple smaller ones
 * - Optimized for: Organic search, Google Ads, Local Pack, Rich Snippets
 * - Contains all required and recommended properties for MovingCompany
 * 
 * @see https://schema.org/MovingCompany
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */
const movingCompanySchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": `${siteUrl}/#movingcompany`,
  
  // Základné informácie o firme
  "name": "VI and MO s. r. o.",
  "alternateName": "Viandmo",
  "legalName": "VI and MO s. r. o.",
  "description": "Profesionálne sťahovanie bytov, domov a firiem v Bratislave a okolí. Rýchlo, férovo a bez starostí. Ponúkame aj vypratávanie a upratovacie služby.",
  
  // Kontaktné údaje
  "telephone": "+421911275755",
  "email": "info@viandmo.com",
  "url": siteUrl,
  
  // Vizuálna identita
  "logo": {
    "@type": "ImageObject",
    "url": `${siteUrl}/viandmo_logo.png`,
    "width": 512,
    "height": 512
  },
  "image": {
    "@type": "ImageObject",
    "url": `${siteUrl}/og-image.jpg`,
    "width": 1200,
    "height": 630
  },
  
  // Adresa sídla
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Karpatské námestie 7770/10A",
    "addressLocality": "Bratislava",
    "addressRegion": "Bratislavský kraj",
    "postalCode": "831 06",
    "addressCountry": "SK"
  },
  
  // GPS súradnice
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.148598,
    "longitude": 17.107748
  },
  
  // Oblasti pôsobnosti - všetkých 5 okresov Bratislavy + okolie
  "areaServed": [
    {
      "@type": "City",
      "name": "Bratislava",
      "sameAs": "https://www.wikidata.org/wiki/Q1780"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Bratislava I",
      "description": "Staré Mesto - historické centrum Bratislavy"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Bratislava II",
      "description": "Ružinov, Vrakuňa, Podunajské Biskupice"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Bratislava III",
      "description": "Nové Mesto, Rača, Vajnory"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Bratislava IV",
      "description": "Karlova Ves, Dúbravka, Lamač, Devín, Devínska Nová Ves, Záhorská Bystrica"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Bratislava V",
      "description": "Petržalka, Jarovce, Rusovce, Čunovo"
    },
    {
      "@type": "GeoCircle",
      "description": "Okolie Bratislavy do 50 km",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 48.148598,
        "longitude": 17.107748
      },
      "geoRadius": "50000"
    }
  ],
  
  // Otváracie hodiny
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  
  // Cenové a platobné informácie
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Hotovosť, Platobná karta, Bankový prevod",
  
  // Firemné informácie
  "founder": {
    "@type": "Person",
    "name": "Miroslav Danihel",
    "jobTitle": "Zakladateľ a majiteľ"
  },
  "foundingDate": "2017",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 5,
    "maxValue": 10
  },
  
  // Sociálne siete
  "sameAs": [
    "https://www.facebook.com/p/VI-MO-stahovanie-upratovanie-100063524682338/",
    "https://www.instagram.com/viamoservice/"
  ],
  
  // Katalóg služieb
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Sťahovacie a upratovacie služby",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sťahovanie bytov a domov",
          "description": "Profesionálne sťahovanie bytov a rodinných domov v Bratislave"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sťahovanie firiem a kancelárií",
          "description": "Kompletné sťahovanie kancelárií a firemných priestorov"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Sťahovanie ťažkých bremien",
          "description": "Prenášanie a sťahovanie ťažkého nábytku, trezorov a strojov"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Vypratávanie a likvidácia odpadu",
          "description": "Kompletné vypratávanie bytov, pivníc a likvidácia nepotrebného nábytku"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Profesionálne upratovacie práce",
          "description": "Upratovanie po sťahovaní, rekonštrukcii alebo pravidelné upratovanie"
        }
      }
    ]
  },
  
  // Kontaktný bod
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+421911275755",
    "contactType": "customer service",
    "availableLanguage": ["Slovak", "Czech"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  },
  
  // Agregované hodnotenie (ak máte recenzie)
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "127"
  },
  
  // Dodatočné atribúty pre Local Business
  "isAccessibleForFree": false,
  "slogan": "Rýchlo, férovo a bez starostí"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="sk" className={cn(fontBody.variable, fontHeadline.variable, "dark")} suppressHydrationWarning>
      <head>
        {/* Preconnect pre externé domény */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        
        {/* RSS Feeds */}
        <link rel="alternate" type="application/rss+xml" title="VI&MO Blog RSS Feed" href={`${siteUrl}/feed.xml`} />
        <link rel="alternate" type="application/atom+xml" title="VI&MO Blog Atom Feed" href={`${siteUrl}/feed/atom`} />
        <link rel="alternate" type="application/rdf+xml" title="VI&MO Blog RDF Feed" href={`${siteUrl}/feed/rdf`} />
        
        {/* Comprehensive MovingCompany Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(movingCompanySchema) }}
        />
      </head>
      <body className={cn('font-body antialiased')}>      
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}