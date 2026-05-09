import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks, siteConfig } from '../data/siteConfig.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      // Active section based on viewport mid-line.
      const mid = window.innerHeight / 2;
      let current = 'home';
      for (const { id } of navLinks) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          current = id;
          break;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-lg shadow-md border-b border-brand-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-app flex items-center justify-between h-16 md:h-20">
        <a
          href="#home"
          onClick={(e) => handleClick(e, 'home')}
          className="flex items-center gap-2.5 group"
        >
          <img
            src="/logo-tp.png"
            alt={`${siteConfig.brand.name} logo`}
            className="h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow"
          />
          <span
            className={`hidden sm:block font-bold text-lg tracking-tight transition-colors ${
              scrolled ? 'text-brand-950' : 'text-white drop-shadow'
            }`}
          >
            {siteConfig.brand.name}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                scrolled
                  ? active === id
                    ? 'text-accent'
                    : 'text-brand-800 hover:text-accent'
                  : active === id
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {label}
              {active === id && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 w-6 rounded-full ${
                    scrolled ? 'bg-accent' : 'bg-white'
                  }`}
                />
              )}
            </a>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className={`md:hidden p-2 rounded-lg transition ${
            scrolled
              ? 'text-brand-800 hover:bg-brand-100'
              : 'text-white hover:bg-white/10'
          }`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96' : 'max-h-0'
        } bg-white border-t border-brand-100`}
      >
        <nav className="container-app py-4 flex flex-col gap-1">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                active === id
                  ? 'bg-accent/10 text-accent'
                  : 'text-brand-800 hover:bg-brand-50'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
