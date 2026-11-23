/**
 * Construction material calculators — PURE functions (no UI, no network).
 *
 * Keeping the math here (separate from the React page) means it is easy to read,
 * reuse and unit-test. Every function:
 *   - accepts plain numbers,
 *   - returns a structured result with a human-readable `formula` string,
 *   - returns estimates only (real needs depend on material specs & conditions).
 *
 * All areas are in square metres (m²). We round UP discrete units (tiles, packs,
 * bags) because you cannot buy a fraction of them.
 */

export interface CalcResult {
  /** Floor/surface area used in the calculation, m² (when relevant). */
  area?: number;
  /** Primary quantity to buy (tiles, packs, litres, bags…). */
  quantity: number;
  /** A readable formula with the actual numbers, e.g. "12.00 × 1.10 ÷ 0.09 = 147". */
  formula: string;
  /** Optional extra numbers to show (already formatted). */
  extra?: { label: string; value: string }[];
}

/** Clamp a number to be at least 0 (guards against negative inputs). */
function nonNeg(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Multiply by the waste factor, e.g. waste 10% -> ×1.10. */
function withWaste(value: number, wastePct: number): number {
  return value * (1 + nonNeg(wastePct) / 100);
}

/**
 * Floor tiles. Tile size is given in centimetres; room size in metres.
 * tiles = ceil( roomArea × wasteFactor ÷ singleTileArea )
 */
export function calcTiles(
  roomLengthM: number,
  roomWidthM: number,
  tileLengthCm: number,
  tileWidthCm: number,
  wastePct: number,
): CalcResult {
  const area = nonNeg(roomLengthM) * nonNeg(roomWidthM);
  const tileArea = (nonNeg(tileLengthCm) / 100) * (nonNeg(tileWidthCm) / 100); // m²
  if (area === 0 || tileArea === 0) {
    return { area, quantity: 0, formula: '—' };
  }
  const withWasteArea = withWaste(area, wastePct);
  const quantity = Math.ceil(withWasteArea / tileArea);
  return {
    area,
    quantity,
    formula: `${area.toFixed(2)} m² × ${(1 + nonNeg(wastePct) / 100).toFixed(2)} ÷ ${tileArea.toFixed(3)} m² = ${quantity}`,
  };
}

/**
 * Laminate. Given the coverage of one pack (m²/pack).
 * packs = ceil( roomArea × wasteFactor ÷ packCoverage )
 */
export function calcLaminate(
  roomLengthM: number,
  roomWidthM: number,
  packCoverageM2: number,
  wastePct: number,
): CalcResult {
  const area = nonNeg(roomLengthM) * nonNeg(roomWidthM);
  const coverage = nonNeg(packCoverageM2);
  if (area === 0 || coverage === 0) return { area, quantity: 0, formula: '—' };
  const quantity = Math.ceil(withWaste(area, wastePct) / coverage);
  return {
    area,
    quantity,
    formula: `${area.toFixed(2)} m² × ${(1 + nonNeg(wastePct) / 100).toFixed(2)} ÷ ${coverage} m²/pack = ${quantity}`,
  };
}

/**
 * Paint. coverage = how many m² one litre covers for ONE coat.
 * litres = roundUp1dp( area × coats × wasteFactor ÷ coverage )
 */
export function calcPaint(
  areaM2: number,
  coats: number,
  coveragePerLitre: number,
  wastePct: number,
): CalcResult {
  const area = nonNeg(areaM2);
  const n = nonNeg(coats);
  const coverage = nonNeg(coveragePerLitre);
  if (area === 0 || n === 0 || coverage === 0) return { area, quantity: 0, formula: '—' };
  const raw = withWaste((area * n) / coverage, wastePct);
  const quantity = Math.ceil(raw * 10) / 10; // round up to 0.1 L
  return {
    area,
    quantity,
    formula: `${area.toFixed(2)} m² × ${n} × ${(1 + nonNeg(wastePct) / 100).toFixed(2)} ÷ ${coverage} m²/L = ${quantity} L`,
  };
}

/**
 * Cement & sand for a screed/plaster layer (rough estimate).
 *   volume (m³) = area × thickness
 *   For a 1:ratio cement:sand mix:
 *     cement volume = volume ÷ (1 + ratio)
 *     sand volume   = volume × ratio ÷ (1 + ratio)
 *   cement bags (50 kg) ≈ cement volume × 1440 kg/m³ ÷ 50
 *
 * `quantity` is cement bags; sand (m³) is returned in `extra`.
 */
export function calcCementSand(
  areaM2: number,
  thicknessCm: number,
  sandRatio: number,
  wastePct: number,
): CalcResult {
  const area = nonNeg(areaM2);
  const thickness = nonNeg(thicknessCm) / 100; // m
  const ratio = nonNeg(sandRatio);
  const volume = withWaste(area * thickness, wastePct); // m³
  if (volume === 0) return { area, quantity: 0, formula: '—' };

  const cementVolume = volume / (1 + ratio);
  const sandVolume = (volume * ratio) / (1 + ratio);
  const cementBags = Math.ceil((cementVolume * 1440) / 50);

  return {
    area,
    quantity: cementBags,
    formula: `${area.toFixed(2)} m² × ${thickness.toFixed(2)} m = ${volume.toFixed(3)} m³ (1:${ratio})`,
    extra: [{ label: 'sand', value: `${sandVolume.toFixed(2)} m³` }],
  };
}
