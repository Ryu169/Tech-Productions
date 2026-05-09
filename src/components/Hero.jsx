import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';

const services = [
  'Undangan Digital',
  'Website',
  'Aplikasi Mobile',
  'Sistem Kasir (POS)',
  'Instalasi Jaringan Mikrotik',
  'Jasa Tugas IT',
  'Jasa Rakit PC & Instalasi',
];

export default function Hero() {
  const waLink = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <section
      id="home"
      className="hero-bg relative min-h-screen flex items-center justify-center text-white overflow-hidden"
    >
      {/* Decorative orb (bottom-right only — top-left orange removed) */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-app relative z-10 py-32 md:py-40 text-center">
        <p
          className="mx-auto mt-40 md:mt-56 max-w-3xl text-base sm:text-lg md:text-xl text-white/85 leading-relaxed animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          Menyediakan layanan pembuatan{' '}
          <span className="text-white font-semibold">Undangan Digital</span>,{' '}
          <span className="text-white font-semibold">Website</span>,{' '}
          <span className="text-white font-semibold">Aplikasi Mobile</span>,{' '}
          <span className="text-white font-semibold">Sistem Kasir (POS)</span>,{' '}
          <span className="text-white font-semibold">Instalasi Jaringan Mikrotik</span>,{' '}
          <span className="text-white font-semibold">Jasa Tugas IT</span>,{' '}
          <span className="text-white font-semibold">Jasa Rakit PC & Instalasi</span>
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01ZM12.05 20.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.13-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.43-.14-.01-.31-.01-.47-.01s-.43.06-.66.31c-.23.25-.86.84-.86 2.06 0 1.21.88 2.38 1 2.55.12.16 1.73 2.65 4.2 3.71.59.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3Z" />
            </svg>
            Hubungi Kami
            <ArrowRight size={18} />
          </a>
          <a href="#catalog" className="btn-secondary text-base">
            Lihat Layanan
          </a>
        </div>

        {/* Service marquee chips */}
        <div
          className="mt-14 flex flex-wrap justify-center gap-2 animate-fade-in"
          style={{ animationDelay: '360ms' }}
        >
          {services.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs sm:text-sm text-white/85"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs flex flex-col items-center gap-2 animate-float">
        <span className="uppercase tracking-widest">Scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
