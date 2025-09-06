// api/v1/u.js
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
  const url = new URL(req.url);
  const type = url.searchParams.get('t'); // 'csv' or 'pdf'
  const d = url.searchParams.get('d');
  if (!d || !type) return new Response('Missing params', { status: 400 });

  let payload;
  try { payload = b64urlDecode(d); }
  catch { return new Response('Bad token', { status: 400 }); }

  if (type === 'csv') {
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

  if (type === 'pdf') {
    // ここは後でPDF実装。今は未対応。
    return new Response('PDF not implemented', { status: 501 });
  }

  return new Response('Unknown type', { status: 400 });
}
