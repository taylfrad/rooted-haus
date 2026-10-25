import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One YAML file per entry so the Pages CMS panel (.pages.yml) can list, add and edit them.
const yml = (dir: string) => glob({ pattern: '**/*.yml', base: `./src/content/${dir}` });

const services = defineCollection({
  loader: yml('services'),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    blurb: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        price: z.string().optional(), // free text so "from $85" / "by consultation" both work
        duration: z.string().optional(),
        description: z.string().optional(),
      }),
    ),
  }),
});

const deals = defineCollection({
  loader: yml('deals'),
  schema: z.object({
    title: z.string(),
    body: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    ctaLabel: z.string().default('Book now'),
  }),
});

// Markdown: frontmatter holds the details, the body holds the bio paragraphs. File name = page address (team/shelby/).
const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      order: z.number().default(0),
      /** Short line for the team grid, e.g. '12 years behind the chair'. */
      experience: z.string().optional(),
      specialties: z.array(z.string()).default([]),
      quote: z.string().optional(),
      /** Portrait for the team grid and the top of their page. Leave empty to show a placeholder. */
      photo: image().optional(),
      /** Which part of the portrait to keep in the round crop (CSS object-position). Raise or lower the second number to move the crop. */
      photoFocus: z.string().default("50% 15%"),
      /** Second photo shown on their own page. */
      extraPhoto: image().optional(),
    }),
});

const reviews = defineCollection({
  loader: yml('reviews'),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    detail: z.string().optional(),
    /** Team member file name (e.g. ashley) when the review is about a stylist; links the two. */
    stylist: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    featured: z.boolean().default(false),
    /** Shown large on Home; the others sit beside it. Only one should be set. */
    highlight: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: yml('faq'),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

const gallery = defineCollection({
  loader: yml('gallery'),
  schema: ({ image }) =>
    z.object({
      label: z.string(),
      tag: z.string(),
      /** How much room the photo takes in the mosaic: small = 1 cell, wide = 2 across, tall = 2 down, large = 2 x 2. */
      size: z.enum(['small', 'wide', 'tall', 'large']).default('small'),
      /** Path relative to this file, e.g. ../../assets/photos/rituals/img-0142.jpg. Leave empty to show a placeholder. */
      image: image().optional(),
      alt: z.string().optional(),
      order: z.number().default(0),
    }),
});

const experience = defineCollection({
  loader: yml('experience'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      body: z.string(),
      image: image().optional(),
      alt: z.string().optional(),
      order: z.number().default(0),
    }),
});

// --- Page text and photos ---
// One file per page in src/content/pages/ (edited as "Home page", "The Rituals page"... in the panel). Each page is its own
// collection so it gets its own fields; read one with getPage() from lib/pages.ts.
// Photo paths are relative to that folder, e.g. ../../assets/photos/hero/img-0156.jpg.
const onePage = (name: string) => glob({ pattern: `${name}.yml`, base: './src/content/pages' });

/** The page's name and summary in Google results and link previews. */
const seo = z.object({ title: z.string(), description: z.string() });
/** Eyebrow, script accent and title, as SectionHeading shows them. */
const heading = { eyebrow: z.string().optional(), script: z.string().optional(), title: z.string() };
/** A photo, what it shows (for people who cannot see it), and which part to keep when cropped (CSS object-position). */
const photo = (image: SchemaContext['image']) => ({ image: image().optional(), alt: z.string().default(''), focus: z.string().optional() });
/** The colored band at the top of every inner page (PageHeader). */
const pageHeader = (image: SchemaContext['image']) =>
  z.object({ ...heading, eyebrow: z.string(), intro: z.string().optional(), ...photo(image) });
const step = z.object({ title: z.string(), text: z.string(), button: z.string() });

const homePage = defineCollection({
  loader: onePage('home'),
  schema: ({ image }) =>
    z.object({
      seo,
      hero: z.object({
        eyebrow: z.string(),
        title: z.string(),
        ritualsButton: z.string(),
        /** The first slide is the one that loads first; `side` is where the text sits (away from faces). */
        slides: z
          .array(z.object({ ...photo(image), image: image(), phrase: z.string(), side: z.enum(['left', 'right']).default('left') }))
          .min(1),
      }),
      steps: z.object({ ...heading, meet: step, rituals: step, book: step }),
      specialties: z.object({
        ...heading,
        items: z.array(z.object({ label: z.string(), ...photo(image) })),
        card: z.object({ script: z.string().optional(), title: z.string(), text: z.string().optional() }),
      }),
      experience: z.object({ ...heading, text: z.string(), button: z.string(), ...photo(image) }),
      reviews: z.object(heading),
      work: z.object({ ...heading, button: z.string() }),
      hiring: z.object({ ...heading, badge: z.string().optional(), text: z.string().optional(), button: z.string() }),
    }),
});

const ritualsPage = defineCollection({
  loader: onePage('rituals'),
  schema: ({ image }) => z.object({ seo, header: pageHeader(image), photos: z.array(z.object(photo(image))).default([]) }),
});

const teamPage = defineCollection({
  loader: onePage('team'),
  schema: ({ image }) => z.object({ seo, header: pageHeader(image), mission: z.object({ label: z.string().optional(), text: z.string() }) }),
});

const experiencePage = defineCollection({
  loader: onePage('experience'),
  schema: ({ image }) => z.object({ seo, header: pageHeader(image), closing: z.object({ script: z.string().optional(), text: z.string() }) }),
});

const galleryPage = defineCollection({
  loader: onePage('gallery'),
  schema: ({ image }) => z.object({ seo, header: pageHeader(image) }),
});

const textBlock = z.object({ title: z.string(), text: z.string().optional() });
const connectPage = defineCollection({
  loader: onePage('connect'),
  schema: ({ image }) => z.object({ seo, header: pageHeader(image), message: textBlock, newsletter: textBlock }),
});

const careersPage = defineCollection({
  loader: onePage('careers'),
  schema: ({ image }) =>
    z.object({
      seo,
      header: pageHeader(image),
      badge: z.string().optional(),
      intro: z.string(),
      offer: z.string().optional(),
      photo: z.object(photo(image)),
      perksTitle: z.string(),
      perks: z.array(z.string()).default([]),
      commissionTitle: z.string(),
      commission: z.array(z.string()).default([]),
      boothRentalTitle: z.string(),
      boothRentalPrice: z.string().optional(),
      boothRental: z.array(z.string()).default([]),
      hourlyTitle: z.string(),
      hourlyPrice: z.string().optional(),
      /** Also listed as choices in the application form's "I'm interested in" menu. */
      hourlyRoles: z.array(z.string()).default([]),
      quotesTitle: z.string(),
      stylistQuotes: z.array(z.object({ quote: z.string(), name: z.string() })).default([]),
      apply: textBlock,
    }),
});

export const collections = {
  services, deals, team, reviews, faq, gallery, experience,
  homePage, ritualsPage, teamPage, experiencePage, galleryPage, connectPage, careersPage,
};
