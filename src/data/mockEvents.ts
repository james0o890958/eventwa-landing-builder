import felabrationImg from "@/assets/events/felabration.jpg";
import burnaBoyImg from "@/assets/events/burna-boy.jpg";
import tiwaSavageImg from "@/assets/events/tiwa-savage.jpg";
import wizkidFestImg from "@/assets/events/wizkid-fest.jpg";
import asakeTourImg from "@/assets/events/asake-tour.jpg";
import afconScreeningImg from "@/assets/events/afcon-screening.jpg";
import lagosMarathonImg from "@/assets/events/lagos-marathon.jpg";
import npflDerbyImg from "@/assets/events/npfl-derby.jpg";
import poloTournamentImg from "@/assets/events/polo-tournament.jpg";
import boxingNightImg from "@/assets/events/boxing-night.jpg";
import nollywoodPremiereImg from "@/assets/events/nollywood-premiere.jpg";
import africanFilmFestImg from "@/assets/events/african-film-fest.jpg";
import amvcaImg from "@/assets/events/amvca.jpg";
import lagosCarnivalImg from "@/assets/events/lagos-carnival.jpg";
import calabarFestivalImg from "@/assets/events/calabar-festival.jpg";
import osunOsogboImg from "@/assets/events/osun-osogbo.jpg";
import argunguImg from "@/assets/events/argungu.jpg";
import newYamImg from "@/assets/events/new-yam.jpg";
import techcabalImg from "@/assets/events/techcabal.jpg";
import startupWeekImg from "@/assets/events/startup-week.jpg";
import fintechSummitImg from "@/assets/events/fintech-summit.jpg";
import rccgCongressImg from "@/assets/events/rccg-congress.jpg";
import jumahPrayerImg from "@/assets/events/jumah-prayer.jpg";
import owambeImg from "@/assets/events/owambe.jpg";
import rooftopVibesImg from "@/assets/events/rooftop-vibes.jpg";
import dettyDecemberImg from "@/assets/events/detty-december.jpg";
import brunchClubImg from "@/assets/events/brunch-club.jpg";
import afroNationImg from "@/assets/events/afro-nation.jpg";
import blackPantherImg from "@/assets/events/black-panther-premiere.jpg";
import tribeCalledJudahImg from "@/assets/events/tribe-called-judah.jpg";
import weddingParty3Img from "@/assets/events/wedding-party-3.jpg";
import mufasaScreeningImg from "@/assets/events/mufasa-screening.jpg";
import anikulapoSequelImg from "@/assets/events/anikulapo-sequel.jpg";

export type EventCategory =
  | "sports"
  | "movies"
  | "music"
  | "religious"
  | "conferences"
  | "social"
  | "festivals"
  | "gaming"
  | "exhibitions";

export interface TicketType {
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  start_date?: string;
  time: string;
  location: string;
  image: string;
  price: number;
  organizer: string;
  attendees: number;
  attendees_count?: number;
  category: EventCategory;
  featured?: boolean;
  ticketTypes?: TicketType[];
  stock?: number;
  agenda?: AgendaItem[];
  rules?: string[];
}

export const categories: {
  id: EventCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "music",
    label: "Music",
    icon: "🎵",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "sports",
    label: "Sports",
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "movies",
    label: "Movies",
    icon: "🎬",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "festivals",
    label: "Festivals",
    icon: "🎪",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "conferences",
    label: "Conferences",
    icon: "💼",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "religious",
    label: "Religious",
    icon: "🕌",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "social",
    label: "Social",
    icon: "🥂",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: "🎮",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "exhibitions",
    label: "Exhibitions",
    icon: "🎨",
    color: "from-red-500 to-pink-600",
  },
];

export const mockEvents: Event[] = [
  // MUSIC
  {
    id: "1",
    title: "Felabration 2026",
    description:
      "The legendary annual festival celebrating the life and music of Fela Anikulapo-Kuti. Seven days of Afrobeat, jazz, highlife, and jùjú music at the iconic New Afrika Shrine.",
    date: "2026-10-15",
    time: "6:00 PM",
    location: "New Afrika Shrine, Ikeja, Lagos",
    image: felabrationImg,
    price: 5000,
    organizer: "Fela Anikulapo-Kuti Foundation",
    attendees: 8500,
    category: "music",
    featured: true,
    ticketTypes: [
      { name: "General", price: 5000, quantity: 2000, sold: 1800 },
      { name: "VIP", price: 15000, quantity: 500, sold: 430 },
      { name: "VVIP Table (10 seats)", price: 50000, quantity: 50, sold: 45 },
    ],
    agenda: [
      {
        time: "6:00 PM",
        title: "Gates Open",
        description: "Registration, welcome drinks and art installations",
      },
      {
        time: "7:00 PM",
        title: "Opening Act",
        description: "Local Afrobeat bands set the mood",
      },
      {
        time: "8:30 PM",
        title: "Main Performance",
        description: "Fela's family and featured guest artists take the stage",
      },
      {
        time: "10:00 PM",
        title: "Cultural Showcase",
        description: "Traditional dances, spoken word and arts display",
      },
      {
        time: "11:30 PM",
        title: "Grand Finale",
        description: "Closing set with full Afrobeat orchestra",
      },
    ],
    rules: [
      "No outside food or drinks allowed inside the venue",
      "Dress code: Smart casual or traditional attire strongly encouraged",
      "No professional cameras or recording equipment without press accreditation",
      "Strictly 18+ after 10 PM",
      "Respect the culture — keep the shrine clean and orderly",
    ],
  },
  {
    id: "2",
    title: "Burna Boy Live in Lagos",
    description:
      "The African Giant returns home for an electrifying night of Afro-fusion at the Eko Convention Centre. Grammy-winning hits with world-class production and pyrotechnics.",
    date: "2026-12-20",
    time: "7:00 PM",
    location: "Eko Convention Centre, Victoria Island, Lagos",
    image: burnaBoyImg,
    price: 25000,
    organizer: "Spaceship Entertainment",
    attendees: 12000,
    category: "music",
    featured: true,
    ticketTypes: [
      { name: "Regular", price: 25000, quantity: 8000, sold: 7200 },
      { name: "VIP Floor", price: 60000, quantity: 2000, sold: 1850 },
      { name: "VIP Box", price: 150000, quantity: 200, sold: 195 },
    ],
    agenda: [
      {
        time: "7:00 PM",
        title: "Doors Open",
        description: "Entry, bar open, warm-up DJ set",
      },
      {
        time: "8:00 PM",
        title: "Opening Act",
        description: "Featured supporting artists perform",
      },
      {
        time: "9:30 PM",
        title: "Burna Boy Takes the Stage",
        description: "The African Giant opens with fan favourites",
      },
      {
        time: "10:30 PM",
        title: "Deep Cuts Set",
        description: "Rare album tracks and international collaborations",
      },
      {
        time: "11:45 PM",
        title: "Grand Finale & Encore",
        description: "Closing with pyrotechnics and surprise guests",
      },
    ],
    rules: [
      "Valid ID required for entry — strictly 18+",
      "No re-entry after exit",
      "VIP wristbands must be worn at all times",
      "No crowd surfing or moshing in the VIP zones",
      "Professional recording equipment not permitted without clearance",
    ],
  },
  {
    id: "3",
    title: "Tiwa Savage – Water & Garri Tour",
    description:
      "Number one African bad girl Tiwa Savage brings her Water & Garri tour to Abuja. A night of Afrobeats, R&B, and pop with stunning visuals.",
    date: "2026-08-10",
    time: "8:00 PM",
    location: "International Conference Centre, Abuja",
    image: tiwaSavageImg,
    price: 15000,
    organizer: "Mavin Records",
    attendees: 6000,
    category: "music",
    ticketTypes: [
      { name: "Regular", price: 15000, quantity: 3000, sold: 2600 },
      { name: "Gold", price: 35000, quantity: 800, sold: 720 },
      { name: "Platinum Meet & Greet", price: 80000, quantity: 100, sold: 88 },
    ],
    agenda: [
      {
        time: "8:00 PM",
        title: "Venue Opens",
        description: "Welcome cocktails and pre-show entertainment",
      },
      {
        time: "9:00 PM",
        title: "Support Act",
        description: "Emerging Afrobeats artists open the night",
      },
      {
        time: "10:00 PM",
        title: "Tiwa Savage Performs",
        description: "Full headline set spanning her entire discography",
      },
      {
        time: "11:30 PM",
        title: "Fan Interaction",
        description: "Platinum ticket holders meet & greet backstage",
      },
    ],
    rules: [
      "No professional photography without press pass",
      "Dress code enforced — no slippers or casual wear in VIP",
      "All bags subject to security check at entry",
      "No refunds after ticket purchase",
    ],
  },
  {
    id: "19",
    title: "Wizkid Made in Lagos Fest",
    description:
      "Starboy Wizkid headlines the ultimate Afrobeats festival. Multiple stages, surprise guest appearances, and non-stop vibes from sunset to sunrise.",
    date: "2026-11-28",
    time: "5:00 PM",
    location: "Tafawa Balewa Square, Lagos Island",
    image: wizkidFestImg,
    price: 30000,
    organizer: "Starboy Entertainment",
    attendees: 25000,
    category: "music",
    featured: true,
  },
  {
    id: "20",
    title: "Asake Lungu Boy Tour",
    description:
      "Mr Money with the vibes brings his high-energy Amapiano-infused Afrobeats to Port Harcourt. Expect crowd surfs, mosh pits, and pure street energy.",
    date: "2026-09-05",
    time: "7:30 PM",
    location: "Port Harcourt Pleasure Park, Rivers State",
    image: asakeTourImg,
    price: 12000,
    organizer: "YBNL Nation",
    attendees: 8000,
    category: "music",
  },
  // SPORTS
  {
    id: "4",
    title: "AFCON 2026 Screening – Nigeria vs Ghana",
    description:
      "Watch the Super Eagles take on the Black Stars on a massive outdoor screen. Food vendors, face painting, and the roar of passionate fans. Jollof bragging rights on the line!",
    date: "2026-06-28",
    time: "5:00 PM",
    location: "Tafawa Balewa Square, Lagos Island",
    image: afconScreeningImg,
    price: 2000,
    organizer: "NFF Fan Zone",
    attendees: 15000,
    category: "sports",
    featured: true,
    ticketTypes: [
      { name: "Fan Zone", price: 2000, quantity: 10000, sold: 9200 },
      { name: "VIP Stand", price: 8000, quantity: 3000, sold: 2700 },
      { name: "Premium Suite", price: 25000, quantity: 500, sold: 480 },
    ],
    agenda: [
      {
        time: "5:00 PM",
        title: "Gates Open",
        description: "Fan zone activities, face painting and street food",
      },
      {
        time: "6:00 PM",
        title: "Pre-Match Show",
        description: "Live DJ, drumming performances and fan warm-up",
      },
      {
        time: "7:00 PM",
        title: "Kick-Off",
        description: "Nigeria vs Ghana AFCON group stage match begins",
      },
      {
        time: "8:45 PM",
        title: "Half-Time Show",
        description: "Live entertainment and halftime analysis",
      },
      {
        time: "9:45 PM",
        title: "Final Whistle & Celebrations",
        description: "Post-match fan celebrations and prize draws",
      },
    ],
    rules: [
      "No alcohol permitted in the family zone",
      "Wear your green and white — Super Eagles colours encouraged",
      "No fireworks, flares or dangerous items",
      "Children under 12 must be accompanied by an adult",
      "Respect opposing fans — zero tolerance for violence",
    ],
  },
  {
    id: "5",
    title: "Lagos City Marathon 2026",
    description:
      "Join over 100,000 runners in Africa's largest city marathon. 10K, 21K half marathon, and full 42K through the streets of Lagos. $100,000 prize money.",
    date: "2026-02-14",
    time: "6:30 AM",
    location: "National Stadium, Surulere, Lagos",
    image: lagosMarathonImg,
    price: 5000,
    organizer: "Lagos State Sports Commission",
    attendees: 100000,
    category: "sports",
    ticketTypes: [
      { name: "10K Fun Run", price: 5000, quantity: 50000, sold: 48000 },
      { name: "21K Half Marathon", price: 10000, quantity: 30000, sold: 27500 },
      { name: "42K Full Marathon", price: 15000, quantity: 10000, sold: 9200 },
    ],
    agenda: [
      {
        time: "5:30 AM",
        title: "Registration & Kit Collection",
        description: "Collect your race bib, timing chip and goodie bag",
      },
      {
        time: "6:30 AM",
        title: "42K Full Marathon Start",
        description: "Elite runners and full marathon participants set off",
      },
      {
        time: "7:00 AM",
        title: "21K Half Marathon Start",
        description: "Half marathon wave departs from National Stadium",
      },
      {
        time: "8:00 AM",
        title: "10K Fun Run Start",
        description: "All 10K participants begin the fun run",
      },
      {
        time: "11:00 AM",
        title: "Finish Line Celebrations",
        description: "Medal ceremony, prize giving and post-race refreshments",
      },
    ],
    rules: [
      "Valid race bib must be worn visibly at all times",
      "No headphones permitted for elite wave runners",
      "Pacers and unofficial support runners not allowed on the course",
      "Participants must complete medical clearance form before race day",
      "Littering on the course will result in disqualification",
    ],
  },
  {
    id: "6",
    title: "NPFL Derby: Enyimba vs Rangers",
    description:
      "The biggest rivalry in Nigerian football! Watch Enyimba International take on Rangers International in a fiery NPFL clash.",
    date: "2026-04-20",
    time: "4:00 PM",
    location: "Enyimba International Stadium, Aba",
    image: npflDerbyImg,
    price: 1500,
    organizer: "NPFL",
    attendees: 25000,
    category: "sports",
    ticketTypes: [
      { name: "Terrace", price: 1500, quantity: 15000, sold: 14200 },
      { name: "Grandstand", price: 4000, quantity: 7000, sold: 6500 },
      { name: "VIP Box", price: 15000, quantity: 500, sold: 420 },
    ],
    agenda: [
      {
        time: "4:00 PM",
        title: "Stadium Gates Open",
        description:
          "Fan zones, merchandise stalls and pre-match entertainment",
      },
      {
        time: "5:30 PM",
        title: "Team Warm-Up",
        description: "Both squads warm up on the pitch",
      },
      {
        time: "6:00 PM",
        title: "Kick-Off",
        description: "Enyimba vs Rangers NPFL Derby begins",
      },
      {
        time: "6:45 PM",
        title: "Half Time",
        description: "15-minute break with pitch-side entertainment",
      },
      {
        time: "7:45 PM",
        title: "Full Time",
        description: "Post-match interviews and fan celebrations",
      },
    ],
    rules: [
      "No banners or flags with offensive language or imagery",
      "Strictly no bottles, cans or projectiles inside the stadium",
      "Home and away supporters seated in designated sections only",
      "Children under 5 enter free but must sit on a parent's lap",
      "Club colours and jerseys are welcome and encouraged",
    ],
  },
  {
    id: "21",
    title: "Lagos Polo Tournament",
    description:
      "Nigeria's most prestigious polo event featuring top riders from across Africa. VIP hospitality, champagne tents, and thrilling chukkers at the Lagos Polo Club.",
    date: "2026-03-15",
    time: "11:00 AM",
    location: "Lagos Polo Club, Ikoyi, Lagos",
    image: poloTournamentImg,
    price: 50000,
    organizer: "Lagos Polo Club",
    attendees: 3000,
    category: "sports",
  },
  {
    id: "22",
    title: "Abuja Boxing Night",
    description:
      "Professional boxing returns to Abuja with an explosive undercard and main event. Nigeria's finest fighters go toe-to-toe under the lights.",
    date: "2026-07-12",
    time: "7:00 PM",
    location: "Moshood Abiola National Stadium, Abuja",
    image: boxingNightImg,
    price: 8000,
    organizer: "Nigerian Boxing Federation",
    attendees: 5000,
    category: "sports",
  },
  // MOVIES
  {
    id: "7",
    title: "Nollywood Premiere Night: The Return",
    description:
      "Be among the first to watch the most anticipated Nollywood blockbuster. Red carpet, celebrity meet-and-greets, and an exclusive after-party.",
    date: "2026-05-22",
    time: "7:00 PM",
    location: "Filmhouse IMAX, Lekki, Lagos",
    image: nollywoodPremiereImg,
    price: 10000,
    organizer: "FilmOne Entertainment",
    attendees: 800,
    category: "movies",
  },
  {
    id: "8",
    title: "African Film Festival Abuja",
    description:
      "A weekend of African cinema featuring screenings from Nigeria, Ghana, Kenya, and South Africa. Panel discussions and masterclasses with top directors.",
    date: "2026-09-12",
    time: "10:00 AM",
    location: "Silverbird Galleria, Abuja",
    image: africanFilmFestImg,
    price: 3000,
    organizer: "Africa Film Society",
    attendees: 2500,
    category: "movies",
  },
  {
    id: "23",
    title: "AMVCA Awards Night 2026",
    description:
      "The Africa Magic Viewers' Choice Awards — Africa's biggest film and TV awards ceremony. Watch Nollywood's finest compete for the golden statue.",
    date: "2026-05-10",
    time: "6:00 PM",
    location: "Eko Hotels & Suites, Victoria Island, Lagos",
    image: amvcaImg,
    price: 75000,
    organizer: "MultiChoice Nigeria",
    attendees: 2000,
    category: "movies",
    featured: true,
  },
  // FESTIVALS
  {
    id: "9",
    title: "Lagos Carnival 2026",
    description:
      "The biggest street party in West Africa! Colorful costumes, masquerade bands, live music, and food from every corner of Nigeria.",
    date: "2026-04-05",
    time: "10:00 AM",
    location: "Ikoyi to Victoria Island, Lagos",
    image: lagosCarnivalImg,
    price: 0,
    organizer: "Lagos State Ministry of Tourism",
    attendees: 50000,
    category: "festivals",
    featured: true,
  },
  {
    id: "10",
    title: "Calabar Festival & Carnival",
    description:
      "Africa's biggest street party! Themed floats, cultural dances, beauty pageants, and international performances across a month of celebrations.",
    date: "2026-12-01",
    time: "9:00 AM",
    location: "Calabar, Cross River State",
    image: calabarFestivalImg,
    price: 0,
    organizer: "Cross River State Tourism Bureau",
    attendees: 200000,
    category: "festivals",
  },
  {
    id: "11",
    title: "Osun-Osogbo Festival",
    description:
      "A UNESCO-recognized annual festival celebrating the Yoruba goddess Osun. Two weeks of traditional rituals and cultural processions at the Sacred Grove.",
    date: "2026-08-21",
    time: "8:00 AM",
    location: "Osun-Osogbo Sacred Grove, Osogbo",
    image: osunOsogboImg,
    price: 0,
    organizer: "Osun State Cultural Council",
    attendees: 30000,
    category: "festivals",
  },
  {
    id: "24",
    title: "Argungu Fishing Festival",
    description:
      "One of Nigeria's oldest cultural festivals! Hundreds of fishermen compete in the Sokoto River. Traditional wrestling, archery, and cultural displays.",
    date: "2026-02-28",
    time: "7:00 AM",
    location: "Argungu, Kebbi State",
    image: argunguImg,
    price: 0,
    organizer: "Kebbi State Ministry of Culture",
    attendees: 40000,
    category: "festivals",
  },
  {
    id: "25",
    title: "New Yam Festival – Iri Ji",
    description:
      "The Igbo New Yam Festival celebrating the harvest season. Traditional dances, masquerades, yam displays, and cultural ceremonies honoring Igbo heritage.",
    date: "2026-08-08",
    time: "9:00 AM",
    location: "Dan Anyiam Stadium, Owerri, Imo State",
    image: newYamImg,
    price: 0,
    organizer: "Imo State Cultural Council",
    attendees: 20000,
    category: "festivals",
  },
  // CONFERENCES
  {
    id: "12",
    title: "TechCabal Moonshot Conference",
    description:
      "West Africa's premier tech conference. Keynotes from top tech leaders, startup pitch competitions, and workshops on AI, fintech, and blockchain.",
    date: "2026-10-08",
    time: "9:00 AM",
    location: "Landmark Centre, Victoria Island, Lagos",
    image: techcabalImg,
    price: 50000,
    organizer: "TechCabal",
    attendees: 3000,
    category: "conferences",
  },
  {
    id: "13",
    title: "Lagos Startup Week 2026",
    description:
      "Five days of panels, fireside chats, and networking across multiple Lagos venues. Connect with founders, VCs, and ecosystem builders.",
    date: "2026-06-15",
    time: "10:00 AM",
    location: "Various Venues, Yaba & Victoria Island, Lagos",
    image: startupWeekImg,
    price: 15000,
    organizer: "Lagos Innovates",
    attendees: 5000,
    category: "conferences",
  },
  {
    id: "26",
    title: "Africa Fintech Summit 2026",
    description:
      "The continent's leading fintech conference. Panel discussions on digital payments, crypto regulation, and the future of banking in Africa.",
    date: "2026-11-12",
    time: "9:00 AM",
    location: "Transcorp Hilton, Abuja",
    image: fintechSummitImg,
    price: 40000,
    organizer: "Africa Fintech Network",
    attendees: 2000,
    category: "conferences",
  },
  // RELIGIOUS
  {
    id: "14",
    title: "RCCG Holy Ghost Congress 2026",
    description:
      "Five nights of worship, prayers, testimonies, and powerful sermons by Pastor E.A. Adeboye and guest ministers from around the world.",
    date: "2026-12-08",
    time: "6:00 PM",
    location: "Redemption City, Km 46 Lagos-Ibadan Expressway",
    image: rccgCongressImg,
    price: 0,
    organizer: "RCCG",
    attendees: 500000,
    category: "religious",
  },
  {
    id: "15",
    title: "Jumah Prayer & Community Iftar",
    description:
      "A special Jumah prayer followed by a community Iftar during Ramadan. Sermon by Sheikh Ahmad Gumi, Quran recitations, and communal meal.",
    date: "2026-03-20",
    time: "1:00 PM",
    location: "Abuja National Mosque, Abuja",
    image: jumahPrayerImg,
    price: 0,
    organizer: "Abuja Muslim Community",
    attendees: 10000,
    category: "religious",
  },
  // SOCIAL
  {
    id: "16",
    title: "Owambe Saturday – The Grand Edition",
    description:
      "Lagos's most glamorous Owambe party! Dress in your finest aso-oke and agbada for highlife music, jollof rice wars, and spraying. Aso-ebi available!",
    date: "2026-07-18",
    time: "12:00 PM",
    location: "Harbour Point, Victoria Island, Lagos",
    image: owambeImg,
    price: 20000,
    organizer: "Owambe Nation",
    attendees: 1500,
    category: "social",
  },
  {
    id: "17",
    title: "Rooftop Vibes Lagos",
    description:
      "An exclusive rooftop networking and cocktail event with panoramic Lagos skyline views. Live DJ, craft cocktails, small chops, and connections that matter.",
    date: "2026-05-30",
    time: "5:00 PM",
    location: "Sky Restaurant & Lounge, Eko Atlantic, Lagos",
    image: rooftopVibesImg,
    price: 15000,
    organizer: "Lagos Social Club",
    attendees: 300,
    category: "social",
  },
  {
    id: "18",
    title: "Detty December Beach Party",
    description:
      "The ultimate December beach party at Elegushi Beach! Multiple DJ stages, celebrity appearances, beach volleyball, bonfire sessions. No gree for anybody!",
    date: "2026-12-27",
    time: "2:00 PM",
    location: "Elegushi Beach, Lekki, Lagos",
    image: dettyDecemberImg,
    price: 10000,
    organizer: "Detty December Inc.",
    attendees: 20000,
    category: "social",
    featured: true,
  },
  {
    id: "28",
    title: "Lagos Brunch Club",
    description:
      "A curated Sunday brunch experience for Lagos's creative class. Garden setting, bottomless mimosas, live acoustic music, and artisanal Nigerian cuisine.",
    date: "2026-06-07",
    time: "11:00 AM",
    location: "The Wheatbaker Hotel, Ikoyi, Lagos",
    image: brunchClubImg,
    price: 25000,
    organizer: "Lagos Brunch Collective",
    attendees: 200,
    category: "social",
  },
  {
    id: "29",
    title: "Afro Nation Nigeria 2026",
    description:
      "The world's biggest Afrobeats festival lands in Lagos! Three days, five stages, 50+ artists. The ultimate celebration of African music and culture.",
    date: "2026-12-29",
    time: "12:00 PM",
    location: "Eko Atlantic City, Lagos",
    image: afroNationImg,
    price: 35000,
    organizer: "Afro Nation",
    attendees: 40000,
    category: "social",
    featured: true,
  },
  // MOVIES – Upcoming Cinema Screenings
  {
    id: "30",
    title: "Black Panther: Rise of Wakanda – Lagos Premiere",
    description:
      "The highly anticipated Marvel sequel gets an exclusive IMAX premiere in Lagos! Red carpet, cosplay contest with prizes, and a rooftop after-party overlooking the Atlantic.",
    date: "2026-07-25",
    time: "6:30 PM",
    location: "Filmhouse IMAX, Lekki, Lagos",
    image: blackPantherImg,
    price: 15000,
    organizer: "Filmhouse Cinemas",
    attendees: 1200,
    category: "movies",
  },
  {
    id: "31",
    title: "A Tribe Called Judah 2 – Nationwide Screening",
    description:
      "The sequel to the highest-grossing Nollywood film of all time! Funke Akindele returns with even more laughs, drama, and heart. Opening weekend across all major cinemas.",
    date: "2026-06-20",
    time: "12:00 PM",
    location: "Genesis Cinemas, Lagos & Nationwide",
    image: tribeCalledJudahImg,
    price: 5000,
    organizer: "Genesis Cinemas",
    attendees: 50000,
    category: "movies",
  },
  {
    id: "32",
    title: "The Wedding Party 3 – Exclusive Premiere",
    description:
      "The long-awaited third installment of Nigeria's most beloved film franchise! Celebrity red carpet, champagne reception, and the first screening before nationwide release.",
    date: "2026-08-15",
    time: "7:00 PM",
    location: "Silverbird Galleria, Victoria Island, Lagos",
    image: weddingParty3Img,
    price: 20000,
    organizer: "EbonyLife Films",
    attendees: 800,
    category: "movies",
    featured: true,
  },
  {
    id: "33",
    title: "Mufasa: The Lion King – Family Screening",
    description:
      "A magical family-friendly screening event! Themed activities for kids including face painting, lion mask crafting, and African drumming workshops before the film.",
    date: "2026-05-18",
    time: "11:00 AM",
    location: "IMAX Cinema, Palms Shopping Mall, Lekki, Lagos",
    image: mufasaScreeningImg,
    price: 7000,
    organizer: "Filmhouse Cinemas",
    attendees: 600,
    category: "movies",
  },
  {
    id: "34",
    title: "Anikulapo: Rise of the Sorcerer – Premiere",
    description:
      "Kunle Afolayan's epic sequel to the critically acclaimed Anikulapo. Exclusive premiere with Q&A from the cast and director at Terra Kulture. Yoruba mythology meets cinematic brilliance.",
    date: "2026-09-28",
    time: "6:00 PM",
    location: "Terra Kulture, Victoria Island, Lagos",
    image: anikulapoSequelImg,
    price: 12000,
    organizer: "KAP Film & Television Academy",
    attendees: 500,
    category: "movies",
  },

  // GAMING
  {
    id: "35",
    title: "Lagos Gaming Festival 2026",
    description:
      "West Africa's biggest gaming event! Console tournaments, PC gaming zones, VR experiences, esports competitions, and exclusive game demos. Cash prizes up to ₦5M for top gamers.",
    date: "2026-08-22",
    time: "10:00 AM",
    location: "Landmark Centre, Victoria Island, Lagos",
    image: techcabalImg,
    price: 8000,
    organizer: "GameZone Nigeria",
    attendees: 12000,
    category: "gaming",
    featured: true,
    ticketTypes: [
      { name: "General Access", price: 8000, quantity: 8000, sold: 6500 },
      { name: "Tournament Pass", price: 20000, quantity: 2000, sold: 1800 },
      { name: "VIP Lounge", price: 50000, quantity: 300, sold: 250 },
    ],
    agenda: [
      {
        time: "10:00 AM",
        title: "Doors Open",
        description: "Gaming zones, merchandise and registration",
      },
      {
        time: "11:00 AM",
        title: "Tournament Brackets",
        description: "FIFA, Call of Duty and Tekken 8 qualifiers begin",
      },
      {
        time: "2:00 PM",
        title: "Esports Showcase",
        description: "Live pro esports matches on main stage",
      },
      {
        time: "5:00 PM",
        title: "Finals & Prize Giving",
        description: "Grand finals and cash prize ceremony",
      },
    ],
    rules: [
      "Bring valid ID — strictly 13+ event",
      "No food or drinks near gaming stations",
      "Tournament participants must register 30 minutes before their match",
      "Respect all equipment — damage will be charged",
    ],
  },
  {
    id: "36",
    title: "Esports Nigeria Championship 2026",
    description:
      "Nigeria's premier esports championship. Teams compete in Mobile Legends, PUBG Mobile, and FIFA across three days for the national title and ₦10M prize pool.",
    date: "2026-11-05",
    time: "9:00 AM",
    location: "Eko Convention Centre, Victoria Island, Lagos",
    image: startupWeekImg,
    price: 5000,
    organizer: "Esports Nigeria",
    attendees: 8000,
    category: "gaming",
    ticketTypes: [
      { name: "Spectator Pass", price: 5000, quantity: 5000, sold: 4200 },
      { name: "3-Day Pass", price: 12000, quantity: 2000, sold: 1750 },
    ],
  },
  {
    id: "37",
    title: "Abuja Retro Gaming Night",
    description:
      "A nostalgic evening celebrating classic gaming. Play original consoles from the 80s, 90s and 2000s — NES, Sega, PS1, N64. Dress in retro attire for discounts!",
    date: "2026-06-13",
    time: "5:00 PM",
    location: "Hub Abuja, Wuse II, Abuja",
    image: rooftopVibesImg,
    price: 4000,
    organizer: "Retro Vibes NG",
    attendees: 500,
    category: "gaming",
  },

  // EXHIBITIONS
  {
    id: "38",
    title: "Lagos Art Fair 2026",
    description:
      "The premier contemporary African art fair showcasing over 200 artists from across the continent. Paintings, sculptures, photography, digital art and live installations at Eko Hotels.",
    date: "2026-10-30",
    time: "10:00 AM",
    location: "Eko Hotels & Suites, Victoria Island, Lagos",
    image: amvcaImg,
    price: 15000,
    organizer: "Lagos Art Council",
    attendees: 6000,
    category: "exhibitions",
    featured: true,
    ticketTypes: [
      { name: "Day Pass", price: 15000, quantity: 3000, sold: 2400 },
      { name: "Weekend Pass", price: 25000, quantity: 1500, sold: 1200 },
      { name: "Collector's VIP", price: 75000, quantity: 200, sold: 160 },
    ],
    agenda: [
      {
        time: "10:00 AM",
        title: "Doors Open",
        description: "Exhibition halls and gallery tours begin",
      },
      {
        time: "12:00 PM",
        title: "Artist Talks",
        description: "Featured artists discuss their work and process",
      },
      {
        time: "3:00 PM",
        title: "Live Art Performance",
        description: "Live painting and installation demonstrations",
      },
      {
        time: "6:00 PM",
        title: "Collectors' Evening",
        description: "Private viewing and acquisition event for VIP guests",
      },
    ],
    rules: [
      "No flash photography near artworks",
      "Do not touch any artwork unless invited to",
      "Children under 12 must be supervised at all times",
      "Commercial photography requires written permission",
    ],
  },
  {
    id: "39",
    title: "National Museum Photography Exhibition",
    description:
      "A powerful photo exhibition documenting 60 years of Nigerian history, culture and people. Over 300 photographs by Nigeria's most celebrated photojournalists.",
    date: "2026-07-04",
    time: "9:00 AM",
    location: "National Museum, Onikan, Lagos",
    image: osunOsogboImg,
    price: 2000,
    organizer: "Nigerian Heritage Foundation",
    attendees: 3000,
    category: "exhibitions",
  },
  {
    id: "40",
    title: "Abuja Fashion & Design Expo",
    description:
      "Nigeria's biggest fashion and textile design exhibition. Emerging designers, established fashion houses, live runway shows and a retail marketplace.",
    date: "2026-09-18",
    time: "11:00 AM",
    location: "Transcorp Hilton, Abuja",
    image: lagosCarnivalImg,
    price: 10000,
    organizer: "Fashion Nigeria",
    attendees: 4500,
    category: "exhibitions",
    ticketTypes: [
      { name: "General", price: 10000, quantity: 3000, sold: 2600 },
      { name: "Front Row", price: 30000, quantity: 500, sold: 420 },
    ],
  },
];
