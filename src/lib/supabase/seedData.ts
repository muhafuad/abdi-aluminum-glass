import type {
  Product,
  Service,
  Project,
  ProjectImage,
  QuoteRequest,
  ContactMessage,
  Testimonial,
  SiteSettings,
} from "../../lib//types/database";

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  company_name: "Abdi Aluminum & Glass",
  phone: "[Phone Number — Configure in Admin]",
  whatsapp_number: "[WhatsApp Number — Configure in Admin]",
  email: "[email@example.com — Configure in Admin]",
  address: "[Business Address, Addis Ababa, Ethiopia — Configure in Admin]",
  working_hours: "[Monday – Saturday: 8:00 AM – 6:00 PM — Configure in Admin]",
  facebook: "",
  instagram: "",
  telegram: "",
  tiktok: "",
  logo: "",
  favicon: "",
  hero_label: "ALUMINUM & GLASS SOLUTIONS",
  hero_headline: "Built With Precision. Designed to Last.",
  hero_subtext:
    "Professional aluminum and glass fabrication, supply, and precision architectural installation for commercial, residential, and corporate spaces.",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Architectural Thermal Break Aluminum Profiles",
    slug: "architectural-thermal-break-aluminum-profiles",
    category: "Aluminum Profiles",
    short_description:
      "High-performance extruded aluminum profile systems designed for optimal thermal insulation and structural longevity.",
    description:
      "Engineered architectural aluminum sections with advanced polyamide thermal break insulation. Available in electrostatically powder-coated, anodized charcoal, and dark bronze finishes. Ideal for modern commercial facades, structural window frames, and exterior curtain walls requiring high structural rigidity and wind-load resistance.",
    image_url:
      "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
    featured: true,
    is_active: true,
    sort_order: 1,
    specifications: {
      "Alloy Grade": "6063-T5 / 6063-T6 Architectural Grade",
      "Surface Finishing": "Electrostatically Powder-Coated / Anodized",
      "Profile Thickness": "1.4mm – 3.0mm structural standard",
      Application: "Window walls, facade mullions, heavy-duty door frames",
    },
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Tempered & Laminated Safety Architectural Glass",
    slug: "tempered-laminated-safety-architectural-glass",
    category: "Glass",
    short_description:
      "Thermally toughened and PVB laminated safety glass engineered for high impact strength, acoustic reduction, and solar control.",
    description:
      "Precision cut and polished architectural safety glass. Manufactured according to strict structural safety standards. Can be configured as clear float, tinted solar control (grey/bronze), reflective, or double-glazed insulated glass units (IGU) with argon gas filling for superior acoustic and thermal management.",
    image_url: "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    featured: true,
    is_active: true,
    sort_order: 2,
    specifications: {
      "Glass Types":
        "Tempered Monolithic, Laminated Safety (PVB), Insulated Double Glazing (IGU)",
      "Thickness Range": "6mm, 8mm, 10mm, 12mm, 19mm",
      "Edge Finishing": "Flat polished, beveled, CNC waterjet cutouts",
      Compliance: "High impact safety & structural wind resistance",
    },
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Heavy-Duty Aluminum Commercial Pivot Doors",
    slug: "heavy-duty-aluminum-commercial-pivot-doors",
    category: "Aluminum Doors",
    short_description:
      "Architectural heavy-traffic commercial entrance door systems with concealed overhead closers and reinforced aluminum stile profiles.",
    description:
      "Designed for high-traffic retail storefronts, corporate office towers, and institutional entrances. Fabricated with precision mitered corners, reinforced internal corner brackets, hydraulic floor springs or concealed transom closers, and high-security multipoint mortise locks.",
    image_url:
      "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
    featured: true,
    is_active: true,
    sort_order: 3,
    specifications: {
      "Frame Material": "Heavy-wall extruded aluminum 2.0mm",
      Hardware:
        "Concealed hydraulic floor spring, stainless steel push/pull handles",
      Infill: "10mm / 12mm tempered safety glass or insulated panel",
      "Max Leaf Size": "Up to 1.4m width x 3.2m height per leaf",
    },
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Slim-Profile Minimalist Sliding Window Systems",
    slug: "slim-profile-minimalist-sliding-window-systems",
    category: "Aluminum Windows",
    short_description:
      "Precision-engineered sliding and casement window systems featuring ultra-narrow sightlines and weather-sealed multi-point locks.",
    description:
      "Modern architectural sliding and tilt-turn window assemblies offering maximum daylight transmission and exceptional water-tightness. Equipped with heavy-duty stainless steel ball-bearing rollers, EPDM synthetic rubber perimeter gaskets, and integrated fly screens.",
    image_url:
      "/src/assets/images/project_residential_curtain_wall_1790866949457.jpg",
    featured: true,
    is_active: true,
    sort_order: 4,
    specifications: {
      Configurations:
        "2-track, 3-track sliding, side-hung casement, top-hung awning",
      "Acoustic Rating":
        "Engineered sound attenuation up to 36dB with double glazing",
      Weatherproofing: "Twin EPDM compression gaskets with concealed drainage",
      Locking: "Integrated flush lock or multipoint espagnolette handle",
    },
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Frameless Tempered Glass Entrance & Shower Doors",
    slug: "frameless-tempered-glass-entrance-doors",
    category: "Glass Doors",
    short_description:
      "Minimalist 10mm-12mm frameless tempered glass doors with premium stainless steel patch fittings and handles.",
    description:
      "Clean, transparent architectural glass doors for executive meeting rooms, retail showrooms, luxury residential bathrooms, and interior transitions. Features precision stainless steel 304/316 hardware, soft-closing hydraulic patch hinges, and satin brushed or matte black architectural finishes.",
    image_url:
      "/src/assets/images/service_glass_partition_office_1790866970041.jpg",
    featured: false,
    is_active: true,
    sort_order: 5,
    specifications: {
      "Glass Specification": "10mm or 12mm clear / low-iron toughened glass",
      Fittings:
        "Grade 304 stainless steel patch fittings, top pivot, floor spring",
      "Handle Options":
        "Tubular pull handles (450mm – 1200mm), D-pulls, recessed flush rings",
      Lock: "Bottom corner patch cylinder lock with floor keeper",
    },
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Architectural Hardware & EPDM Weather Gaskets",
    slug: "architectural-hardware-and-epdm-gaskets",
    category: "Accessories & Hardware",
    short_description:
      "Precision hardware, multipoint locks, stainless steel hinges, friction stays, and high-grade EPDM sealing profiles.",
    description:
      "Comprehensive line of commercial-grade architectural accessories for aluminum fabrication shops and site contractors. Includes friction stays for projecting windows, heavy-capacity sliding rollers, door closers, structural silicone sealants, and vulcanized EPDM weatherstripping.",
    image_url:
      "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
    featured: false,
    is_active: true,
    sort_order: 6,
    specifications: {
      Materials: "Stainless Steel AISI 304, Zinc Alloy, Extruded EPDM",
      Compatibility: "Universal architectural groove standard 15/20mm",
      "Durability Tested": "Cycle tested to 50,000+ operations",
      "Weather Resistance":
        "UV-resistant and ozone-resistant synthetic polymers",
    },
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "serv-1",
    name: "Aluminum Fabrication",
    slug: "aluminum-fabrication",
    short_description:
      "Custom precision workshop cutting, CNC milling, corner crimping, and assembly of architectural aluminum sections.",
    description:
      "Our in-house fabrication facility executes precision cutting, pneumatic corner crimping, milling for architectural hardware, and structural framing assembly according to exact engineering drawings. Every profile is measured, mitered, and tested to ensure tight tolerances and structural integrity before dispatch.",
    image_url:
      "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
    featured: true,
    is_active: true,
    sort_order: 1,
    deliverables: [
      "Precision miter cutting and mechanical corner assembly",
      "Hardware preparation, lock routing, and hinge mortising",
      "Epoxy-reinforced corner brackets for structural rigidity",
      "Quality inspection and protective film application prior to dispatch",
    ],
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-2",
    name: "Glass Installation",
    slug: "glass-installation",
    short_description:
      "Certified on-site installation of tempered, laminated, double-glazed, and structural silicone glazed glass panels.",
    description:
      "Safe, professional rigging, handling, and fixing of architectural glass panels for commercial facades, skylights, balustrades, and high-rise openings. Our certified field installation team uses professional vacuum lifting gear, structural sealants, and precision leveling instruments to ensure watertight, wind-tested performance.",
    image_url: "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    featured: true,
    is_active: true,
    sort_order: 2,
    deliverables: [
      "Site rigging and glass vacuum crane positioning",
      "Structural silicone glazing (SSG) and perimeter weather sealing",
      "Setting blocks and thermal expansion gap calibration",
      "Post-installation water infiltration testing and handover",
    ],
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-3",
    name: "Aluminum Doors & Windows",
    slug: "aluminum-doors-and-windows",
    short_description:
      "Turnkey design, custom fabrication, and site fitting of architectural sliding, casement, and folding systems.",
    description:
      "Complete door and window solutions tailored for residential villas, apartment complexes, and office buildings. We supply and install heavy-gauge sliding doors, French casements, tilt-and-turn windows, and multi-panel bi-fold glass wall assemblies with high thermal and sound dampening properties.",
    image_url:
      "/src/assets/images/project_residential_curtain_wall_1790866949457.jpg",
    featured: true,
    is_active: true,
    sort_order: 3,
    deliverables: [
      "Comprehensive on-site opening measurement verification",
      "Sub-frame installation and damp-proof membrane integration",
      "High-grade multipoint lock and friction stay adjustment",
      "Complete weatherstripping and perimeter siliconing",
    ],
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-4",
    name: "Glass Partitions",
    slug: "glass-partitions",
    short_description:
      "Modern acoustic glass wall partitions and frameless divider systems for contemporary office and commercial interiors.",
    description:
      "Transform work environments with elegant glass partition systems that promote transparency while maintaining acoustic privacy. We engineer floor-to-ceiling single and double glazed wall systems with slimline aluminum channels, integrated pivot or sliding glass doors, and frosted privacy designs.",
    image_url:
      "/src/assets/images/service_glass_partition_office_1790866970041.jpg",
    featured: true,
    is_active: true,
    sort_order: 4,
    deliverables: [
      "Acoustic rating optimization up to Rw 42dB",
      "Slimline perimeter aluminum channels in anodized or powder-coated finishes",
      "Frameless glass-to-glass dry joint tape or polycarbonate I-profile",
      "Custom sandblasted, acid-etched, or frosted film privacy bands",
    ],
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-5",
    name: "Storefronts",
    slug: "storefronts",
    short_description:
      "High-visibility architectural aluminum and glass storefront entrances for retail centers, showrooms, and commercial plazas.",
    description:
      "Create commanding, inviting retail street facades and mall storefronts with large unobstructed vision glass panels and heavy-duty entrance systems. We build durable framing engineered to withstand continuous foot traffic, wind load pressure, and security demands.",
    image_url:
      "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
    featured: false,
    is_active: true,
    sort_order: 5,
    deliverables: [
      "Full height tempered clear architectural display glass",
      "Heavy-duty commercial pivot entrance doors with panic hardware options",
      "Integrated transom headers and signage mounting provisions",
      "Robust security locking systems and floor spring alignment",
    ],
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-6",
    name: "Curtain Wall Systems",
    slug: "curtain-wall-systems",
    short_description:
      "Engineered structural aluminum stick and unitized curtain wall envelopes for multi-story commercial and civic buildings.",
    description:
      "Comprehensive building envelope engineering and installation. We specialize in pressure-equalized stick curtain wall systems, semi-unitized facades, and spider-glass fittings designed to optimize energy efficiency, structural wind resistance, and modern architectural aesthetics.",
    image_url: "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    featured: false,
    is_active: true,
    sort_order: 6,
    deliverables: [
      "Structural aluminum vertical mullion and horizontal transom grid layout",
      "Thermal break isolator bars and pressure plate capping",
      "EPDM continuous perimeter drainage and weep hole routing",
      "Double-glazed solar control Low-E unit integration",
    ],
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "serv-7",
    name: "Custom Aluminum & Glass Projects",
    slug: "custom-aluminum-and-glass-projects",
    short_description:
      "Specialized architectural metalwork, glass skylights, structural balustrades, and bespoke architectural assemblies.",
    description:
      "When project specifications require tailored metalwork or bespoke glazing, our engineering and fabrication team provides custom solutions. From architectural glass canopies and stair balustrades to specialized skylights and louvered screening systems, we build to custom architect specifications.",
    image_url:
      "/src/assets/images/project_residential_curtain_wall_1790866949457.jpg",
    featured: false,
    is_active: true,
    sort_order: 7,
    deliverables: [
      "Custom structural steel/aluminum composite brackets",
      "Laminated glass canopies with stainless steel spider fittings",
      "Structural glass balustrades with base shoe channels or standoff pins",
      "Architectural sun louvers and mechanical ventilation grilles",
    ],
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Commercial Plaza Storefront & Heavy Entrance System",
    slug: "commercial-plaza-storefront-entrance",
    category: "Commercial",
    location: "Bole District, Addis Ababa",
    short_description:
      "Full perimeter ground floor glass storefront facade featuring custom heavy-duty black aluminum pivot doors.",
    description:
      "A comprehensive commercial facade package executed with precision engineering. The installation encompasses over 180 square meters of 12mm clear tempered architectural safety glass fitted into custom dark charcoal anodized aluminum frames, along with dual heavy-duty commercial entrance pivot doors equipped with hydraulic floor closers and architectural stainless steel pull bars.",
    cover_image:
      "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
    featured: true,
    is_published: true,
    scope:
      "Storefront framing, 12mm tempered safety glass, commercial pivot doors, perimeter weather sealing",
    completion_year: "2025",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "Modern Residential Villa Sliding Glass & Balconies",
    slug: "modern-residential-villa-sliding-glass",
    category: "Residential",
    location: "CMC Residential Area, Addis Ababa",
    short_description:
      "Floor-to-ceiling slim profile thermal break sliding glass doors and minimalist frameless glass balustrades.",
    description:
      "Bespoke residential architectural installation for a modern private residence. Includes floor-to-ceiling 3-track sliding glass door assemblies with acoustic double glazing (6mm + 12A + 6mm Low-E), concealed flush threshold tracks for seamless terrace transitions, and 12mm laminated structural glass balcony railings anchored in anodized aluminum base channels.",
    cover_image:
      "/src/assets/images/project_residential_curtain_wall_1790866949457.jpg",
    featured: true,
    is_published: true,
    scope:
      "Slim-profile sliding doors, double glazing, structural glass railings, casement bedroom windows",
    completion_year: "2025",
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "Corporate Headquarters Acoustic Glass Partitions",
    slug: "corporate-headquarters-glass-partitions",
    category: "Office",
    location: "Kazanchis Business Center, Addis Ababa",
    short_description:
      "Acoustic frameless glass conference room dividers and matte black aluminum framed executive office suites.",
    description:
      "Internal architectural fit-out covering three floors of executive office space. Delivered 240 linear meters of acoustic double-glazed glass partitions with concealed aluminum head and base channels, acoustic drop seals on pivot glass doors, and custom horizontal privacy frosting bands.",
    cover_image:
      "/src/assets/images/service_glass_partition_office_1790866970041.jpg",
    featured: true,
    is_published: true,
    scope:
      "Acoustic glass partitions, frameless pivot doors, stainless steel hardware, custom frosting",
    completion_year: "2024",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "Commercial Multi-Level Curtain Wall & Window Wall",
    slug: "commercial-multi-level-curtain-wall",
    category: "Commercial",
    location: "Mexico Square Area, Addis Ababa",
    short_description:
      "Engineered structural aluminum stick curtain wall system with high-performance solar reflective double glazing.",
    description:
      "External building envelope installation for a prominent multi-story commercial development. Designed and fabricated with 50mm face width structural aluminum mullions, pressure plate exterior caps, and 24mm solar control reflective insulated glass units to minimize heat gain and solar glare.",
    cover_image:
      "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    featured: true,
    is_published: true,
    scope:
      "Structural stick curtain wall, pressure capping, solar control double glazing, top-hung awning vents",
    completion_year: "2024",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-5",
    title: "Retail Showroom Glass Storefront & Display Windows",
    slug: "retail-showroom-storefront",
    category: "Storefront",
    location: "Sarbet Commercial Strip, Addis Ababa",
    short_description:
      "High-transparency low-iron glass storefront system with heavy-duty aluminum framing and wide entrance opening.",
    description:
      "Designed for optimal retail visibility, this showroom storefront utilizes 10mm low-iron ultra-clear tempered glass panels and custom powder-coated charcoal aluminum frames. The entrance features a 2.8m high double-leaf swing door system with concealed hydraulic door closers.",
    cover_image:
      "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
    featured: false,
    is_published: true,
    scope:
      "Low-iron display glazing, commercial aluminum framing, high-traffic pivot hardware",
    completion_year: "2024",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-6",
    title: "Custom Architectural Skylight & Interior Atrium Glazing",
    slug: "custom-architectural-skylight-atrium",
    category: "Custom Projects",
    location: "Old Airport Area, Addis Ababa",
    short_description:
      "Custom sloped aluminum glazed skylight structure and interior glass bridge balustrades.",
    description:
      "A custom engineered sloped skylight assembly spanning 45 square meters above a central residential atrium. Engineered with structural aluminum rafter profiles, laminated tempered safety glass with PVB solar interlayers, and internal condensation gutters.",
    cover_image:
      "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
    featured: false,
    is_published: true,
    scope:
      "Structural aluminum skylight rafters, laminated safety glass, perimeter flashing, atrium balustrade",
    completion_year: "2024",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PROJECT_IMAGES: ProjectImage[] = [
  {
    id: "pimg-1",
    project_id: "proj-1",
    image_url:
      "/src/assets/images/project_commercial_storefront_1790866938051.jpg",
    alt_text:
      "Commercial storefront entrance facade with black aluminum pivot doors",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "pimg-2",
    project_id: "proj-1",
    image_url: "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    alt_text: "Detailed view of glass facade mullion alignment",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "pimg-3",
    project_id: "proj-2",
    image_url:
      "/src/assets/images/project_residential_curtain_wall_1790866949457.jpg",
    alt_text: "Minimalist sliding glass doors in modern residential terrace",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "pimg-4",
    project_id: "proj-2",
    image_url:
      "/src/assets/images/product_aluminum_profile_fabrication_1790866959417.jpg",
    alt_text: "Architectural aluminum profile precision joinery",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "pimg-5",
    project_id: "proj-3",
    image_url:
      "/src/assets/images/service_glass_partition_office_1790866970041.jpg",
    alt_text: "Corporate office glass partition with slimline black framing",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "pimg-6",
    project_id: "proj-4",
    image_url: "/src/assets/images/hero_architectural_facade_1790866925385.jpg",
    alt_text: "Multi-level commercial curtain wall facade elevation",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_QUOTE_REQUESTS: QuoteRequest[] = [
  {
    id: "quote-1",
    full_name: "Solomon Tesfaye",
    phone: "+251 91 123 4567",
    email: "solomon.tesfaye@example.com",
    project_type: "Commercial Storefront & Entrance",
    location: "Bole Sub-City, Addis Ababa",
    message:
      "We are developing a 4-unit ground floor commercial retail building and require quote for full front aluminum profile frames and 12mm tempered safety glass doors.",
    project_size: "Approximately 95 sqm of glass and 4 commercial pivot doors",
    preferred_contact_method: "phone",
    attachment_url: "",
    status: "new",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "quote-2",
    full_name: "Bethlehem Haile",
    phone: "+251 92 987 6543",
    email: "b.haile@example.com",
    project_type: "Residential Sliding Doors & Windows",
    location: "CMC Area, Addis Ababa",
    message:
      "Looking for high quality thermal break aluminum windows and floor-to-ceiling sliding glass doors for a G+2 residential villa currently nearing plastering stage.",
    project_size: "14 window openings and 3 sliding terrace doors",
    preferred_contact_method: "whatsapp",
    attachment_url: "",
    status: "contacted",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "quote-3",
    full_name: "Dawit Mengistu",
    phone: "+251 93 456 7890",
    email: "dmengistu@example.com",
    project_type: "Office Glass Partitions",
    location: "Kazanchis, Addis Ababa",
    message:
      "Need acoustic glass partitions for 6 executive offices and 1 main boardroom. Require matte black slim profile aluminum channel finish.",
    project_size: "75 linear meters of acoustic partition wall",
    preferred_contact_method: "email",
    attachment_url: "",
    status: "in_progress",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    full_name: "Ephrem Girma",
    phone: "+251 91 555 1234",
    email: "ephrem.g@example.com",
    subject: "Inquiry regarding curtain wall profile specifications",
    message:
      "Hello Abdi Aluminum & Glass team, could you please provide details on your stock availability for structural curtain wall extrusions and delivery timelines?",
    status: "new",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "msg-2",
    full_name: "Marta Assefa",
    phone: "+251 94 222 3456",
    email: "marta.assefa@example.com",
    subject: "Consultation request for residential project in Addis Ababa",
    message:
      "Good morning. We would like to arrange a site assessment for custom glass balustrades and entrance canopy for our home.",
    status: "read",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    customer_name: "Ato Yonas Kebede",
    company: "Commercial Property Developer",
    content:
      "Abdi Aluminum & Glass handled the storefront fabrication and heavy commercial entrance doors for our commercial building. The precision in corner crimping and glass alignment is top standard.",
    rating: 5,
    is_published: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "test-2",
    customer_name: "W/ro Selamawit Abebe",
    company: "Architectural Consultant",
    content:
      "We specified their slimline sliding door systems and acoustic office glass partitions. Professional execution, accurate site measurements, and reliable post-installation support.",
    rating: 5,
    is_published: true,
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "test-3",
    customer_name: "Ato Michael Tadesse",
    company: "Private Residence Owner",
    content:
      "The quality of the thermal break aluminum frames and double-glazed patio doors exceeded expectations. Noise reduction in our home has been remarkable.",
    rating: 5,
    is_published: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];
