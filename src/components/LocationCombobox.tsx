import { useState } from "react";
import { Search, Plus, MapPin, Check, ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LocationOption {
  value: string;
  label: string;
  group: string;
}

interface LocationComboboxProps {
  options: LocationOption[];
  value: string;
  onSelect: (value: string) => void;
  onAddCustomLocation?: (newLocation: LocationOption) => void;
  placeholder?: string;
}

export const LocationCombobox = ({
  options,
  value,
  onSelect,
  onAddCustomLocation,
  placeholder = "Select or search location...",
}: LocationComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      o.group.toLowerCase().includes(query.toLowerCase()) ||
      o.value.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = options.some(
    (o) =>
      o.value.toLowerCase() === query.trim().toLowerCase() ||
      o.label.toLowerCase() === query.trim().toLowerCase()
  );

  const handleSelectOption = (selectedValue: string) => {
    onSelect(selectedValue);
    setOpen(false);
    setQuery("");
  };

  const handleAddCustom = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    // Parse city/state if entered as "City, State" or fallback
    const parts = trimmed.split(",").map((s) => s.trim());
    const label = parts[0] || trimmed;
    const group = parts[1] || "Custom Location";

    const customOpt: LocationOption = {
      value: trimmed,
      label,
      group,
    };
    
    onAddCustomLocation?.(customOpt);
    onSelect(trimmed);
    setOpen(false);
    setQuery("");
  };

  const selectedOption = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-left h-10 border-border/50 bg-background hover:bg-secondary/40"
        >
          <span className="truncate flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            {selectedOption ? (
              <span>
                {selectedOption.label}{" "}
                <span className="text-xs text-muted-foreground">
                  ({selectedOption.group})
                </span>
              </span>
            ) : value ? (
              <span>{value}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-2 bg-card border-border/60 shadow-xl" align="start">
        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type to filter or add custom location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-8 h-9 text-xs bg-secondary/50 border-border/40 focus-visible:ring-primary/40"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="max-h-[220px] overflow-y-auto space-y-0.5 scrollbar-none pr-1">
          {/* Add custom location button if typed and no exact match */}
          {query.trim().length > 0 && !exactMatch && (
            <button
              type="button"
              onClick={handleAddCustom}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors mb-1 text-left border border-primary/30"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Add "{query.trim()}" as custom location</span>
            </button>
          )}

          {filtered.length === 0 && query.trim().length === 0 && (
            <p className="p-3 text-center text-xs text-muted-foreground">
              No locations available. Type above to add one.
            </p>
          )}

          {filtered.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <div className="truncate">
                  <span className="font-medium">{opt.label}</span>
                  <span
                    className={`ml-1.5 text-[10px] ${
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {opt.label === opt.group ? "(state)" : `· ${opt.group}`}
                  </span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
