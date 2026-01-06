
import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Kontakt a Cenová Ponuka na Sťahovanie | VI&MO Bratislava',
  description: 'Kontaktujte nás pre nezáväznú cenovú ponuku na sťahovanie, vypratávanie alebo upratovanie v Bratislave. Sme tu pre vás telefonicky, emailom alebo cez formulár.',
   openGraph: {
    title: 'Kontakt a Cenová Ponuka na Sťahovanie | VI&MO Bratislava',
    description: 'Kontaktujte nás pre nezáväznú cenovú ponuku na sťahovanie, vypratávanie alebo upratovanie v Bratislave.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
