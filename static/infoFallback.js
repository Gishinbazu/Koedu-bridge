// static/infoFallback.js
export const FALLBACK_PAGES = {
  'admissions-guide:en': {
    title: 'Admissions Guide',
    slug: 'admissions-guide',
    blocks: [
      { type: 'lead', text: 'KOEDU Bridge supports you at every step…' },
      {
        type: 'accordion',
        title: '1) Explore & choose a program',
        items: ['Explore tracks…', 'Compare requirements…', 'Save favorites…'],
      },
      {
        type: 'cta',
        title: 'Ready to start?',
        subtitle: 'Create your account and book a call.',
        primary: { label: 'Find a program', href: '/programs' },
        secondary: { label: 'Contact us', href: '/contact' },
      },
    ],
  },
  'tuition-fees:en': { title: 'Tuition & Scholarships', slug: 'tuition-fees', blocks: [{ type: 'lead', text: 'Overview of study costs and aid.' }] },
  'language-requirements:en': { title: 'Language & Requirements', slug: 'language-requirements', blocks: [{ type: 'lead', text: 'Recommended levels for English/Korean tracks.' }] },
  'faq:en': { title: 'FAQ', slug: 'faq', blocks: [{ type: 'lead', text: 'Common questions & answers.' }] },
};
