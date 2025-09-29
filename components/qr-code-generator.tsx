import React, { useEffect, useRef, useState } from 'react';

// QRCodeGenerator.jsx
// React component that generates a QR Code with a custom alphanumeric key format.
// Format: VEND-FITG-1234567890
// VEND = Vendor ID, FITG = Fitting type, 1234567890 = serial number.

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (window.bwipjs) return resolve(window.bwipjs);
    const existing = Array.from(document.getElementsByTagName('script')).find(s => s.src && s.src.includes(src));
    if (existing) {
      existing.addEventListener('load', () => resolve(window.bwipjs));
      existing.addEventListener('error', () => reject(new Error('Failed to load bwip-js')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.bwipjs);
    s.onerror = () => reject(new Error('Failed to load bwip-js'));
    document.head.appendChild(s);
  });
}

export default function QRCodeGenerator({ cdn = 'https://unpkg.com/bwip-js/dist/bwip-js-min.js' }) {
  const canvasRef = useRef(null);
  const [vendor, setVendor] = useState('VEND');
  const [fitting, setFitting] = useState('FITG');
  const [serial, setSerial] = useState('1234567890');
  const [scale, setScale] = useState(4);
  const [padding, setPadding] = useState(10);
  const [errorCorrection, setErrorCorrection] = useState('M'); // L, M, Q, H
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Compose the alphanumeric key
  const qrKey = `${vendor}-${fitting}-${serial}`;

  useEffect(() => {
    let mounted = true;
    setBusy(true);
    loadScriptOnce(cdn)
      .then(() => {
        if (mounted) setLoaded(true);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setError('Failed to load barcode library. Check internet or CDN.');
      })
      .finally(() => mounted && setBusy(false));
    return () => { mounted = false; };
  }, [cdn]);

  useEffect(() => {
    if (!window.bwipjs || !canvasRef.current) return;
    try {
      setError('');
      const opts = {
        bcid: 'qrcode',
        text: qrKey,
        scale: Number(scale) || 4,
        padding: Number(padding) || 10,
        eclevel: errorCorrection,
      };

      window.bwipjs.toCanvas(canvasRef.current, opts);
    } catch (e) {
      console.error(e);
      setError(String(e));
    }
  }, [qrKey, scale, padding, errorCorrection, loaded]);

  function downloadPNG() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${qrKey}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-surface rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">QR Code Generator</h2>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-sm">Vendor ID</label>
          <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full p-1 rounded border" />
        </div>
        <div>
          <label className="block text-sm">Fitting Type</label>
          <input type="text" value={fitting} onChange={e => setFitting(e.target.value)} className="w-full p-1 rounded border" />
        </div>
        <div>
          <label className="block text-sm">Serial Number</label>
          <input type="text" value={serial} onChange={e => setSerial(e.target.value)} className="w-full p-1 rounded border" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-sm">Scale</label>
          <input type="number" min="1" value={scale} onChange={e => setScale(e.target.value)} className="w-full p-1 rounded border" />
        </div>
        <div>
          <label className="block text-sm">Padding (px)</label>
          <input type="number" min="0" value={padding} onChange={e => setPadding(e.target.value)} className="w-full p-1 rounded border" />
        </div>
        <div>
          <label className="block text-sm">Error Correction</label>
          <select value={errorCorrection} onChange={e => setErrorCorrection(e.target.value)} className="w-full p-1 rounded border">
            <option value="L">L (Low)</option>
            <option value="M">M (Medium)</option>
            <option value="Q">Q (Quartile)</option>
            <option value="H">H (High)</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <button onClick={downloadPNG} className="px-4 py-2 rounded shadow mr-2 bg-primary text-white" disabled={!loaded}>Download PNG</button>
      </div>

      <div className="border p-3 inline-block">
        {busy && <div className="mb-2">Loading library...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-3 text-xs text-muted">
        <strong>Generated Key:</strong> {qrKey}
      </div>
    </div>
  );
}
