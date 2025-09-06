import { b64urlDecode } from '../../_utils.js';
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const token = req.url.split('/').pop(); // URLの末尾をトークンとして読む
  let payload;
  try {
    payload = b64urlDecode(token);
  } catch {
    return new Response('Bad token', { status: 400 });
  }

  const items = payload.items || [];
  if (!items.length) {
    return new Response('No data', { status: 400 });
  }

  const header = `"English","Japanese"\n`;
  const rows = items.map(it => `"${it.english}","${it.japanese}"`).join('\n');
  const csv = header + rows;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="flashcards.csv"'
    }
  });
}
