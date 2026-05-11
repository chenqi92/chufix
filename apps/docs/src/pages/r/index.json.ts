import type { APIRoute } from 'astro';
import { blocks } from '~/blocks/registry';

export const GET: APIRoute = () => {
  const body = JSON.stringify(
    {
      version: 1,
      blocks: blocks.map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        framework: 'vue+react',
        files: b.files.map((f) => ({ name: f.name, lang: f.lang })),
      })),
    },
    null,
    2,
  );
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
