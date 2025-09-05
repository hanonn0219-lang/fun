// api/v1/flashcards.js
import { toB64 } from '../_utils.js';
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  // APIキーチェック（Vercel の Project → Settings → Environment Variables に設定）
  const key = req.headers.get('x-api-key') || '';
  const expected = process.env.LEARNINGOPS_API_KEY || '';
  if (!expected || key !== expected) return new Response('Unauthorized', { status: 401 });

  let body;
  try { body = await req.json(); } catch { return new Response('Invalid JSON', { status: 400 }); }
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return new Response('No items', { status: 400 });
  if (items.length > 12) return new Response('Max 12 items', { status: 400 });

  const token = toB64({ items, ts: Date.now() });
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;

  const csvUrl = `${base}/api/v1/files.csv?d=${token}`;
  const pdfUrl = `${base}/api/v1/files.pdf?d=${token}`; // ← PDFは次のNode関数が生成

  return new Response(JSON.stringify({ csv_url: csvUrl, pdf_url: pdfUrl }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
