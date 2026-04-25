export interface City {
  id: string;
  name: string;
  state: string;
}

export interface State {
  id: string;
  name: string;
  cities: City[];
}

export const locations: State[] = [
  {
    id: "lagos",
    name: "Lagos",
    cities: [
      { id: "vi", name: "Victoria Island", state: "Lagos" },
      { id: "lekki", name: "Lekki", state: "Lagos" },
      { id: "ajah", name: "Ajah", state: "Lagos" },
      { id: "ikoyi", name: "Ikoyi", state: "Lagos" },
      { id: "mainland", name: "Mainland", state: "Lagos" },
      { id: "surulere", name: "Surulere", state: "Lagos" },
      { id: "bariga", name: "Bariga", state: "Lagos" },
    ],
  },
  {
    id: "abuja",
    name: "FCT - Abuja",
    cities: [
      { id: "maitama", name: "Maitama", state: "FCT - Abuja" },
      { id: "wuse", name: "Wuse", state: "FCT - Abuja" },
      { id: "asokoro", name: "Asokoro", state: "FCT - Abuja" },
      { id: "garki", name: "Garki", state: "FCT - Abuja" },
      { id: "jabi", name: "Jabi", state: "FCT - Abuja" },
      { id: "nyanya", name: "Nyanya", state: "FCT - Abuja" },
    ],
  },
  {
    id: "rivers",
    name: "Rivers",
    cities: [
      { id: "port-harcourt", name: "Port Harcourt", state: "Rivers" },
      { id: "obio-akpor", name: "Obio-Akpor", state: "Rivers" },
      { id: "okrika", name: "Okrika", state: "Rivers" },
      { id: "bonny", name: "Bonny", state: "Rivers" },
    ],
  },
  {
    id: "kano",
    name: "Kano",
    cities: [
      { id: "kano-city", name: "Kano City", state: "Kano" },
      { id: "tarauni", name: "Tarauni", state: "Kano" },
      { id: "nassarawa", name: "Nassarawa", state: "Kano" },
      { id: "karaye", name: "Karaye", state: "Kano" },
    ],
  },
  {
    id: "oyo",
    name: "Oyo",
    cities: [
      { id: "ibadan", name: "Ibadan", state: "Oyo" },
      { id: "iseyin", name: "Iseyin", state: "Oyo" },
      { id: "oyo-town", name: "Oyo Town", state: "Oyo" },
      { id: "ogbomoso", name: "Ogbomoso", state: "Oyo" },
    ],
  },
  {
    id: "enugu",
    name: "Enugu",
    cities: [
      { id: "enugu-city", name: "Enugu City", state: "Enugu" },
      { id: "nsukka", name: "Nsukka", state: "Enugu" },
      { id: "awgu", name: "Awgu", state: "Enugu" },
    ],
  },
  {
    id: "edo",
    name: "Edo",
    cities: [
      { id: "benin-city", name: "Benin City", state: "Edo" },
      { id: "auchi", name: "Auchi", state: "Edo" },
      { id: "ubiaja", name: "Ubiaja", state: "Edo" },
    ],
  },
  {
    id: "anambra",
    name: "Anambra",
    cities: [
      { id: "onitsha", name: "Onitsha", state: "Anambra" },
      { id: "awka", name: "Awka", state: "Anambra" },
      { id: "nnewi", name: "Nnewi", state: "Anambra" },
    ],
  },
];
