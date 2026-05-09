import { MapPin, Mail, Globe, Phone, Instagram, Linkedin, Github, Youtube, ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';

const socialLinks = [
  { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram', color: 'hover:text-rose-500' },
  { icon: Linkedin, href: siteConfig.social.linkedin, label: 'LinkedIn', color: 'hover:text-sky-600' },
  { icon: Github, href: siteConfig.social.github, label: 'GitHub', color: 'hover:text-brand-950' },
  { icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube', color: 'hover:text-red-600' },
];

export default function Contact() {
  const waLink = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;
  const mapsSrc = `https://maps.google.com/maps?q=${siteConfig.address.mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-app">
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
            Contact
          </span>
          <h2 className="section-title mt-2">Hubungi Kami</h2>
          <p className="section-subtitle mx-auto text-center">
            Kami terbuka untuk berkolaborasi, berdiskusi pengembangan proyek,
            atau peluang profesional di Jakarta dan seluruh Indonesia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left card — contact details */}
          <div className="card-base p-7 sm:p-8">
            <h3 className="text-2xl font-bold text-brand-950">
              {siteConfig.brand.name}
            </h3>
            <div className="mt-2 mb-6 h-px w-full bg-gradient-to-r from-accent via-brand-200 to-transparent" />

            <div className="space-y-5">
              <ContactItem icon={MapPin} label="Address">
                <p className="text-brand-950 font-semibold leading-relaxed">
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </p>
              </ContactItem>

              <ContactItem icon={Phone} label="Phone / WhatsApp">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-950 font-semibold hover:text-accent transition"
                >
                  +{formatPhone(siteConfig.whatsappNumber)} (WhatsApp)
                </a>
              </ContactItem>

              <ContactItem icon={Mail} label="Email Us">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-brand-950 font-semibold hover:text-accent transition"
                >
                  {siteConfig.email}
                </a>
              </ContactItem>

              <ContactItem icon={Globe} label="Sosial Media">
                <div className="flex gap-2">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center transition-all hover:bg-white hover:shadow-md hover:-translate-y-0.5 ${color}`}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </ContactItem>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7 w-full sm:w-auto"
            >
              Mulai Diskusi via WhatsApp
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Right card — map + CTA */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-950">
                Let's discuss the project
              </h3>
              <p className="mt-2 text-brand-700">
                Datang langsung ke Tempat kami atau hubungi tim untuk
                penjadwalan meeting offline maupun online.
              </p>
            </div>
            <div className="card-base overflow-hidden flex-1 min-h-[320px]">
              <iframe
                title="Map"
                src={mapsSrc}
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-brand-500 uppercase tracking-wider">
          {label}
        </div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

function formatPhone(num) {
  // simple readable grouping for E.164 numbers (no leading +)
  const s = String(num);
  if (s.length < 8) return s;
  return s.replace(/(\d{2})(\d{3,4})(\d{3,4})(\d+)/, '$1 $2-$3-$4');
}
