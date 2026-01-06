export interface Author {
  id: string;
  name: string;
  slug: string;
  email?: string;
  url?: string;
  bio: string;
  avatar?: string;
  role: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export const authors: Author[] = [
  {
    id: 'miroslav-danihel',
    name: 'Miroslav Danihel',
    slug: 'miroslav-danihel',
    email: 'miroslav@viandmo.com',
    bio: 'Zakladateľ a majiteľ VI&MO s viac ako 7 ročnými skúsenosťami v oblasti sťahovacích služieb. Špecializuje sa na profesionálne sťahovanie bytov, firiem a ťažkých bremien v Bratislave a okolí.',
    role: 'Zakladateľ',
    socialLinks: {
      facebook: 'https://www.facebook.com/p/VI-MO-stahovanie-upratovanie-100063524682338/',
      instagram: 'https://www.instagram.com/viamoservice/',
    },
  },
  {
    id: 'viamo-team',
    name: 'Tím VI&MO',
    slug: 'viamo-team',
    bio: 'Profesionálny tím VI&MO s bohatými skúsenosťami v oblasti sťahovacích služieb. Naša práca je založená na dôvere, profesionalite a individuálnom prístupe ku každému zákazníkovi.',
    role: 'Tím',
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(a => a.slug === slug);
}

export function getAuthorById(id: string): Author | undefined {
  return authors.find(a => a.id === id);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find(a => a.name === name || a.slug === name.toLowerCase().replace(/\s+/g, '-'));
}

