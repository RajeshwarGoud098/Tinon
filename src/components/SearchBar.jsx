import { Search, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div
      id="search-bar"
      className="search-bar flex items-center gap-2.5 bg-surface/60 border border-border rounded-[10px] px-3 py-2"
    >
      <Search
        size={15}
        className={`shrink-0 transition-colors duration-200 ${
          searchQuery ? "text-primary/80" : "text-text-muted/60"
        }`}
      />
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search jobs, restaurants, cafes..."
        className="
          flex-1 bg-transparent text-[13px] text-text-primary
          placeholder:text-text-muted/50 border-none outline-none
        "
      />
      {searchQuery && (
        <button
          id="search-clear"
          onClick={() => setSearchQuery("")}
          className="
            w-[18px] h-[18px] rounded-full bg-black/8 flex items-center justify-center
            text-text-muted hover:text-text-primary hover:bg-black/12
            transition-all duration-200 cursor-pointer shrink-0
            active:scale-90
          "
        >
          <X size={9} />
        </button>
      )}
    </div>
  );
}
