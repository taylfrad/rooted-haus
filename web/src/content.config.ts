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

const team = defineCollection({
  loader: yml('team'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().default(0),
    bio: z.string(),
    specialties: z.array(z.string()).default([]),
  }),
});

const reviews = defineCollection({
  loader: yml('reviews'),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    detail: z.string().default('Google review'),
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
  schema: z.object({
    label: z.string(),
    tag: z.string(),
    shape: z.enum(['arch', 'circle', 'rounded', 'soft']).default('arch'),
    order: z.number().default(0),
  }),
});

export const collections = { services, deals, team, reviews, faq, gallery };
