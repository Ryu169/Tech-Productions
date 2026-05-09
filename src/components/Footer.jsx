import { Heart } from 'lucide-react';
import { siteConfig, navLinks } from '../data/siteConfig.js';
import { asset } from '../hooks/asset.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-950 text-white/70">
      <div className="container-app py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src={asset('logo-tp.png')}
            alt={`${siteConfig.brand.name} logo`}
            className="h-9 w-auto object-contain"
          />
          <span className="font-bold text-white">{siteConfig.brand.name}</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {navLinks.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="hover:text-white transition">
              {label}
            </a>
          ))}
        </nav>

        <div className="text-xs flex items-center gap-1.5">
          © {year} {siteConfig.brand.name}. Built with
          <Heart size={12} className="text-accent fill-accent" />
          in Indonesia.
        </div>
      </div>
    </footer>
  );
}
