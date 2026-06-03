import { useEffect, useRef, useState } from 'react';
import { GraduationCap, BriefcaseBusiness } from 'lucide-react';
import { teamMembers } from '../data/siteConfig.js';

const CARD_ENTRY_OFFSET = 160;
const CARD_PROGRESS_START = 0.92;
const CARD_PROGRESS_END = 0.18;
const HEADER_PROGRESS_START = 0.52;
const HEADER_PROGRESS_END = 0.12;
const HEADER_Y_OFFSET = 88;

export default function Team() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState({
    header: 0,
    cards: 0,
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    let frameId = 0;

    const updateScrollProgress = () => {
      frameId = 0;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      const cardsStart = viewportHeight * CARD_PROGRESS_START;
      const cardsEnd = viewportHeight * CARD_PROGRESS_END;
      const headerStart = viewportHeight * HEADER_PROGRESS_START;
      const headerEnd = viewportHeight * HEADER_PROGRESS_END;

      const nextCards = clamp((cardsStart - rect.top) / (cardsStart - cardsEnd));
      const nextHeader = clamp(
        (headerStart - rect.top) / (headerStart - headerEnd)
      );

      setScrollProgress((prev) => {
        if (prev.cards === nextCards && prev.header === nextHeader) return prev;
        return { cards: nextCards, header: nextHeader };
      });
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#f7f9fb]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />

      <div className="container-app relative">
        <div
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16 motion-reduce:transform-none"
          style={{
            opacity: scrollProgress.header,
            transform: `translate3d(0, ${(1 - scrollProgress.header) * HEADER_Y_OFFSET}px, 0)`,
          }}
        >
          <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
            Team
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-brand-950 tracking-tight">
            Behind the Tech Productions
          </h2>
          <p className="mt-4 text-brand-600 leading-relaxed text-base md:text-lg">
            Kami hadir dengan satu tujuan: memadukan keahlian teknis dan visi inovatif untuk membangun solusi digital untuk mempermudah laju bisnis Anda.
          </p>
        </div>

        <div className="mx-auto grid max-w-[56rem] gap-14 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="motion-reduce:transform-none"
              style={{
                transform: `translate3d(${
                  (index % 2 === 0 ? -1 : 1) *
                  (1 - scrollProgress.cards) *
                  CARD_ENTRY_OFFSET
                }%, 0, 0)`,
              }}
            >
              <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <h3
                      className="text-3xl font-extrabold tracking-[-0.03em] text-white md:text-4xl"
                      style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                    >
                      {member.name}
                    </h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 md:text-sm">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 bg-slate-50/70 p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                      <GraduationCap size={20} strokeWidth={2.1} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Pendidikan
                      </p>
                      <p className="mt-1 text-base leading-7 text-slate-900">
                        {member.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                      <BriefcaseBusiness size={20} strokeWidth={2.1} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Pengalaman
                      </p>
                      <p className="mt-1 text-base leading-7 text-slate-900">
                        {member.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
