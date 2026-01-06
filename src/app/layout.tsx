
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Playfair_Display, Inter } from 'next/font/google';

const APP_NAME = "VI&MO";
const APP_DEFAULT_TITLE = "Sťahovanie Bytov a Firiem Bratislava | VI&MO";
const APP_TITLE_TEMPLATE = "%s | VI&MO";
const APP_DESCRIPTION = "Profesionálne sťahovanie bytov, domov a firiem v Bratislave a okolí. Ponúkame aj vypratávanie a upratovacie služby. Získajte nezáväznú cenovú ponuku.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com';

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
        url: '/og-image.jpg', // Odkaz na predvolený OG obrázok
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


// Structured Data pre organizáciu
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "name": "VI and MO s. r. o.",
  "description": "Profesionálne sťahovanie bytov, domov a firiem v Bratislave a okolí. Rýchlo, férovo a bez starostí. Ponúkame aj vypratávanie a upratovacie služby.",
  "telephone": "+421911275755",
  "email": "info@viandmo.com",
  "url": siteUrl,
  "logo": `${siteUrl}/viandmo_logo.png`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Karpatské námestie 7770/10A",
    "addressLocality": "Bratislava",
    "addressRegion": "Bratislavský kraj",
    "postalCode": "831 06",
    "addressCountry": "SK"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "48.148598",
      "longitude": "17.107748"
    },
    "geoRadius": "50000"
  },
  "openingHours": "Mo-Su 08:00-20:00",
  "priceRange": "€€",
  "founder": {
    "@type": "Person",
    "name": "Miroslav Danihel"
  },
  "sameAs": [
    "https://www.facebook.com/p/VI-MO-stahovanie-upratovanie-100063524682338/",
    "https://www.instagram.com/viamoservice/"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Služby",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sťahovanie bytov a domov" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sťahovanie firiem a kancelárií" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vypratávanie a likvidácia odpadu" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Profesionálne upratovacie práce" } }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={cn(fontBody.variable, fontHeadline.variable, "dark")} suppressHydrationWarning>
      <head>
        {/* Preconnect pre externé domény */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        
        {/* RSS Feeds */}
        <link rel="alternate" type="application/rss+xml" title="VI&MO Blog RSS Feed" href={`${siteUrl}/feed.xml`} />
        <link rel="alternate" type="application/atom+xml" title="VI&MO Blog Atom Feed" href={`${siteUrl}/feed/atom`} />
        <link rel="alternate" type="application/rdf+xml" title="VI&MO Blog RDF Feed" href={`${siteUrl}/feed/rdf`} />
        
        {/* Structured Data pre organizáciu */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={cn('font-body antialiased')}>
        {children}
      </body>
    </html>
  );
}
