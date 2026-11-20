# AKSFPSA

Website for the All Kerala Self Financing Private Schools Association (AKSFPSA). Built with SvelteKit, Tailwind CSS, and TypeScript.

## Home Page Scan

The home page is assembled in `src/routes/+page.svelte` and renders the following sections in order:

- Hero: `src/lib/components/sections/Hero.svelte`
- Stats: `src/lib/components/sections/Stats.svelte`
- Gallery (highlights carousel): `src/lib/components/sections/Gallery.svelte`
- Vision 2047: `src/lib/components/sections/Vision2047.svelte`
- Membership Benefits: `src/lib/components/sections/MembershipBenefit.svelte`
- Membership Plans: `src/lib/components/sections/MembershipPlans.svelte`
- Courses: `src/lib/components/sections/Courses.svelte`
- Teacher Initiatives CTA: `src/lib/components/sections/TeacherInitiativesCTA.svelte`
- Pre-School Project (Montville) CTA: `src/lib/components/sections/MontvillePreSchoolCTA.svelte`
- Partnerships (logo marquee + modal): `src/lib/components/sections/Partnership.svelte`
- Legal Service CTA: `src/lib/components/sections/LegalServiceCTA.svelte`
- Leadership: `src/lib/components/sections/Leadership.svelte`
- Circulars: `src/lib/components/sections/Circulars.svelte`
- CTA: `src/lib/components/sections/CTA.svelte`

## Key Content Notes

- Stats use animated counters for Students, Courses, Certified Teachers, and Awards.
- Gallery shows three highlighted albums with touch swipe support and pagination dots.
- Membership plans list Lifetime and Associate options with pricing and benefits.
- Partnerships includes a draggable, auto-scrolling logo track and a modal with partner details.
- Circulars link to PDF documents in `/documents` and show dates from late 2025 and early 2026.

## Routes

Primary routes under `src/routes` include:

- `/` Home
- `/about`
- `/contact`
- `/membership`
- `/membership/apply`
- `/courses` and `/courses/[slug]`
- `/events` and `/events/[slug]`
- `/gallery` and `/gallery/[slug]`
- `/leadership`
- `/circulars`
- `/members`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` Start dev server
- `npm run build` Production build
- `npm run preview` Preview production build
- `npm run check` Type checking
- `npm run lint` Prettier + ESLint
- `npm run format` Auto-format
