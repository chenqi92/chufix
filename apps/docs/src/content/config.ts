import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Use the marketing splash layout instead of the docs three-column layout. */
    splash: z.boolean().optional(),
    /** Keep source in the repo without publishing it as a public docs page. */
    internal: z.boolean().optional(),
    /** Order in sidebar groups (lower = earlier). Optional metadata. */
    order: z.number().optional(),
  }),
});

export const collections = { docs };
