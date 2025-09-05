import { b64urlEncode } from '../_utils.js';
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  // Only POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }

  // API key check
  const key = req.headers.get('x-api-key') || '';
  const expected = process.env.LEARNINGOPS_API_KEY || '';
  if (!expected || key !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS }
    });
  }

  // Read body
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return new Response('No items', { status: 400, headers: CORS });
  if (items.length > 12) return new Response('Max 12 items', { status: 400, headers: CORS });

  // Token & URLs
  const token = b64urlEncode({ items, ts: Date.now() });
  const origin = new URL(req.url).origin;

  // ★ 短い中継リンクを返す（/api/v1/u で 302 リダイレクト）
  const csvUrl = `${origin}/api/v1/u?t=csv&d=${token}`;
  const pdfUrl = null; // PDF 追加時は `${origin}/api/v1/u?t=pdf&d=${token}` に変更

  // Response
  return new Response(JSON.stringify({ csv_url: csvUrl, pdf_url: pdfUrl }), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
}
