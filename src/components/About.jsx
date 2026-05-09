import { Rocket, Target, HeartHandshake, Trophy } from 'lucide-react';

const stats = [
  { label: 'Proyek Diselesaikan', value: '50+' },
  { label: 'Klien Aktif', value: '20+' },
  { label: 'Stack Teknologi', value: '15+' },
  { label: 'Tahun Pengalaman', value: '5+' },
];

const values = [
  {
    icon: Rocket,
    title: 'Teknologi Modern',
    desc: 'Stack terkini — React, Next.js, Tailwind, Node, Python AI/ML, Web3 — disesuaikan dengan kebutuhan proyek.',
  },
  {
    icon: Target,
    title: 'Tepat Sasaran',
    desc: 'Fokus pada masalah yang Anda hadapi: kami diskusi dulu sebelum membangun, bukan sebaliknya.',
  },
  {
    icon: HeartHandshake,
    title: 'Kolaboratif',
    desc: 'Komunikasi rutin lewat WhatsApp, demo berkala, dan dokumentasi yang dibuat untuk dimengerti.',
  },
  {
    icon: Trophy,
    title: 'Kualitas Profesional',
    desc: 'Code review, testing, dan handover yang rapi — bukan sekadar “jalan” tapi benar-benar sustainable.',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-gradient-to-br from-brand-950 to-brand-900 text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-app relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
              About
            </span>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Kami membangun produk digital yang
              <span className="block bg-gradient-to-r from-accent via-orange-300 to-amber-200 bg-clip-text text-transparent">
                bermakna dan tahan lama.
              </span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed">
              TP Tech Productions adalah studio produk digital independen yang
              berfokus pada pengembangan website, aplikasi web & mobile, sistem
              berbasis AI, serta solusi visual seperti video animasi dan desain
              grafis. Kami percaya teknologi bekerja paling baik ketika ia tidak
              terlihat — diam-diam membuat hidup penggunanya lebih mudah.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4"
                >
                  <div className="text-2xl md:text-3xl font-extrabold text-white">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:bg-white/10 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                  <v.icon size={20} />
                </div>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
