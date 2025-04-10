
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for shops, deals, or categories..."
          className="pl-10 pr-20 h-12 rounded-full border-2 border-muted bg-white focus-visible:ring-brand-teal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          type="submit" 
          className="absolute right-1 h-10 rounded-full bg-brand-teal hover:bg-brand-teal/90"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
