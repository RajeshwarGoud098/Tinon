import { Home, ClipboardList, User } from "lucide-react";
import { useApp } from "../context/AppContext";

const tabs = [
  { id: "home", label: "Explore", Icon: Home },
  { id: "applications", label: "Applied", Icon: ClipboardList },
  { id: "profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => setActiveTab(id)}
              className={`
                flex flex-col items-center gap-[2px] px-4 py-1.5 rounded-lg
                transition-all duration-200 cursor-pointer select-none relative
                ${isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
                }
                active:scale-90
              `}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-5 h-[2px] rounded-full bg-primary/60" />
              )}
              <Icon
                size={19}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-all duration-200"
              />
              <span className={`text-[9px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
