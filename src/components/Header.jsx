import { MapPin } from "lucide-react";
import { Home, ClipboardList, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import FilterPills from "./FilterPills";
import SearchBar from "./SearchBar";

export default function Header() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex items-center justify-between h-[52px] lg:h-14">
          {/* Brand + location */}
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold tracking-[-0.03em] text-text-primary">
              tinon
            </span>
            <div className="h-3.5 w-px bg-white/8 hidden sm:block" />
            <div className="flex items-center gap-1 text-text-muted text-[11px]">
              <MapPin size={10} className="text-primary/70" />
              <span className="font-medium">Adilabad</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {[
              { id: "home", label: "Explore", Icon: Home },
              { id: "applications", label: "Applied", Icon: ClipboardList },
              { id: "profile", label: "Profile", Icon: User },
            ].map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    flex items-center gap-2 px-3.5 py-[7px] rounded-lg text-[13px] font-medium
                    transition-all duration-200 cursor-pointer select-none
                    ${isActive
                      ? "text-primary bg-primary/[0.08]"
                      : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
                    }
                  `}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="lg:hidden" />
        </div>

        {/* Search (home tab only) */}
        {activeTab === "home" && (
          <div className="pb-2.5">
            <SearchBar />
          </div>
        )}

        {/* Filter pills */}
        <div className="pb-2">
          <FilterPills />
        </div>
      </div>
    </header>
  );
}
