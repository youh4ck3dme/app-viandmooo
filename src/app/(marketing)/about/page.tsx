
import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'O nás - Náš príbeh a filozofia | VI&MO Sťahovanie Bratislava',
  description: 'Spoznajte tím a príbeh VI&MO. Viac ako 7 rokov skúseností so sťahovaním v Bratislave. Zistite viac o našich hodnotách, férovom prístupe a spoľahlivosti.',
  openGraph: {
    title: 'O nás - Náš príbeh a filozofia | VI&MO Sťahovanie Bratislava',
    description: 'Spoznajte tím a príbeh VI&MO. Viac ako 7 rokov skúseností so sťahovaním v Bratislave.',
    url: '/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
