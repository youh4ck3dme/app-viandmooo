# SEO Chyby a Problémy - VI&MO Projekt

## 🔴 KRITICKÉ CHYBY (Musia byť opravené okamžite)

### 1. Chýbajúce OG obrázky
- **Problém**: V `layout.tsx` sa odkazuje na `/og-image.jpg`, ale súbor neexistuje
- **Lokalita**: `src/app/layout.tsx:33, 49`
- **Dopad**: Open Graph zdieľanie na sociálnych sieťach nebude fungovať správne
- **Riešenie**: Vytvoriť obrázok `public/og-image.jpg` s rozmermi 1200x630px

### 2. Chýbajúce logo pre structured data
- **Problém**: V `layout.tsx` sa odkazuje na `/viandmo_logo.png`, ale súbor neexistuje
- **Lokalita**: `src/app/layout.tsx:64`
- **Dopad**: Structured data pre organizáciu nebude validná
- **Riešenie**: Vytvoriť logo `public/viandmo_logo.png` (min. 112x112px)

### 3. Homepage nemá metadata
- **Problém**: Homepage (`src/app/(marketing)/page.tsx`) je client component bez metadata
- **Lokalita**: `src/app/(marketing)/page.tsx`
- **Dopad**: Homepage používa len default metadata z root layoutu, chýbajú špecifické SEO údaje
- **Riešenie**: Vytvoriť `src/app/(marketing)/layout.tsx` alebo `page.tsx` s metadata exportom

### 4. Chýbajúce canonical URLs na niektorých stránkach
- **Problém**: 
  - `/about` - chýba canonical
  - `/contact` - chýba canonical
  - `/blog` - chýba canonical (client component)
  - `/privacy-policy` - chýba canonical
  - `/blog/kategoria/[category]` - canonical bez siteUrl (relatívna cesta)
  - `/blog/tag/[tag]` - canonical bez siteUrl (relatívna cesta)
- **Lokalita**: Rôzne stránky
- **Dopad**: Duplicitný obsah, zhoršené SEO
- **Riešenie**: Pridať `alternates.canonical` s absolútnou URL na všetky stránky

### 5. Neúplné OpenGraph metadata
- **Problém**: 
  - `/about` - chýba `url` a `images` v OpenGraph
  - `/contact` - chýba `url` a `images` v OpenGraph
  - `/blog` - chýba metadata úplne (client component)
  - `/privacy-policy` - chýba OpenGraph úplne
  - `/blog/kategoria/[category]` - chýba OpenGraph
  - `/blog/tag/[tag]` - chýba OpenGraph
- **Lokalita**: Rôzne stránky
- **Dopad**: Zlé zdieľanie na sociálnych sieťach
- **Riešenie**: Doplniť kompletnú OpenGraph štruktúru na všetky stránky

## 🟠 VÁŽNE PROBLÉMY (Mali by byť opravené čo najskôr)

### 6. Structured data v `other` metadata (nesprávny formát)
- **Problém**: Structured data je vložená cez `other: { 'viandmo-schema': ... }`, čo nie je štandardný spôsob
- **Lokalita**: `src/app/layout.tsx:55-99`
- **Dopad**: Vyhľadávače môžu structured data nerozpoznať správne
- **Riešenie**: Presunúť do `<script type="application/ld+json">` v layout komponente

### 7. Chýbajúce `dateModified` v blog článkoch
- **Problém**: Blog články majú len `datePublished`, chýba `dateModified`
- **Lokalita**: `src/app/blog/[slug]/page.tsx:118-138`
- **Dopad**: Vyhľadávače nevedia, kedy bol článok naposledy aktualizovaný
- **Riešenie**: Pridať `dateModified` do BlogPosting structured data

### 8. Chýbajúce `author` structured data v blog článkoch
- **Problém**: Author je len string, nie Person structured data
- **Lokalita**: `src/app/blog/[slug]/page.tsx:124-128`
- **Dopad**: Menej detailné structured data
- **Riešenie**: Zmeniť author na Person alebo Organization structured data

### 9. Chýbajúce Twitter metadata na niektorých stránkach
- **Problém**: Twitter card metadata chýba na:
  - `/about`
  - `/contact`
  - `/blog`
  - `/privacy-policy`
  - `/stahovanie-klavirov`
  - `/vypratavanie-a-likvidacia`
  - `/blog/kategoria/[category]`
  - `/blog/tag/[tag]`
- **Lokalita**: Rôzne stránky
- **Dopad**: Zlé zdieľanie na Twitter/X
- **Riešenie**: Pridať `twitter` metadata na všetky stránky

### 10. Nekonzistentné použitie `siteUrl`
- **Problém**: 
  - `layout.tsx` používa `process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'`
  - `robots.ts` používa `process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com'`
  - `sitemap.ts` používa `process.env.NEXT_PUBLIC_SITE_URL || 'https://app.viandmo.com'`
  - `blog/[slug]/page.tsx` používa `process.env.NEXT_PUBLIC_SITE_URL || 'https://www.viandmo.com'`
- **Lokalita**: Rôzne súbory
- **Dopad**: Nekonzistentné URL v rôznych častiach
- **Riešenie**: Vytvoriť konštantu `SITE_URL` a použiť ju všade

### 11. Chýbajúce `keywords` meta tag (voliteľné, ale odporúčané)
- **Problém**: Žiadna stránka nemá keywords meta tag
- **Lokalita**: Všetky stránky
- **Dopad**: Menej relevantné pre staršie vyhľadávače (Google už to ignoruje, ale niektoré ešte používajú)
- **Riešenie**: Pridať keywords na hlavné stránky (voliteľné)

## 🟡 STREDNE VÁŽNE PROBLÉMY

### 12. Chýbajúce `robots` meta tagy
- **Problém**: Niektoré stránky môžu potrebovať špecifické robots direktívy
- **Lokalita**: Všetky stránky
- **Dopad**: Vyhľadávače nemusia vedieť, ako indexovať určité stránky
- **Riešenie**: Pridať `robots` metadata tam, kde je potrebné (napr. noindex pre testovacie stránky)

### 13. Chýbajúce `article:author` a `article:published_time` na blog stránkach
- **Problém**: Blog listing stránka (`/blog`) nemá article metadata
- **Lokalita**: `src/app/blog/page.tsx`
- **Dopad**: Menej detailné structured data pre blog sekciu
- **Riešenie**: Pridať article metadata (ak je to relevantné)

### 14. Chýbajúce `alternates.languages` (hreflang)
- **Problém**: Projekt je len v slovenčine, ale chýba explicitné označenie jazyka
- **Lokalita**: Všetky stránky
- **Dopad**: Ak sa v budúcnosti pridá viac jazykov, bude to komplikovanejšie
- **Riešenie**: Pridať `alternates.languages` s `sk` na všetky stránky

### 15. Chýbajúce `category` v blog článkoch structured data
- **Problém**: BlogPosting structured data nemá category
- **Lokalita**: `src/app/blog/[slug]/page.tsx:118-138`
- **Dopad**: Menej detailné structured data
- **Riešenie**: Pridať `articleSection` s kategóriou

### 16. Chýbajúce `mainEntityOfPage` v structured data
- **Problém**: Niektoré structured data nemajú mainEntityOfPage
- **Lokalita**: Rôzne stránky
- **Dopad**: Menej jasné prepojenie medzi structured data a stránkou
- **Riešenie**: Pridať mainEntityOfPage tam, kde je relevantné

## 🔵 OPTIMALIZÁCIE (Zlepšia SEO, ale nie sú kritické)

### 17. Chýbajúce `image:secure_url` v OpenGraph
- **Problém**: OpenGraph images nemajú secure_url
- **Lokalita**: Všetky stránky s OpenGraph
- **Dopad**: HTTPS obrázky sú odporúčané
- **Riešenie**: Pridať secure_url pre obrázky

### 18. Chýbajúce `image:type` v OpenGraph
- **Problém**: OpenGraph images nemajú type
- **Lokalita**: Všetky stránky s OpenGraph
- **Dopad**: Menej detailné metadata
- **Riešenie**: Pridať type: "image/jpeg" alebo "image/png"

### 19. Chýbajúce `article:tag` v blog článkoch
- **Problém**: Blog články nemajú article:tag v OpenGraph
- **Lokalita**: `src/app/blog/[slug]/page.tsx`
- **Dopad**: Menej detailné metadata pre blog
- **Riešenie**: Pridať article:tag pre každý tag

### 20. Chýbajúce `breadcrumb` structured data na niektorých stránkach
- **Problém**: Breadcrumbs structured data je len v blog komponente
- **Lokalita**: Ostatné stránky
- **Dopad**: Menej detailné structured data
- **Riešenie**: Pridať breadcrumbs structured data na všetky stránky s navigáciou

### 21. Chýbajúce `sameAs` v Organization structured data
- **Problém**: Organization structured data má len základné sameAs
- **Lokalita**: `src/app/layout.tsx:55-99`
- **Dopad**: Menej prepojení so sociálnymi sieťami
- **Riešenie**: Pridať všetky sociálne siete (Facebook, Instagram, WhatsApp)

### 22. Chýbajúce `aggregateRating` pre služby
- **Problém**: Stránky so službami nemajú aggregateRating structured data
- **Lokalita**: Service stránky
- **Dopad**: Chýbajú hviezdičky v Google vyhľadávaní
- **Riešenie**: Pridať aggregateRating structured data (ak sú dostupné recenzie)

### 23. Chýbajúce `offers` structured data pre služby
- **Problém**: Service stránky nemajú offers structured data
- **Lokalita**: Service stránky
- **Dopad**: Chýbajú ceny v Google vyhľadávaní
- **Riešenie**: Pridať offers structured data s cenovým rozsahom

### 24. Chýbajúce `FAQPage` structured data na niektorých stránkach
- **Problém**: Len `/stahovanie-bytov-bratislava` má FAQ structured data
- **Lokalita**: Ostatné service stránky
- **Dopad**: Chýbajú FAQ v Google vyhľadávaní
- **Riešenie**: Pridať FAQ structured data na všetky service stránky, kde sú FAQ

### 25. Chýbajúce `LocalBusiness` structured data
- **Problém**: Projekt má len MovingCompany, ale chýba LocalBusiness
- **Lokalita**: `src/app/layout.tsx`
- **Dopad**: Menej detailné structured data pre lokálnu firmu
- **Riešenie**: Pridať LocalBusiness structured data alebo rozšíriť MovingCompany

## 📊 PERFORMANCE A TECHNICKÉ SEO

### 26. Chýbajúce `loading="lazy"` na niektorých obrázkoch
- **Problém**: Nie všetky obrázky majú lazy loading
- **Lokalita**: Rôzne komponenty
- **Dopad**: Horšia performance
- **Riešenie**: Pridať lazy loading na obrázky, ktoré nie sú above the fold

### 27. Chýbajúce `width` a `height` na niektorých obrázkoch
- **Problém**: Next.js Image komponent má fill, ale niektoré obrázky by mali mať explicitné rozmery
- **Lokalita**: Rôzne komponenty
- **Dopad**: Layout shift (CLS)
- **Riešenie**: Pridať explicitné rozmery tam, kde je to možné

### 28. Chýbajúce `preconnect` pre externé domény
- **Problém**: Chýbajú preconnect linky pre Google Fonts, sociálne siete
- **Lokalita**: `src/app/layout.tsx`
- **Dopad**: Pomalšie načítanie externých zdrojov
- **Riešenie**: Pridať preconnect linky v head

### 29. Chýbajúce `dns-prefetch` pre externé domény
- **Problém**: Chýbajú dns-prefetch linky
- **Lokalita**: `src/app/layout.tsx`
- **Dopad**: Pomalšie načítanie externých zdrojov
- **Riešenie**: Pridať dns-prefetch linky

### 30. Chýbajúce `theme-color` meta tag na niektorých stránkach
- **Problém**: Theme color je len v root layoutu
- **Lokalita**: Všetky stránky
- **Dopad**: Menej konzistentný vzhľad na mobile zariadeniach
- **Riešenie**: Overiť, že theme-color je správne dedený

## 🔍 ACCESSIBILITY A SEMANTIC HTML

### 31. Chýbajúce `lang` atribúty na niektorých elementoch
- **Problém**: HTML má lang="sk", ale niektoré časti môžu potrebovať iný jazyk
- **Lokalita**: Všetky stránky
- **Dopad**: Horšia accessibility
- **Riešenie**: Overiť, že všetky časti majú správny jazyk

### 32. Chýbajúce `aria-label` na niektorých interaktívnych elementoch
- **Problém**: Niektoré tlačidlá a linky nemajú aria-label
- **Lokalita**: Rôzne komponenty
- **Dopad**: Horšia accessibility pre screen readery
- **Riešenie**: Pridať aria-label tam, kde je potrebné

## 📝 PRIORITIZÁCIA OPRAV

### Vysoká priorita (opraviť okamžite):
1. ✅ Vytvoriť `/og-image.jpg` (1200x630px)
2. ✅ Vytvoriť `/viandmo_logo.png` (min. 112x112px)
3. ✅ Pridať metadata na homepage
4. ✅ Pridať canonical URLs na všetky stránky
5. ✅ Doplniť OpenGraph metadata na všetky stránky
6. ✅ Presunúť structured data z `other` do `<script type="application/ld+json">`

### Stredná priorita (opraviť tento týždeň):
7. ✅ Opraviť nekonzistentné `siteUrl` použitie
8. ✅ Doplniť Twitter metadata na všetky stránky
9. ✅ Pridať `dateModified` do blog článkov
10. ✅ Rozšíriť structured data (author, category, atď.)

### Nízka priorita (opraviť v rámci mesiaca):
11. ✅ Pridať hreflang tagy
12. ✅ Pridať aggregateRating structured data
13. ✅ Pridať offers structured data
14. ✅ Optimalizovať performance (lazy loading, preconnect, atď.)

## 📋 CHECKLIST PRE REFAKTORING

- [ ] Vytvoriť konštantu `SITE_URL` v shared súbore
- [ ] Vytvoriť helper funkciu pre generovanie metadata
- [ ] Vytvoriť helper funkciu pre generovanie structured data
- [ ] Vytvoriť typy pre metadata
- [ ] Vytvoriť komponent pre structured data injection
- [ ] Vytvoriť dokumentáciu pre SEO best practices v projekte
- [ ] Nastaviť automatické testy pre SEO (ak je to možné)
- [ ] Vytvoriť SEO audit script

## 🔗 ODKAZY NA DOKUMENTÁCIU

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central](https://developers.google.com/search)

