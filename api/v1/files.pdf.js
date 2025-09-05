// api/v1/files.pdf.js  ← これでOK
export const config = { runtime: 'nodejs' };

import PDFDocument from 'pdfkit';
import { fromB64 } from '../_utils.js';

export default async function handler(req, res) {
  const d = req.query?.d || new URL(req.url, `http://${req.headers.host}`).searchParams.get('d');
  if (!d) { res.status(400).send('Missing d'); return; }

  let payload;
  try { payload = fromB64(d); } catch { res.status(400).send('Bad token'); return; }
  const items = Array.isArray(payload.items) ? payload.items : [];

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="flashcards.pdf"');
  res.setHeader('Cache-Control', 'no-store');

  const doc = new PDFDocument({ size: 'A4', margin: 36 });
  doc.pipe(res);

  const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pageH = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
  const cols = 3, rows = 3, cellW = pageW / cols, cellH = pageH / rows;

  let idx = 0;
  for (let i = 0; i < items.length; i++) {
    const col = idx % cols, row = Math.floor(idx / cols);
    if (row >= rows) { doc.addPage(); idx = 0; }
    const x = doc.page.margins.left + (idx % cols) * cellW;
    const y = doc.page.margins.top + Math.floor(idx / cols) * cellH;

    const en = String(items[i].english || '');
    const ja = String(items[i].japanese || '');
    const ipa = items[i].ipa ? String(items[i].ipa) : '';
    const ex  = items[i].example ? String(items[i].example) : '';

    doc.rect(x + 6, y + 6, cellW - 12, cellH - 12).stroke();
    doc.fontSize(16).text(en,  x + 16, y + 18, { width: cellW - 32 });
    if (ipa) doc.fontSize(10).fillColor('#555').text(ipa, x + 16, y + 40, { width: cellW - 32 });
    doc.fontSize(12).fillColor('#000').text(ja, x + 16, y + 60, { width: cellW - 32 });
    if (ex)  doc.fontSize(10).fillColor('#333').text('ex: ' + ex, x + 16, y + 80, { width: cellW - 32 });

    idx++;
  }
  doc.end();
}
