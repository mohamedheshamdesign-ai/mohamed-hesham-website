/**
 * One-off content migration: adds the optional editorial case study
 * fields to every project folder. Run with `node scripts/enrich-content.mjs`.
 *
 * Every value below is taken from the existing, already-verified copy in
 * each project.json (title, description, solution) or from the artwork
 * itself (the Al Mashreq palette appears on its own colour-palette page).
 */
import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "content", "works");

const extras = {
  "al-mashreq": {
    client: "Al Mashreq For Chemicals",
    sector: "Agriculture & Fertilizers",
    services: [
      "Brand identity",
      "Brand guidelines",
      "Print design",
    ],
    deliverables: [
      "Logo suite (English & Arabic)",
      "Logo construction & usage rules",
      "Colour palette with tint ladders",
      "Bilingual typography system",
      "Patterns & textures",
      "Brand guidelines document",
      "Business cards",
      "Letterheads",
      "Folders & envelopes",
      "Branded mugs & apparel",
    ],
    palette: [
      { name: "Vermilion (Plochere)", value: "#E74011" },
      { name: "USAFA Blue", value: "#004F9F" },
    ],
    ownsSharedMedia: true,
    chapters: [
      {
        title: "Introduction",
        note: "The company, the category, and what the identity had to achieve.",
        media: ["01.jpg", "02.jpg"],
      },
      {
        title: "Logo system",
        note: "One mark, two languages, and the rules that keep it consistent.",
        media: [
          "03.jpg",
          "04.jpg",
          "05.jpg",
          "06.jpg",
          "07.jpg",
          "08.jpg",
          "09.jpg",
        ],
      },
      {
        title: "Colour",
        note: "Two brand colours, each extended with a ladder of tints for print.",
        media: ["10.jpg", "11.jpg"],
      },
      {
        title: "Typography",
        note: "A bilingual pairing so English and Arabic carry the same weight.",
        media: ["12.jpg", "13.jpg", "14.jpg"],
      },
      {
        title: "Brand elements",
        note: "Patterns and textures derived from the sun symbol.",
        media: ["15.jpg", "16.jpg", "17.jpg", "18.jpg"],
      },
      {
        title: "Applications",
        note: "The identity taken into everyday business use.",
        media: [
          "19.jpg",
          "20.jpg",
          "21.jpg",
          "22.jpg",
          "23.jpg",
        ],
      },
    ],
  },

  alitalia: {
    client: "Alitalia Clean Tools",
    sector: "Cleaning tools & home care",
    services: [
      "Printing",
      "Packaging",
      "Brand applications",
    ],
    deliverables: [
      "Product packaging",
      "Scouring pad packs",
      "Mop & cleaning tool packaging",
      "Microfiber product boxes",
      "Retail materials",
      "Cards",
      "Promotional & social designs",
    ],
  },

  "atractive-collection": {
    client: "Atractive Collection",
    sector: "Beauty & personal care",
    services: [
      "Brand identity",
      "Brand guidelines",
      "Packaging design",
      "Stationery",
    ],
    deliverables: [
      "Primary logo, mark & variant",
      "Cream & gold colour palette",
      "Typography system (Latin & Arabic)",
      "Floral patterns & textures",
      "Beauty product packaging",
      "Stationery suite",
      "Branded merchandise",
    ],
  },

  "diana-essential-body-hair-care": {
    client: "Diana Essential Body & Hair Care",
    sector: "Body & hair care",
    services: [
      "Brand identity",
      "Packaging design",
      "Product design",
    ],
    deliverables: [
      "Bath & shower gel packaging (1000 ml)",
      "Per-variant colour & imagery system",
      "Bilingual label structure",
      "Recurring product messaging",
    ],
  },

  everest: {
    client: "Everest Professional",
    sector: "Professional hair & beauty care",
    services: [
      "Branding",
      "Packaging design",
      "Print",
    ],
    deliverables: [
      "Logo development",
      "Packaging design",
      "Product labels",
      "Box structures & dielines",
      "Stickers",
      "Business cards",
    ],
  },

  "infinity-connect-group": {
    client: "Infinity Connect Group",
    sector: "Telecommunications & ICT",
    services: [
      "Brand identity",
      "Brand guidelines",
      "Corporate brochure",
      "Editorial design",
    ],
    deliverables: [
      "Corporate brand guideline",
      "Logo suite & usage rules",
      "Typography & colour standards",
      "Connectivity brand patterns",
      "31-page 2026 corporate brochure",
    ],
  },

  "memo-trips": {
    client: "MEMO trips",
    sector: "Travel & tourism",
    services: [
      "Brand identity",
      "Brand guidelines",
      "Travel branding",
      "UI/UX design",
    ],
    deliverables: [
      "Logo suite (primary, secondary, horizontal, vertical, monochrome)",
      "Brand guidelines",
      "Colour & typography system",
      "Responsive website",
      "Mobile application",
    ],
  },

  "olive-branch": {
    client: "Olive Branch",
    sector: "Spices & seasonings",
    services: [
      "Printing",
      "Packaging",
      "Brand applications",
    ],
    deliverables: [
      "Brand identity",
      "Product sticker labels",
      "Social media compositions",
    ],
  },

  ultrascan: {
    client: "Ultrascan",
    sector: "Medical & diagnostics",
    services: [
      "Social media design",
      "Outdoor advertising",
      "Editorial design",
      "Stationery",
      "Print design",
    ],
    deliverables: [
      "250+ social media designs",
      "Billboard & outdoor advertising",
      "Full vehicle branding",
      "Professional certificates",
      "Educational books",
      "Branded stationery",
    ],
  },
};

for (const [slug, extra] of Object.entries(extras)) {
  const file = path.join(root, slug, "project.json");

  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  // Keep the original key order stable, then append the new fields.
  const merged = { ...data, ...extra };

  fs.writeFileSync(
    file,
    JSON.stringify(merged, null, 2) + "\n",
    "utf8"
  );

  console.log(`updated ${slug}`);
}
