import { useState } from "react";
import { X, User, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { languageOptions } from "../data/mockData";
import SkillSelector from "./SkillSelector";

export default function ProfileForm() {
  const { profile, saveProfile, showProfileForm, setShowProfileForm } = useApp();
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    age: profile.age || "",
    languages: profile.languages || [],
    skills: profile.skills || [],
    availability: profile.availability || "",
    experience: profile.experience || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleLanguage = (lang) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleSkill = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.age || formData.age < 16 || formData.age > 35)
      newErrors.age = "Enter age between 16-35";
    if (formData.languages.length === 0)
      newErrors.languages = "Select at least one";
    if (!formData.availability.trim())
      newErrors.availability = "Required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    saveProfile(formData);
  };

  if (!showProfileForm) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowProfileForm(false)}
      />

      <div className="relative w-full max-w-[480px] max-h-[90vh] bg-background rounded-t-2xl border-t border-x border-border overflow-hidden animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-[3px] rounded-full bg-black/10" />
        </div>

        {/* Close */}
        <button
          id="profile-form-close"
          onClick={() => setShowProfileForm(false)}
          className="absolute top-3.5 right-4 w-7 h-7 rounded-lg bg-surface-light flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer active:scale-90"
        >
          <X size={13} />
        </button>

        <div className="px-5 pb-6 overflow-y-auto max-h-[calc(90vh-3rem)]">
          {/* Header */}
          <div className="flex items-center gap-3 mt-1 mb-5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <User size={15} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[15px] text-text-primary tracking-[-0.01em]">
                Build Your Profile
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                No resume needed — just the basics
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Full Name
              </label>
              <input
                id="input-fullname"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="e.g., Ramesh Kumar"
                className={`w-full bg-surface border ${
                  errors.fullName ? "border-red-400/60" : "border-border"
                } rounded-xl px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/35`}
              />
              {errors.fullName && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Age
              </label>
              <input
                id="input-age"
                type="number"
                min="16"
                max="35"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="e.g., 20"
                className={`w-full bg-surface border ${
                  errors.age ? "border-red-400/60" : "border-border"
                } rounded-xl px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/35`}
              />
              {errors.age && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.age}</p>
              )}
            </div>

            {/* Languages */}
            <div>
              <label className="block text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Languages
              </label>
              <div className="flex flex-wrap gap-1.5">
                {languageOptions.map((lang) => {
                  const selected = formData.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`
                        px-3 py-[6px] rounded-lg text-[11px] font-medium
                        transition-all duration-200 cursor-pointer active:scale-[0.94]
                        ${selected
                          ? "bg-primary text-white shadow-sm shadow-orange-900/20"
                          : "bg-surface text-text-secondary border border-border hover:border-orange-300"
                        }
                      `}
                    >
                      {selected ? "✓ " : ""}
                      {lang}
                    </button>
                  );
                })}
              </div>
              {errors.languages && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.languages}</p>
              )}
            </div>

            {/* Skills */}
            <SkillSelector
              selectedSkills={formData.skills}
              onToggle={toggleSkill}
            />

            {/* Availability */}
            <div>
              <label className="block text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Availability
              </label>
              <input
                id="input-availability"
                type="text"
                value={formData.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                placeholder="e.g., Evenings & Weekends"
                className={`w-full bg-surface border ${
                  errors.availability ? "border-red-400/60" : "border-border"
                } rounded-xl px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/35`}
              />
              {errors.availability && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.availability}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-[10px] font-medium text-text-muted uppercase tracking-[0.08em] mb-1.5">
                Past Experience
                <span className="normal-case text-text-muted/40 tracking-normal ml-1.5">(Optional)</span>
              </label>
              <textarea
                id="input-experience"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g., Helped at uncle's shop during summer"
                rows={3}
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/35 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              id="btn-generate-profile"
              type="submit"
              className="
                w-full py-3 rounded-xl bg-primary text-white
                font-semibold text-[13px] flex items-center justify-center gap-2
                cursor-pointer select-none active:scale-[0.97] transition-transform mt-2
                shadow-lg shadow-orange-900/15
              "
            >
              <Sparkles size={13} />
              Generate Profile Card
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
