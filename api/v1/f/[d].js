// api/v1/f/[d].js
export const config = { runtime: 'edge' };

// base64url → JSON
function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const json = Buffer.from(s, 'base64').toString('utf8');
  return JSON.parse(json);
}

function toCsv(items) {
  const rows = [['English', 'Japanese']];
  for (const it of items) rows.push([it.english || '', it.japanese || '']);
  return rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
}

export default async function handler(req) {
  // /api/v1/f/<d> の <d> を取り出す
  const url = new URL(req.url);
  const segs = url.pathname.split('/');
  const d = segs[segs.length - 1];

  if (!d) return new Response('Missing token', { status: 400 });

  let payload;
  try { payload = b64urlDecode(d); } catch { return new Response('Bad token', { status: 400 }); }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) return new Response('No items', { status: 400 });

  const csv = toCsv(items);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="flashcards.csv"'
    }
  });
}
