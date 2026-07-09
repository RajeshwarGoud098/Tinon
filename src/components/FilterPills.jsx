import { useApp } from "../context/AppContext";
import { Sparkles } from "lucide-react";

const filters = [
  { id: "evening", label: "Evening", icon: "🌙" },
  { id: "weekend", label: "Weekend", icon: "📅" },
  { id: "immediate", label: "Immediate", icon: "⚡" },
];

export default function FilterPills() {
  const {
    activeFilters,
    toggleFilter,
    skillMatchActive,
    toggleSkillMatch,
    skillMatchTooltip,
    setSkillMatchTooltip,
    setActiveTab,
  } = useApp();

  return (
    <div className="relative flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
      {/* ── Matches My Skills pill ─────────────────── */}
      <div className="relative shrink-0">
        <button
          id="filter-skill-match"
          onClick={toggleSkillMatch}
          className={`
            flex items-center gap-1.5 px-3 py-[6px] rounded-lg text-[11px] font-medium
            whitespace-nowrap transition-all duration-250 cursor-pointer select-none
            active:scale-[0.96]
            ${skillMatchActive
              ? "skill-match-pill-active"
              : "pill-inactive"
            }
          `}
        >
          <span className="text-[12px] leading-none">🎯</span>
          Matches My Skills
          {skillMatchActive && (
            <Sparkles size={10} className="text-white/70 ml-0.5" />
          )}
        </button>

        {/* Tooltip when no skills selected */}
        {skillMatchTooltip && (
          <div
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              w-[220px] px-3 py-2.5 rounded-xl
              bg-surface-elevated border border-border-light
              shadow-xl shadow-black/40
              animate-slide-up-tooltip z-[100]
            "
          >
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-elevated border-r border-b border-border-light" />
            <p className="text-[11px] text-text-secondary leading-relaxed text-center relative z-10">
              Select your skills in the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSkillMatchTooltip(false);
                  setActiveTab("profile");
                }}
                className="text-emerald-400 font-semibold underline underline-offset-2 cursor-pointer hover:text-emerald-300 transition-colors"
              >
                Profile tab
              </button>{" "}
              to see tailored jobs.
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5 my-auto bg-white/[0.06] shrink-0" />

      {/* ── Standard filters ──────────────────────── */}
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            id={`filter-${filter.id}`}
            onClick={() => toggleFilter(filter.id)}
            className={`
              flex items-center gap-1.5 px-3 py-[6px] rounded-lg text-[11px] font-medium
              whitespace-nowrap transition-all duration-200 cursor-pointer select-none
              ${isActive ? "pill-active" : "pill-inactive"}
              active:scale-[0.96]
            `}
          >
            <span className="text-[12px] leading-none">{filter.icon}</span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

