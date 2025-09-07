// api/v1/f/[token].js
import { b64urlDecode, csvEscape } from '../../_utils.js';
export const config = { runtime: 'edge' };

export default async function handler(req) {
  // URLからtokenだけを安全に取り出す
  const url = new URL(req.url);
  const token = url.pathname.split('/').pop();

  let payload;
  try {
    payload = b64urlDecode(token);
  } catch {
    return new Response(JSON.stringify({ error: 'Bad token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (!items.length) {
    return new Response(JSON.stringify({ error: 'No data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // CSV作成
  const rows = [['English', 'Japanese'], ...items.map(i => [i.english, i.japanese])];
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="flashcards.csv"'
    }
  });
}
