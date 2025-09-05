export function b64urlEncode(obj) {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = ''; for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return encodeURIComponent(b64);
}
export function b64urlDecode(str) {
  const b64 = decodeURIComponent(str).replace(/-/g,'+').replace(/_/g,'/');
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const bin = atob(b64 + pad);
  const bytes = new Uint8Array([...bin].map(c => c.charCodeAt(0)));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}
export function csvEscape(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}
