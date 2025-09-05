// api/v1/files.csv.js
import { fromB64, csvEscape } from '../_utils.js';
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const d = url.searchParams.get('d');
  if (!d) return new Response('Missing d', { status: 400 });

  let payload;
  try { payload = fromB64(d); } catch { return new Response('Bad token', { status: 400 }); }
  const items = Array.isArray(payload.items) ? payload.items : [];

  const header = ['english','japanese','ipa','example'];
  const lines = [header.join(',')];
  for (const it of items) {
    lines.push([
      csvEscape(it.english || ''),
      csvEscape(it.japanese || ''),
      csvEscape(it.ipa || ''),
      csvEscape(it.example || '')
    ].join(','));
  }
  const csv = lines.join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="flashcards.csv"',
      'Cache-Control': 'no-store'
    }
  });
}
