/**
 * Unit tests for the construction material calculators.
 * These verify the math is correct and guards against bad input.
 */
import { describe, it, expect } from 'vitest';
import { calcTiles, calcLaminate, calcPaint, calcCementSand } from './calculations';

describe('calcTiles', () => {
  it('computes tiles for a 4×3 m room with 30×30 cm tiles, 10% waste', () => {
    // area 12 m² × 1.10 = 13.2 ; tile 0.09 m² ; 13.2/0.09 = 146.6 -> 147
    const r = calcTiles(4, 3, 30, 30, 10);
    expect(r.area).toBe(12);
    expect(r.quantity).toBe(147);
  });
  it('returns 0 for invalid tile size', () => {
    expect(calcTiles(4, 3, 0, 30, 10).quantity).toBe(0);
  });
  it('rounds up (cannot buy a fraction of a tile)', () => {
    const r = calcTiles(1, 1, 100, 100, 0); // exactly 1 tile of 1 m²
    expect(r.quantity).toBe(1);
  });
});

describe('calcLaminate', () => {
  it('computes packs: 20 m² × 1.05 ÷ 2.5 = 8.4 -> 9', () => {
    const r = calcLaminate(5, 4, 2.5, 5);
    expect(r.area).toBe(20);
    expect(r.quantity).toBe(9);
  });
  it('returns 0 when coverage is 0', () => {
    expect(calcLaminate(5, 4, 0, 5).quantity).toBe(0);
  });
});

describe('calcPaint', () => {
  it('computes litres: 30 m² × 2 coats ÷ 10 = 6 (no waste)', () => {
    const r = calcPaint(30, 2, 10, 0);
    expect(r.quantity).toBe(6);
  });
  it('applies waste and rounds up to 0.1 L', () => {
    // 30 × 1 ÷ 10 = 3 ; ×1.05 = 3.15 -> 3.2
    expect(calcPaint(30, 1, 10, 5).quantity).toBe(3.2);
  });
});

describe('calcCementSand', () => {
  it('estimates cement bags and sand for a screed', () => {
    // 10 m² × 0.05 m = 0.5 m³ ; 1:3 -> cement 0.125 m³ ; bags = ceil(0.125*1440/50)=ceil(3.6)=4
    const r = calcCementSand(10, 5, 3, 0);
    expect(r.quantity).toBe(4);
    expect(r.extra?.[0].value).toBe('0.38 m³'); // sand 0.375 -> 0.38
  });
  it('returns 0 for zero thickness', () => {
    expect(calcCementSand(10, 0, 3, 0).quantity).toBe(0);
  });
});
