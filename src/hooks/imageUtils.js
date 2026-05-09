/**
 * Compress and downscale an image File to a JPEG/PNG data URL.
 * Keeps the result small enough to fit in localStorage even with
 * many images per project.
 */
export async function compressImageFile(file, opts = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = opts;

  // Read file → load as <img>
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  const ratio = Math.min(1, maxWidth / img.width, maxHeight / img.height);
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  // PNG keeps transparency; JPG is much smaller for photos.
  const isPng = file.type === 'image/png';
  const out = canvas.toDataURL(isPng ? 'image/png' : mimeType, quality);
  return out;
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Rough byte length of a data URL (after base64 decode). */
export function approxBytes(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return 0;
  const base64 = dataUrl.split(',')[1] || '';
  return Math.floor((base64.length * 3) / 4);
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
