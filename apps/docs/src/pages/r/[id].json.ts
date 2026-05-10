import type { APIRoute, GetStaticPaths } from 'astro';
import { blocks } from '~/blocks/registry';

export const getStaticPaths: GetStaticPaths = () =>
  blocks.map((b) => ({ params: { id: b.id }, props: { block: b } }));

export const GET: APIRoute = ({ props }) => {
  const block = (props as any).block as (typeof blocks)[number] | undefined;
  if (!block) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  const body = JSON.stringify(
    {
      version: 1,
      id: block.id,
      name: block.name,
      category: block.category,
      description: block.description,
      framework: 'vue+react',
      files: block.files.map((f) => ({
        name: f.name,
        lang: f.lang,
        content: f.content,
      })),
    },
    null,
    2,
  );
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
