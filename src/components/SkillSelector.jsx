import { Check, Zap } from "lucide-react";
import { SKILL_OPTIONS } from "../data/mockData";

export default function SkillSelector({ selectedSkills = [], onToggle }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-2">
        <Zap size={10} className="text-primary/60" />
        Your Skills
      </label>

      <div className="grid grid-cols-2 gap-1.5">
        {SKILL_OPTIONS.map((skill) => {
          const isSelected = selectedSkills.includes(skill.id);
          return (
            <button
              key={skill.id}
              id={`skill-${skill.id}`}
              type="button"
              onClick={() => onToggle(skill.id)}
              className={`
                group relative flex items-center gap-2 px-3 py-2.5 rounded-xl
                text-left transition-all duration-250 cursor-pointer select-none
                active:scale-[0.96]
                ${isSelected
                  ? "skill-pill-active"
                  : "skill-pill-inactive"
                }
              `}
            >
              {/* Checkmark badge */}
              <span
                className={`
                  flex items-center justify-center w-4 h-4 rounded-md shrink-0
                  transition-all duration-250
                  ${isSelected
                    ? "bg-white/20 text-white scale-100"
                    : "bg-black/[0.04] border border-black/[0.08] text-transparent scale-90"
                  }
                `}
              >
                <Check size={10} strokeWidth={3} />
              </span>

              {/* Label */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] leading-none">{skill.emoji}</span>
                  <span
                    className={`
                      text-[11px] font-medium leading-tight truncate
                      transition-colors duration-250
                      ${isSelected ? "text-white" : "text-text-secondary"}
                    `}
                  >
                    {skill.label}
                  </span>
                </div>
                {skill.sub && (
                  <span
                    className={`
                      text-[9px] mt-0.5 block pl-[22px]
                      transition-colors duration-250
                      ${isSelected ? "text-white/60" : "text-text-muted"}
                    `}
                  >
                    {skill.sub}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedSkills.length > 0 && (
        <p className="text-[10px] text-primary/60 mt-2 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-primary/50 animate-pulse" />
          {selectedSkills.length} skill{selectedSkills.length > 1 ? "s" : ""} selected
          — matching jobs will highlight
        </p>
      )}
    </div>
  );
}
