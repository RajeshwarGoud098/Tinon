import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

const statusConfig = {
  applied: {
    label: "Applied",
    color: "text-status-applied",
    bg: "bg-status-applied/10",
    border: "border-status-applied/15",
    dot: "bg-status-applied",
    className: "",
  },
  reviewed: {
    label: "Reviewed",
    color: "text-status-reviewed",
    bg: "bg-status-reviewed/10",
    border: "border-status-reviewed/15",
    dot: "bg-status-reviewed",
    className: "",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "text-status-shortlisted",
    bg: "bg-status-shortlisted/10",
    border: "border-status-shortlisted/15",
    dot: "bg-status-shortlisted",
    className: "status-shortlisted",
  },
};

export default function ApplicationsList() {
  const { applications, setActiveTab } = useApp();

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="text-3xl mb-3 opacity-60">📋</div>
        <h2 className="font-semibold text-[15px] text-text-primary mb-1.5">
          No Applications Yet
        </h2>
        <p className="text-[13px] text-text-secondary mb-5 max-w-[260px] leading-relaxed">
          Browse nearby jobs and apply instantly via WhatsApp.
        </p>
        <button
          id="btn-browse-jobs"
          onClick={() => setActiveTab("home")}
          className="
            px-5 py-2.5 rounded-xl bg-primary text-white
            font-semibold text-[13px] flex items-center gap-2
            cursor-pointer select-none active:scale-[0.96] transition-transform
            shadow-lg shadow-orange-900/15
          "
        >
          Browse Jobs
          <ArrowRight size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="font-semibold text-[15px] text-text-primary tracking-[-0.01em]">
          My Applications
        </h2>
        <span className="text-[11px] text-text-muted tabular-nums">
          {applications.length} total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {applications.map((app, index) => {
          const status = statusConfig[app.status];
          return (
            <div
              key={app.id}
              className="bg-surface border border-border rounded-xl p-3.5 animate-fade-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-surface-light flex items-center justify-center text-lg shrink-0">
                  {app.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[13px] text-text-primary leading-snug truncate">
                    {app.business}
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {app.role} · {formatDate(app.appliedDate)}
                  </p>
                </div>

                <div
                  className={`
                    shrink-0 flex items-center gap-1.5 rounded-lg px-2 py-1 border
                    ${status.bg} ${status.border} ${status.className}
                  `}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                      app.status === "shortlisted" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className={`text-[9px] font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
