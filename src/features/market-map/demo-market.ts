/**
 * Built-in DEMO market layout.
 *
 * The frontend talks to a separate backend for the real market data. When that
 * backend is unavailable (e.g. local dev without the API running), the map page
 * must still render a complete, believable market plan — the same way the
 * homepage degrades gracefully instead of showing an error.
 *
 * This is clearly-labelled sample data: gate / section codes echo the physical
 * wayfinding (Gate · Row), coordinates are spread around central Dushanbe, and
 * the stall names are illustrative. No real shop pages are linked from here.
 */
import type { MarketMapGate } from './market-map-api';

export interface DemoStall {
  id: string;
  name: string;
}

interface DemoSectionSeed {
  code: string;
  name: string;
  /** Small offset (in degrees) from the market center, for the geographic view. */
  d: [number, number];
  stalls: string[];
}

interface DemoGateSeed {
  code: string;
  name: string;
  sections: DemoSectionSeed[];
}

// Market center — central Dushanbe (public landmark area).
const CENTER: [number, number] = [68.782, 38.5605];

const SEED: DemoGateSeed[] = [
  {
    code: 'G1',
    name: 'Дарвозаи шимолӣ',
    sections: [
      {
        code: 'A',
        name: 'Кошину сафол',
        d: [-0.0016, 0.0012],
        stalls: ['Sohibkor Tiles', 'Pamir Ceramic', 'Navak Kafel', 'Orzu Safol'],
      },
      {
        code: 'B',
        name: 'Рангу лак',
        d: [-0.0004, 0.0013],
        stalls: ['Dushanbe Paint', 'Rang-Servis', 'Lak Mahal'],
      },
    ],
  },
  {
    code: 'G2',
    name: 'Дарвозаи ҷанубӣ',
    sections: [
      {
        code: 'C',
        name: 'Асбобҳои дастӣ',
        d: [0.0012, -0.0014],
        stalls: ['Pamir Tools', 'Usta Market', 'Bolt & Gayka', 'Instrument Plus', 'Tez Asbob'],
      },
      {
        code: 'D',
        name: 'Сантехника',
        d: [0.0022, -0.0008],
        stalls: ['Aqua Servis', 'Truba Mahal', 'San-Tex'],
      },
    ],
  },
  {
    code: 'G3',
    name: 'Дарвозаи марказӣ',
    sections: [
      {
        code: 'E',
        name: 'Маводи барқӣ',
        d: [0.0003, -0.0002],
        stalls: ['Nur Electro', 'Kabel Servis', 'Yorug Lampa', 'Volt Market'],
      },
      {
        code: 'F',
        name: 'Чӯбу тахта',
        d: [-0.0012, -0.0006],
        stalls: ['Chub Bazaar', 'Taxta Servis', 'Fanera Mahal'],
      },
    ],
  },
];

let built: { gates: MarketMapGate[]; shopsBySection: Map<string, DemoStall[]> } | null = null;

/**
 * Returns the demo gates (with coordinates) and a section → stalls map, built
 * once and memoised. Shops carry a stable id so React keys stay consistent.
 */
export function getDemoMarket(): {
  gates: MarketMapGate[];
  shopsBySection: Map<string, DemoStall[]>;
} {
  if (built) return built;

  const shopsBySection = new Map<string, DemoStall[]>();

  const gates: MarketMapGate[] = SEED.map((gate, gi) => ({
    id: `demo-gate-${gi}`,
    code: gate.code,
    name: gate.name,
    latitude: null,
    longitude: null,
    sections: gate.sections.map((section, si) => {
      const sectionId = `demo-section-${gi}-${si}`;
      const stalls: DemoStall[] = section.stalls.map((name, idx) => ({
        id: `${sectionId}-stall-${idx}`,
        name,
      }));
      shopsBySection.set(sectionId, stalls);
      return {
        id: sectionId,
        code: `${gate.code}·${section.code}`,
        name: section.name,
        description: null,
        latitude: CENTER[1] + section.d[1],
        longitude: CENTER[0] + section.d[0],
        shopCount: stalls.length,
      };
    }),
  }));

  built = { gates, shopsBySection };
  return built;
}
