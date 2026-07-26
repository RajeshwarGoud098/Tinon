import { useApp } from "../context/AppContext";
import JobCard from "./JobCard";

export default function JobList() {
  const { filteredJobs, jobsLoading, jobsError } = useApp();

  // Loading state
  if (jobsLoading) {
    return (
      <section className="mt-6">
        <div className="flex items-baseline justify-between mb-3.5">
          <h2 className="font-semibold text-[15px] text-text-primary tracking-[-0.01em]">
            Nearby Jobs
          </h2>
          <span className="text-[11px] text-text-muted">Loading...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-surface border border-border rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-surface-light" />
              <div className="p-3.5 space-y-2.5">
                <div className="h-4 bg-surface-light rounded-lg w-3/4" />
                <div className="h-3 bg-surface-light rounded-lg w-1/2" />
                <div className="h-5 bg-surface-light rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (jobsError) {
    return (
      <section className="mt-6">
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="text-2xl mb-2.5 opacity-60">⚠️</div>
          <p className="text-[13px] text-text-secondary font-medium">
            Couldn't load jobs
          </p>
          <p className="text-[11px] text-text-muted mt-1 mb-4">
            {jobsError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-primary text-white text-[12px] font-semibold cursor-pointer active:scale-[0.96] transition-transform"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="font-semibold text-[15px] text-text-primary tracking-[-0.01em]">
          Nearby Jobs
        </h2>
        <span className="text-[11px] text-text-muted tabular-nums">
          {filteredJobs.length} open
        </span>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredJobs.map((job, index) => (
            <JobCard key={job._id || job.id} job={job} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="text-2xl mb-2.5 opacity-60">🔍</div>
          <p className="text-[13px] text-text-secondary font-medium">
            No jobs match your filters
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            Try adjusting your selections
          </p>
        </div>
      )}
    </section>
  );
}

