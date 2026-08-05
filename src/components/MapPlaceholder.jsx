import { useApp } from "../context/AppContext";

export default function MapPlaceholder() {
  const { filteredJobs, openJobDetail } = useApp();

  return (
    <div className="relative w-full h-40 sm:h-52 lg:h-60 rounded-xl overflow-hidden map-gradient border border-border surface-texture">
      {/* Organic road-like lines instead of rigid grid */}
      <div className="absolute inset-0 map-grid opacity-60" />
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M0,65% Q25%,60% 50%,50% T100%,45%"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30%,0 Q35%,30% 40%,50% T45%,100%"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Job pins */}
      {filteredJobs.slice(0, 6).map((job, i) => (
        <button
          key={job.id}
          onClick={() => openJobDetail(job)}
          className={`
            absolute cursor-pointer pin-shadow
            transition-all duration-300 hover:scale-110 active:scale-90
            ${i % 2 === 0 ? "animate-float" : "animate-float-delayed"}
          `}
          style={{ top: job.pinPosition.top, left: job.pinPosition.left }}
          title={job.business}
        >
          <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2A1A1A] border border-white/20 flex items-center justify-center text-sm sm:text-base shadow-lg shadow-black/50">
              {job.emoji}
            </div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-px shadow-sm shadow-primary/80" />
          </div>
        </button>
      ))}

      {/* Jobs count badge */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-black/80 rounded-lg px-2.5 py-1 border border-white/15 backdrop-blur-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] text-stone-200 font-medium">
          {filteredJobs.length} nearby
        </span>
      </div>

      {/* Center dot — you are here */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full bg-primary/20 border border-primary/30" />
      </div>
    </div>
  );
}
