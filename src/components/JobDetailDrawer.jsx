import { useEffect, useState } from "react";
import { X, MapPin, Clock, Gift, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobDetailDrawer() {
  const { selectedJob, drawerOpen, closeJobDetail, applyToJob } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [drawerOpen]);

  if (!isVisible || !selectedJob) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeJobDetail}
      />

      {/* Sheet */}
      <div
        className={`
          relative w-full max-w-[480px] max-h-[90vh] bg-background rounded-t-2xl
          border-t border-x border-border overflow-hidden
          transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isAnimating ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-[3px] rounded-full bg-black/10" />
        </div>

        {/* Close */}
        <button
          id="drawer-close"
          onClick={closeJobDetail}
          className="absolute top-3.5 right-4 w-7 h-7 rounded-lg bg-surface-light flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer active:scale-90"
        >
          <X size={13} />
        </button>

        {/* Content */}
        <div className="px-5 pb-28 overflow-y-auto max-h-[calc(90vh-3rem)]">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-xl bg-surface-light border border-border flex items-center justify-center text-2xl">
              {selectedJob.emoji}
            </div>
            <div>
              <h2 className="font-semibold text-[17px] text-text-primary leading-tight tracking-[-0.01em]">
                {selectedJob.business}
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                {selectedJob.type}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-surface rounded-lg px-3 py-2 border border-border text-[12px] text-text-secondary">
              <MapPin size={12} strokeWidth={1.5} />
              {selectedJob.distance}
            </div>
            <div className="flex items-center gap-1.5 bg-surface rounded-lg px-3 py-2 border border-border text-[12px] text-text-secondary">
              <Clock size={12} strokeWidth={1.5} />
              {selectedJob.timings}
            </div>
            <div className="bg-primary/[0.08] rounded-lg px-3 py-2 text-[12px] font-semibold text-primary">
              {selectedJob.pay}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <h3 className="text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Location
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {selectedJob.address}
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                About this role
              </h3>
              <p className="text-[13px] text-text-secondary leading-[1.65]">
                {selectedJob.description}
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-2 flex items-center gap-1.5">
                <Gift size={10} strokeWidth={1.5} />
                Perks
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.perks.map((perk) => (
                  <span
                    key={perk}
                    className="text-[11px] text-text-secondary bg-surface rounded-lg px-2.5 py-1 border border-border"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] glass border-t border-border">
          <button
            id="apply-whatsapp"
            onClick={() => applyToJob(selectedJob)}
            className="
              w-full py-3 rounded-xl gradient-whatsapp
              text-white font-semibold text-[13px]
              flex items-center justify-center gap-2
              cursor-pointer select-none
              active:scale-[0.97] transition-transform duration-150
              shadow-lg shadow-green-900/20
            "
          >
            <MessageCircle size={15} />
            Apply via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
