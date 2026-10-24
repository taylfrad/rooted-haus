import { defineCollection } from 'astro:content';
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
      shape: z.enum(['arch', 'circle', 'rounded', 'soft']).default('arch'),
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

export const collections = { services, deals, team, reviews, faq, gallery, experience };
