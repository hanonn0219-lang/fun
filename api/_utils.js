// api/_utils.js  ← Node/Edge両方で動く純JS
export function toB64(obj) {
  return encodeURIComponent(Buffer.from(JSON.stringify(obj)).toString('base64'));
}
export function fromB64(str) {
  return JSON.parse(Buffer.from(decodeURIComponent(str), 'base64').toString('utf8'));
}
export function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}
