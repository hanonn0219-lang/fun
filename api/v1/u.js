// api/v1/u.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const type = url.searchParams.get('t'); // 'csv' or 'pdf'
  const d = url.searchParams.get('d');

  if (!d || !type) {
    return new Response('Missing params', { status: 400 });
  }

  const origin = url.origin;
  const target =
    type === 'csv'
      ? `${origin}/api/v1/files.csv?d=${d}`
      : `${origin}/api/v1/files.pdf?d=${d}`;

  return new Response(null, {
    status: 302,
    headers: { Location: target }
  });
}
