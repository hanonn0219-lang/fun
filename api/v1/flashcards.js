// api/v1/flashcards.js
import { b64urlEncode } from '../_utils.js';
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS });

  const key = req.headers.get('x-api-key') || '';
  const expected = process.env.LEARNINGOPS_API_KEY || 'meb-12345'; // 応急処置OK
  if (!expected || key !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  let body; try { body = await req.json(); } catch { return new Response('Invalid JSON', { status: 400, headers: CORS }); }
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return new Response('No items', { status: 400, headers: CORS });
  if (items.length > 12) return new Response('Max 12 items', { status: 400, headers: CORS });

  const token = b64urlEncode({ items, ts: Date.now() });
  const origin = new URL(req.url).origin;

  // ★ 直リンクで返す（/u をやめる）
  const csvUrl = `${origin}/api/v1/files.csv?d=${token}`;
  const pdfUrl = null;

  return new Response(JSON.stringify({ csv_url: csvUrl, pdf_url: pdfUrl }), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
}
