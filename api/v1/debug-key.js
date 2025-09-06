// api/v1/debug-key.js
export const config = { runtime: 'edge' };
export default async function handler() {
  const has = !!process.env.LEARNINGOPS_API_KEY;
  return new Response(JSON.stringify({ hasKey: has, env: 'production' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
