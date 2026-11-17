/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Single source of truth for ALL site content.
 *  Portfolio identity, achievements, and projects supplied by Samruddhi.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const driver = {
  firstName: "SAMRUDDHI",
  lastName: "NIUNGARE",
  fullName: "Samruddhi Niungare",
  initials: "SN",
  number: "27",
  role: "B.Tech · Artificial Intelligence & Machine Learning",
  roles: ["AI & ML Engineer", "Machine Learning Builder", "Student Leader"],
  tagline: "Building with Intelligence. Leading with Creativity. Growing with Purpose.",
  location: "Palghar, Maharashtra, India",
  email: "niungaresamruddhi@gmail.com",
  github: "https://github.com/samruddhiniungare-cpu",
  githubUser: "samruddhiniungare-cpu",
  linkedin: "https://www.linkedin.com/in/samruddhi-niungare-patil-97b922399",
  resume: "/resume.pdf", // public/resume.pdf — your real CV
  available: true,
};

/** Optional backends — read from Vite env vars; site works offline when blank.
 *  VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — for Phase 2+ Supabase integration.
 *  VITE_LEADERBOARD_ENDPOINT — legacy fallback endpoint (replaced by Supabase in Phase 4). */
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? "";
export const LEADERBOARD_ENDPOINT = import.meta.env.VITE_LEADERBOARD_ENDPOINT ?? "";

export const about = {
  paragraphs: [
    "I’m a B.Tech student pursuing Artificial Intelligence and Machine Learning, passionate about building intelligent solutions and developing ML models from scratch. I turn ideas into practical applications through Python, AI, and hands-on experimentation.",
    "Beyond technology, I lead co-curricular initiatives across student leadership, event management, research, and cultural performances. As Vice President of ASCAI and Joint Secretary & Club Service Director at Rotaract Club of Palghar, I thrive on teamwork, creativity, and taking initiative.",
    "I believe in continuous learning, stepping beyond my comfort zone, and combining technology with creativity to make a meaningful impact.",
  ],
  topLanguages: ["PYTHON", "AI / ML", "LEADERSHIP"],
  radar: [
    { axis: "PYTHON", value: 86 },
    { axis: "MACHINE LEARNING", value: 88 },
    { axis: "RESEARCH", value: 80 },
    { axis: "LEADERSHIP", value: 92 },
    { axis: "CREATIVITY", value: 90 },
  ],
};

export type Experience = {
  position: string;
  seasons: string;
  role: string;
  company: string;
  type: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    position: "P1",
    seasons: "2026–27",
    role: "Vice President · ASCAI",
    company: "Artificial Intelligence & Computer Science Association of India",
    type: "STUDENT LEADERSHIP",
    points: [
      "Lead student initiatives and encourage peers to explore AI and computer science.",
      "Bring people together around technical learning, collaboration, and creative ideas.",
    ],
    stack: ["Leadership", "AI Community", "Teamwork"],
  },
  {
    position: "P2",
    seasons: "2026–27",
    role: "Joint Secretary & Club Service Director",
    company: "Rotaract Club of Palghar",
    type: "SERVICE & EVENT LEADERSHIP",
    points: [
      "Coordinate club service initiatives and support community-focused activities.",
      "Organise events, align teams, and turn plans into welcoming experiences.",
    ],
    stack: ["Event Management", "Organisation", "Service"],
  },
  {
    position: "P3",
    seasons: "2026",
    role: "ISRO Exhibition Representative",
    company: "St. John College of Engineering and Management",
    type: "ACADEMIC REPRESENTATION",
    points: [
      "Represented the college at ISRO Exhibition 2026 during a three-day programme.",
      "Shared the institution’s work and engaged with visitors at the exhibition.",
    ],
    stack: ["Communication", "Representation", "STEM"],
  },
  {
    position: "P4",
    seasons: "ONGOING",
    role: "Anveshnam Research Initiative",
    company: "St. John College of Engineering and Management",
    type: "RESEARCH & WRITING",
    points: [
      "Contribute to a research initiative focused on inquiry, exploration, and academic writing.",
      "Develop AI/ML models and apply classroom concepts through practical experimentation.",
    ],
    stack: ["Research", "AI / ML", "Model Development"],
  },
  {
    position: "P5",
    seasons: "2 YEARS",
    role: "MEGALEIO Technical Event",
    company: "St. John College of Engineering and Management",
    type: "TECHNICAL EVENT & CAMPUS CULTURE",
    points: [
      "Participated in MEGALEIO for two years, supporting the college’s technical event culture.",
      "Also take part in dance, cultural performances, and state-level sports participation.",
    ],
    stack: ["Co-curricular", "Dance", "Sports"],
  },
];

export type Project = {
  round: string;
  name: string;
  repo?: string;
  year: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  /** Published paper / write-up link — renders a "PAPER ↗" pill when set. */
  paper?: string;
  /** Thumbnail on the pit-wall monitor. Drop/replace the file in
   *  public/projects/ (keep the same filename) or point this at any path/URL. */
  image?: string;
  /** Extra shots in the click-through detail overlay (shown above the thumbnail).
   *  Drop/replace files in public/projects/ (e.g. aris-detail.png, aris-detail2.png). */
  detailImages?: string[];
  trackId: number;
  featured?: boolean;
  status?: string;
};

export const projects: Project[] = [
  {
    round: "R1",
    name: "Intelligent Bug Detector",
    year: "AI / ML",
    description: "An AI/ML project focused on identifying software bugs and helping developers surface issues earlier.",
    stack: ["Python", "Machine Learning", "AI"],
    trackId: 5,
    status: "PROJECT",
  },
  {
    round: "R2",
    name: "Taxation Calculator",
    year: "PYTHON",
    description: "A practical calculator project that applies programming fundamentals to common taxation calculations.",
    stack: ["Python", "Calculations", "Application"],
    trackId: 1,
    status: "PROJECT",
  },
  {
    round: "R3",
    name: "Autonomous Routing System",
    year: "AI / NETWORKS",
    description: "An AI-based network routing system exploring autonomous decisions and efficient data paths.",
    stack: ["AI", "Networking", "Python"],
    trackId: 0,
    featured: true,
    status: "PROJECT",
  },
  {
    round: "R4",
    name: "Smart Traffic Signal Optimisation",
    year: "DISTRIBUTED CONTROL",
    description: "A smart traffic signal optimisation concept using distributed control to improve traffic flow.",
    stack: ["Python", "AI / ML", "Distributed Control"],
    trackId: 2,
    status: "PROJECT",
  },
];

export const coreSkills = [
  { name: "Python Programming", value: 86 },
  { name: "Machine Learning", value: 88 },
  { name: "AI Model Development", value: 84 },
  { name: "Research & Experimentation", value: 80 },
  { name: "Event Management", value: 90 },
  { name: "Team Leadership", value: 92 },
];

export const skillGroups = [
  { title: "PROGRAMMING", items: ["Python", "Java", "C", "C++"] },
  { title: "AI & MACHINE LEARNING", items: ["Model Development", "Applied ML", "AI Solutions", "Experimentation"] },
  { title: "CERTIFICATIONS", items: ["Google AI Essentials", "IBM Data Fundamentals", "Applied ML with Python", "Prompt Engineering & AI", "AI Skills Passport · EY & Microsoft"] },
  { title: "LEADERSHIP", items: ["ASCAI Vice President", "Rotaract Club Service", "Event Management"] },
  { title: "CREATIVE & CO-CURRICULAR", items: ["Research", "Dance", "Cultural Events", "State-Level Sports"] },
];

/** ── EXPLODED-VIEW GARAGE: every car part maps to a skill domain ── */
export type GaragePart = {
  id: string;
  part: string;
  domain: string;
  desc: string;
  tools: string[];
  offset: [number, number, number];
  anchor: [number, number, number];
};

export const garageParts: GaragePart[] = [
  {
    id: "frontwing",
    part: "FRONT WING",
    domain: "IDEAS INTO APPLICATIONS",
    desc: "The first point of contact: turning an idea into a useful, practical tool.",
    tools: ["Python", "AI Applications", "Hands-on Experimentation"],
    offset: [1.9, 0.1, 0],
    anchor: [2.5, 0.3, 0],
  },
  {
    id: "nose",
    part: "MONOCOQUE",
    domain: "PROGRAMMING FOUNDATIONS",
    desc: "A solid core for building, testing, and learning through code.",
    tools: ["Python", "Java", "C", "C++"],
    offset: [0.55, 0.25, 0],
    anchor: [1.3, 0.7, 0],
  },
  {
    id: "halo",
    part: "HALO",
    domain: "CONTINUOUS LEARNING",
    desc: "Building new skills through structured courses and practical exploration.",
    tools: ["Google AI Essentials", "IBM Data Fundamentals", "AI Skills Passport"],
    offset: [0.1, 1.25, 0],
    anchor: [0.55, 1.1, 0],
  },
  {
    id: "sidepods",
    part: "SIDEPODS",
    domain: "TEAMWORK & LEADERSHIP",
    desc: "Bringing people together to make student initiatives and club service happen.",
    tools: ["ASCAI Vice President", "Rotaract Club Service", "Event Management"],
    offset: [0, 0, 0],
    anchor: [-0.3, 0.6, 1.1],
  },
  {
    id: "power",
    part: "POWER UNIT",
    domain: "AI & DATA",
    desc: "Exploring intelligent systems and developing machine learning models from scratch.",
    tools: ["Artificial Intelligence", "Machine Learning", "Applied ML with Python"],
    offset: [-0.5, 0.95, 0],
    anchor: [-0.8, 1.0, 0],
  },
  {
    id: "floor",
    part: "FLOOR",
    domain: "RESEARCH & EXPERIMENTATION",
    desc: "Exploring questions, writing, and learning through hands-on work.",
    tools: ["Anveshnam", "Research Initiative", "Model Development"],
    offset: [0.1, -0.85, 0],
    anchor: [0.1, -0.4, 0.8],
  },
  {
    id: "rearwing",
    part: "REAR WING · DRS",
    domain: "CULTURE & PERFORMANCE",
    desc: "Taking part in the cultural life of campus and beyond.",
    tools: ["Dance", "Cultural Performances", "State-Level Sports"],
    offset: [-1.8, 0.4, 0],
    anchor: [-2.4, 1.3, 0],
  },
];

export const liveries = [
  { name: "Rosso", hex: "#e10600" },
  { name: "Papaya", hex: "#ff8000" },
  { name: "Volt", hex: "#27d9c5" },
  { name: "Apex", hex: "#3671c6" },
];

/** unlocked by finishing a lap or typing the cheat — persisted */
export const GOLD_LIVERY = { name: "Champion Gold", hex: "#d4af37" };

export const nav = [
  { id: "about", label: "About" },
  { id: "garage", label: "Garage" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/** seeded arcade rivals — clearly labelled as bots in the UI */
export const ARCADE_BOTS = {
  reaction: [
    { name: "APX", ms: 168 },
    { name: "VER", ms: 184 },
    { name: "NOR", ms: 213 },
    { name: "HAM", ms: 241 },
  ],
  pitstop: [
    { name: "RBR", ms: 1820 },
    { name: "FER", ms: 2240 },
    { name: "MCL", ms: 2510 },
  ],
  hotlap: [
    { name: "APX", ms: 38500 },
    { name: "GRD", ms: 54300 },
    { name: "PIT", ms: 76800 },
  ],
  gridrun: [
    { name: "APX", ms: 528000 }, // ~7,200 pts — the house ghost, hard to beat
    { name: "VER", ms: 543000 }, // ~5,700 pts
    { name: "LEC", ms: 558000 }, // ~4,200 pts
    { name: "NOR", ms: 571000 }, // ~2,900 pts
    { name: "HAM", ms: 585000 }, // ~1,500 pts — beatable in a first clean run
  ],
};

/** hot-lap tour captions, keyed by scroll progress */
export const TOUR_CAPTIONS: { at: number; text: string }[] = [
  { at: 0.0, text: "LIGHTS OUT. Samruddhi Niungare. AI & ML student building with purpose." },
  { at: 0.1, text: "SECTOR 01. Intelligence, creativity, and leadership in the same cockpit." },
  { at: 0.24, text: "SECTOR 02. The garage. Every part maps to a real skill." },
  { at: 0.42, text: "SECTOR 03. Student leadership, research, ISRO, and campus events." },
  { at: 0.58, text: "SECTOR 04. The Race Track. Career milestones and achievements." },
  { at: 0.76, text: "SECTOR 05. Python, model development, experimentation, and teamwork." },
  { at: 0.9, text: "FINAL SECTOR. Let's build something meaningful with AI." },
];
