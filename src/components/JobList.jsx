import { useApp } from "../context/AppContext";
import JobCard from "./JobCard";

export default function JobList() {
  const { filteredJobs } = useApp();

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
            <JobCard key={job.id} job={job} index={index} />
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
