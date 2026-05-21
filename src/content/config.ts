import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Required
    title: z.string(),
    description: z.string().max(160, 'Meta description must be under 160 chars for SEO'),
    publishDate: z.date(),
    targetKeyword: z.string(),

    // Optional
    lastUpdated: z.date().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),

    // Taxonomy
    cluster: z.enum([
      'A. Tax Code Decoder',
      'B. Take-Home by Role',
      'C. Take-Home by Hourly Rate',
      'D. Shift Patterns',
      'E. Seasonal & Timely',
      'F. Freelance & Commission',
    ]),
    persona: z.array(z.enum([
      'Shift Worker',
      'NHS',
      'Freelancer',
      'Sales Commission',
      'General PAYE',
      'Hospitality',
      'Retail',
      'Warehouse',
    ])).default([]),

    // SEO / discovery
    secondaryKeywords: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]), // slugs of related blog posts

    // FAQ schema (optional — boosts rich-result eligibility)
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { blog };
