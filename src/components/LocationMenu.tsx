import { useState, useEffect } from "react";
import { MapPin, Search, ChevronRight, LocateFixed, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";

interface LocationMenuProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const DEFAULT_LOCATIONS = [
  {
    id: "1",
    name: "Lagos",
    cities: [
      { id: "101", name: "Victoria Island", state: "Lagos" },
      { id: "102", name: "Lekki", state: "Lagos" },
      { id: "103", name: "Ikeja", state: "Lagos" },
      { id: "104", name: "Lagos Island", state: "Lagos" },
      { id: "105", name: "Surulere", state: "Lagos" },
      { id: "106", name: "Yaba", state: "Lagos" },
    ],
  },
  {
    id: "2",
    name: "Abuja (FCT)",
    cities: [
      { id: "201", name: "Maitama", state: "Abuja (FCT)" },
      { id: "202", name: "Wuse", state: "Abuja (FCT)" },
      { id: "203", name: "Garki", state: "Abuja (FCT)" },
      { id: "204", name: "Asokoro", state: "Abuja (FCT)" },
      { id: "205", name: "Gwarinpa", state: "Abuja (FCT)" },
    ],
  },
  {
    id: "3",
    name: "Rivers",
    cities: [
      { id: "301", name: "Port Harcourt", state: "Rivers" },
      { id: "302", name: "Obio-Akpor", state: "Rivers" },
      { id: "303", name: "Eleme", state: "Rivers" },
      { id: "304", name: "Bonny", state: "Rivers" },
    ],
  },
  {
    id: "4",
    name: "Oyo",
    cities: [
      { id: "401", name: "Ibadan", state: "Oyo" },
      { id: "402", name: "Ogbomosho", state: "Oyo" },
      { id: "403", name: "Oyo Town", state: "Oyo" },
    ],
  },
  {
    id: "5",
    name: "Kano",
    cities: [
      { id: "501", name: "Kano City", state: "Kano" },
      { id: "502", name: "Ungogo", state: "Kano" },
      { id: "503", name: "Kumbotso", state: "Kano" },
    ],
  },
  {
    id: "6",
    name: "Enugu",
    cities: [
      { id: "601", name: "Enugu City", state: "Enugu" },
      { id: "602", name: "Nsukka", state: "Enugu" },
    ],
  },
  {
    id: "7",
    name: "Edo",
    cities: [
      { id: "701", name: "Benin City", state: "Edo" },
      { id: "702", name: "Ekpoma", state: "Edo" },
    ],
  },
];

const LocationMenu = ({ selectedLocation, onLocationSelect }: LocationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<any[]>(DEFAULT_LOCATIONS);
  const [hoveredState, setHoveredState] = useState<string>(DEFAULT_LOCATIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("states_cities");
        const data = res?.data || res;
        const rawStates = data?.states;
        const rawCities = data?.cities;

        const statesList: any[] = Array.isArray(rawStates)
          ? rawStates
          : rawStates && typeof rawStates === "object" && !("javascript" in rawStates) && !("__PHP_Incomplete_Class_Name" in rawStates)
          ? Object.values(rawStates)
          : [];

        const citiesList: any[] = Array.isArray(rawCities)
          ? rawCities
          : rawCities && typeof rawCities === "object" && !("__PHP_Incomplete_Class_Name" in rawCities)
          ? Object.values(rawCities)
          : [];

        if (statesList.length > 0) {
          const mapped = statesList
            .map((state: any) => {
              if (!state || typeof state !== "object") return null;
              const stateName = typeof state.name === "string" ? state.name : (state.state_name || state.title || "");
              if (!stateName) return null;

              const stateCities = citiesList
                .filter((city: any) => city && typeof city === "object" && (city.state_id === state.id || String(city.state_id) === String(state.id)))
                .map((city: any) => ({
                  id: String(city.id),
                  name: typeof city.name === "string" ? city.name : (city.city_name || city.title || ""),
                  state: stateName,
                }))
                .filter((c: any) => Boolean(c.name));

              return {
                id: String(state.id),
                name: stateName,
                cities: stateCities,
              };
            })
            .filter((s: any) => Boolean(s && s.name));

          if (mapped.length > 0) {
            setLocations(mapped);
            setHoveredState(String(mapped[0].id));
          }
        }
      } catch (err) {
        console.error("Failed to load states and cities from API:", err);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationSelect = async (stateName: string, stateId: string, cityName?: string, cityId?: string) => {
    const displayText = cityName ? `${cityName}, ${stateName}` : `All ${stateName}`;
    onLocationSelect?.(displayText);
    setIsOpen(false);

    const sId = Number(stateId);
    const cId = cityId ? Number(cityId) : null;
    if (!isNaN(sId)) {
      try {
        await api.get("guestLocation", {
          state_id: sId,
          city_id: cId,
        });
      } catch (err) {
        console.error("Failed to record guest location:", err);
      }
    }
  };

  const currentStateData = locations.find((s) => s.id === hoveredState) || locations[0];
  
  const filteredStates = locations.filter(state => {
    const stateMatch = (state?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const cityMatch = Array.isArray(state?.cities) && state.cities.some((city: any) =>
      (city?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    return stateMatch || cityMatch;
  });

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
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a state or city..."
                className="pl-10 bg-secondary/50 border-border/30 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!("geolocation" in navigator)) {
                  toast.error("Geolocation is not supported on this device");
                  return;
                }
                toast.loading("Detecting your location…", { id: "geo" });
                navigator.geolocation.getCurrentPosition(
                  () => {
                    const lagosState = locations.find((l) => (l?.name || '').toLowerCase() === "lagos");
                    if (lagosState) {
                      handleLocationSelect(lagosState.name, lagosState.id);
                    } else {
                      onLocationSelect?.("Lagos, Lagos");
                    }
                    toast.success("Location set to Lagos", { id: "geo" });
                    setIsOpen(false);
                  },
                  (err) => {
                    toast.error(err.message || "Couldn't get your location", { id: "geo" });
                  },
                  { timeout: 8000 },
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <LocateFixed className="h-4 w-4" />
              Use my location
            </button>
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
                {currentStateData ? (
                  <>
                    <div className="mb-6 flex items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Cities in <span className="text-primary">{currentStateData.name}</span>
                      </h3>
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        {currentStateData.cities?.length || 0} available
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* All <state> option */}
                      <button
                        key={`all-${currentStateData.id}`}
                        onClick={() => handleLocationSelect(currentStateData.name, currentStateData.id)}
                        className="col-span-2 flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all duration-200 group text-left"
                      >
                        <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          All {currentStateData.name}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          Anywhere in {currentStateData.name}
                        </span>
                      </button>

                      {currentStateData.cities?.map((city: any) => (
                        <button
                          key={city.id}
                          onClick={() => handleLocationSelect(currentStateData.name, currentStateData.id, city.name, city.id)}
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
                  </>
                ) : (
                  <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                    Select a state to view cities
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMenu;
