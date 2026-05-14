import { GraduationCap, Briefcase } from 'lucide-react';
import { teamMembers } from '../data/siteConfig.js';

export default function Team() {
  return (
    <section id="team" className="section-padding bg-brand-50 relative overflow-hidden">
      <div className="container-app relative">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-accent font-semibold uppercase tracking-widest text-xs">
            Team
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-brand-950 tracking-tight">
            Behind the Tech Productions
          </h2>
          <p className="mt-4 text-brand-600 leading-relaxed text-base md:text-lg">
            Kami menggabungkan keahlian teknis dan kreativitas desain untuk
            membangun produk digital yang bernilai tinggi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-100 hover:shadow-md transition">
              <div className="flex items-center gap-5 mb-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-brand-50"
                />
                <div>
                  <h3 className="text-xl font-bold text-brand-950">{member.name}</h3>
                  <p className="text-accent font-medium text-sm mt-0.5">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-0.5">Pendidikan</div>
                    <p className="text-sm font-medium text-brand-800">{member.education}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-0.5">Pengalaman</div>
                    <p className="text-sm text-brand-600 leading-relaxed">{member.experience}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}