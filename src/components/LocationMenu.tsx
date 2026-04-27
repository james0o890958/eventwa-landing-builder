import { useState } from "react";
import { MapPin, Search, ChevronRight, LocateFixed, Globe } from "lucide-react";
import { toast } from "sonner";
import { locations } from "@/data/mockLocations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationMenuProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const LocationMenu = ({ selectedLocation, onLocationSelect }: LocationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<string>(locations[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const currentStateData = locations.find((s) => s.id === hoveredState) || locations[0];
  
  const filteredStates = locations.filter(state => 
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.cities.some(city => city.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-secondary transition-all duration-200 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
            {selectedLocation || "Select City"}
          </span>
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select your location
          </DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a state or city..."
              className="pl-10 bg-secondary/50 border-border/30 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="flex h-[450px] mt-6 border-t border-border/30">
          {/* Left Panel - States */}
          <div className="w-[240px] border-r border-border/30 bg-secondary/20">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  States
                </p>
                {filteredStates.map((state) => {
                  const isActive = hoveredState === state.id;
                  return (
                    <button
                      key={state.id}
                      onMouseEnter={() => setHoveredState(state.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20 font-medium" 
                          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                      }`}
                    >
                      <span>{state.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Cities */}
          <div className="flex-1 bg-background/50">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    Cities in <span className="text-primary">{currentStateData.name}</span>
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {currentStateData.cities.length} available
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {currentStateData.cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onLocationSelect?.(`${city.name}, ${city.state}`);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 group text-left"
                    >
                      <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {city.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMenu;
