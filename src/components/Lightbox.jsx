import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const AUTOSLIDE_MS = 4000;

/**
 * Lightbox — full-screen image carousel with auto-slide.
 *
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   images: string[]         (URLs or data URLs)
 *   startIndex?: number      (which image to show first; defaults to 0)
 *   title?: string           (optional caption shown above image)
 */
export default function Lightbox({ open, onClose, images, startIndex = 0, title }) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const hoverRef = useRef(false);

  // Sync index when startIndex changes (e.g., user clicks a different thumb)
  useEffect(() => {
    if (open) setIndex(Math.min(startIndex, Math.max(0, images.length - 1)));
  }, [open, startIndex, images.length]);

  // Auto-slide loop
  useEffect(() => {
    if (!open || paused || images.length < 2) return;
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setIndex((i) => (i + 1) % images.length);
      }
    }, AUTOSLIDE_MS);
    return () => clearInterval(id);
  }, [open, paused, images.length]);

  // Keyboard nav + lock body scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Touch swipe
  const touch = useRef({ x: 0, t: 0 });
  const onTouchStart = (e) =>
    (touch.current = { x: e.touches[0].clientX, t: Date.now() });
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dt = Date.now() - touch.current.t;
    if (Math.abs(dx) > 40 && dt < 600) (dx < 0 ? next : prev)();
  };

  if (!open || !images || images.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-brand-950/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 inset-x-0 flex items-center justify-between p-4 sm:p-6 text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-sm sm:text-base font-semibold truncate max-w-md">
              {title}
            </div>
          )}
          <div className="text-xs text-white/60 mt-0.5">
            {index + 1} / {images.length}
            {paused ? ' · Paused' : ''}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {images.length > 1 && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="relative w-full flex-1 flex items-center justify-center px-4 sm:px-12 py-20"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide container — translateX based on index */}
        <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Slide ${i + 1}`}
              draggable={false}
              className={`absolute max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-500 ${
                i === index
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 inset-x-0 p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 overflow-x-auto justify-center scrollbar-on-dark">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden transition-all ${
                  i === index
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-brand-950 scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>

          {/* Progress bar (auto-slide indicator) */}
          {!paused && images.length > 1 && (
            <div className="mt-3 mx-auto max-w-xs h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                key={`${index}-${paused}`}
                className="h-full bg-accent"
                style={{
                  animation: `lb-progress ${AUTOSLIDE_MS}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes lb-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
