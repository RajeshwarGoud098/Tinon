import { Edit3, Globe, Clock, Briefcase, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { SKILL_OPTIONS } from "../data/mockData";

export default function ProfileCard() {
  const { profile, profileComplete, setShowProfileForm } = useApp();

  if (!profileComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="text-3xl mb-3 opacity-60">👤</div>
        <h2 className="font-semibold text-[15px] text-text-primary mb-1.5">
          Create Your Profile
        </h2>
        <p className="text-[13px] text-text-secondary mb-5 max-w-[260px] leading-relaxed">
          Build a quick digital profile card — no resume needed.
        </p>
        <button
          id="btn-start-profile"
          onClick={() => setShowProfileForm(true)}
          className="
            px-6 py-3 rounded-xl bg-primary text-white
            font-semibold text-[13px] flex items-center gap-2
            cursor-pointer select-none active:scale-[0.96] transition-transform
            shadow-lg shadow-red-900/15
          "
        >
          <Edit3 size={13} />
          Build Profile
        </button>
      </div>
    );
  }

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-4 max-w-[480px] mx-auto lg:max-w-[560px]">
      <div className="relative bg-surface border border-border rounded-2xl overflow-hidden animate-scale-in">
        {/* Header bar */}
        <div className="h-14 sm:h-[72px] gradient-primary relative">
          <button
            id="btn-edit-profile"
            onClick={() => setShowProfileForm(true)}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/25 transition-colors cursor-pointer active:scale-90"
          >
            <Edit3 size={11} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-7">
          <div className="w-14 h-14 rounded-xl gradient-primary border-[3px] border-surface flex items-center justify-center shadow-lg shadow-black/30">
            <span className="text-base font-bold text-white">
              {initials}
            </span>
          </div>
        </div>

        <div className="px-5 sm:px-8 pt-3 pb-5 text-center">
          <h2 className="font-semibold text-[17px] text-text-primary tracking-[-0.01em]">
            {profile.fullName}
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Age {profile.age} · Student
          </p>

          {/* Languages */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {profile.languages.map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-1 text-[10px] text-text-secondary bg-surface-light rounded-lg px-2.5 py-1 border border-border"
              >
                <Globe size={9} strokeWidth={1.5} />
                {lang}
              </span>
            ))}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              {profile.skills.map((skillId) => {
                const skill = SKILL_OPTIONS.find((s) => s.id === skillId);
                if (!skill) return null;
                return (
                  <span
                    key={skillId}
                    className="flex items-center gap-1 text-[10px] text-emerald-300/90 bg-emerald-500/[0.08] rounded-lg px-2.5 py-1 border border-emerald-500/15"
                  >
                    <span className="text-[11px] leading-none">{skill.emoji}</span>
                    {skill.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Info cards */}
          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-start gap-2.5 bg-surface-light/50 rounded-xl px-3.5 py-2.5 border border-border">
              <Clock size={11} className="text-primary/70 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[9px] text-text-muted uppercase tracking-[0.08em]">
                  Availability
                </p>
                <p className="text-[12px] text-text-primary mt-0.5">
                  {profile.availability}
                </p>
              </div>
            </div>

            {profile.experience && (
              <div className="flex items-start gap-2.5 bg-surface-light/50 rounded-xl px-3.5 py-2.5 border border-border">
                <Briefcase size={11} className="text-primary/70 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[9px] text-text-muted uppercase tracking-[0.08em]">
                    Experience
                  </p>
                  <p className="text-[12px] text-text-primary mt-0.5">
                    {profile.experience}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-primary/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            <span className="font-medium">Active on Tinon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
