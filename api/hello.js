export const config = { runtime: 'edge' };

export default async function handler(req) {
  return new Response('hello from vercel (edge)');
}
