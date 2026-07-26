import { MapPin, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobCard({ job, index = 0 }) {
  const { openJobDetail } = useApp();

  return (
    <button
      id={`job-card-${job._id || job.id}`}
      onClick={() => openJobDetail(job)}
      className="job-card animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Body */}
      <div className="job-card__header">
        <span className="job-card__emoji">{job.emoji}</span>
        {/* Hiring Now Badge */}
        {job.immediate && (
          <span className="job-card__badge">
            HIRING NOW
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="job-card__body">
        {/* Job Title */}
        <h3 className="job-card__title">{job.type}</h3>

        {/* Business Name with accent border */}
        <div className="job-card__business">
          <span className="job-card__business-text">{job.business}</span>
        </div>

        {/* Pay */}
        <div className="job-card__pay">{job.pay}</div>

        {/* Meta row */}
        <div className="job-card__meta">
          <div className="job-card__meta-item">
            <MapPin size={11} strokeWidth={1.8} />
            <span>{job.distance}</span>
          </div>
          <div className="job-card__meta-item">
            <Clock size={11} strokeWidth={1.8} />
            <span>{job.timings}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="job-card__tags">
          {job.weekend && (
            <span className="job-card__tag">📅 Weekends</span>
          )}
          {job.shift === "evening" && (
            <span className="job-card__tag">🌙 Evening</span>
          )}
        </div>
      </div>
    </button>
  );
}
