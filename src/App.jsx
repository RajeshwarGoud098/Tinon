import { useApp } from "./context/AppContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import MapPlaceholder from "./components/MapPlaceholder";
import JobList from "./components/JobList";
import JobDetailDrawer from "./components/JobDetailDrawer";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";
import ApplicationsList from "./components/ApplicationsList";

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Header */}
      <Header />

      {/* Scrollable content */}
      <main className="pt-[140px] lg:pt-[148px] pb-[68px] lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        {activeTab === "home" && (
          <div className="animate-fade-in">
            <MapPlaceholder />
            <JobList />
          </div>
        )}

        {activeTab === "applications" && (
          <div className="animate-fade-in">
            <ApplicationsList />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="animate-fade-in">
            <ProfileCard />
          </div>
        )}
      </main>

      {/* Bottom nav (mobile only) */}
      <BottomNav />

      {/* Overlays */}
      <JobDetailDrawer />
      <ProfileForm />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
