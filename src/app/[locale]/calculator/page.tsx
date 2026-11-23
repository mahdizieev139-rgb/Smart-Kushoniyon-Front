/**
 * Construction material calculator page (/[locale]/calculator).
 *
 * Four calculators (tiles, laminate, paint, cement & sand) share one UI driven
 * by a small config, so adding another calculator later is just one entry.
 * The actual math lives in src/features/calculator/calculations.ts (unit-tested).
 *
 * Results are clearly labelled as estimates — the page never creates orders.
 */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator as CalcIcon, Info, Ruler } from 'lucide-react';
import {
  calcTiles,
  calcLaminate,
  calcPaint,
  calcCementSand,
  type CalcResult,
} from '@/features/calculator/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHero } from '@/components/layout/page-hero';
import { cn } from '@/lib/utils';

interface Field {
  name: string;
  labelKey: string;
  def: number;
  step?: number;
}

interface CalcConfig {
  key: string;
  tabKey: string;
  resultKey: string;
  unitKey: string;
  fields: Field[];
  compute: (v: Record<string, number>) => CalcResult;
}

// Each calculator = one config entry (DRY). labelKey/tabKey are translation keys.
const CONFIGS: CalcConfig[] = [
  {
    key: 'tiles',
    tabKey: 'tabTiles',
    resultKey: 'resTiles',
    unitKey: 'unitTiles',
    fields: [
      { name: 'roomLength', labelKey: 'roomLength', def: 4, step: 0.1 },
      { name: 'roomWidth', labelKey: 'roomWidth', def: 3, step: 0.1 },
      { name: 'tileLength', labelKey: 'tileLength', def: 30 },
      { name: 'tileWidth', labelKey: 'tileWidth', def: 30 },
      { name: 'waste', labelKey: 'waste', def: 10 },
    ],
    compute: (v) => calcTiles(v.roomLength, v.roomWidth, v.tileLength, v.tileWidth, v.waste),
  },
  {
    key: 'laminate',
    tabKey: 'tabLaminate',
    resultKey: 'resPacks',
    unitKey: 'unitPacks',
    fields: [
      { name: 'roomLength', labelKey: 'roomLength', def: 5, step: 0.1 },
      { name: 'roomWidth', labelKey: 'roomWidth', def: 4, step: 0.1 },
      { name: 'packCoverage', labelKey: 'packCoverage', def: 2.5, step: 0.01 },
      { name: 'waste', labelKey: 'waste', def: 5 },
    ],
    compute: (v) => calcLaminate(v.roomLength, v.roomWidth, v.packCoverage, v.waste),
  },
  {
    key: 'paint',
    tabKey: 'tabPaint',
    resultKey: 'resPaint',
    unitKey: 'unitL',
    fields: [
      { name: 'wallArea', labelKey: 'wallArea', def: 30, step: 0.1 },
      { name: 'coats', labelKey: 'coats', def: 2 },
      { name: 'coverage', labelKey: 'coverage', def: 10, step: 0.1 },
      { name: 'waste', labelKey: 'waste', def: 5 },
    ],
    compute: (v) => calcPaint(v.wallArea, v.coats, v.coverage, v.waste),
  },
  {
    key: 'cement',
    tabKey: 'tabCement',
    resultKey: 'resCement',
    unitKey: 'unitBags',
    fields: [
      { name: 'wallArea', labelKey: 'wallArea', def: 10, step: 0.1 },
      { name: 'thickness', labelKey: 'thickness', def: 5, step: 0.1 },
      { name: 'ratio', labelKey: 'ratio', def: 3, step: 1 },
      { name: 'waste', labelKey: 'waste', def: 10 },
    ],
    compute: (v) => calcCementSand(v.wallArea, v.thickness, v.ratio, v.waste),
  },
];

function defaultsFor(config: CalcConfig): Record<string, number> {
  return Object.fromEntries(config.fields.map((f) => [f.name, f.def]));
}

export default function CalculatorPage() {
  const t = useTranslations('calculator');

  const [activeKey, setActiveKey] = useState(CONFIGS[0].key);
  const [values, setValues] = useState<Record<string, number>>(defaultsFor(CONFIGS[0]));
  const [result, setResult] = useState<CalcResult | null>(null);

  const config = CONFIGS.find((c) => c.key === activeKey)!;

  function switchTab(key: string) {
    const next = CONFIGS.find((c) => c.key === key)!;
    setActiveKey(key);
    setValues(defaultsFor(next));
    setResult(null);
  }

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Calculator tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CONFIGS.map((c) => (
            <button
              key={c.key}
              onClick={() => switchTab(c.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium',
                activeKey === c.key
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white text-muted hover:bg-canvas',
              )}
            >
              <Ruler className="h-4 w-4" aria-hidden />
              {t(c.tabKey)}
            </button>
          ))}
        </div>

        <Card>
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setResult(config.compute(values));
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {config.fields.map((f) => (
                  <div key={f.name} className="space-y-1.5">
                    <label htmlFor={f.name} className="block text-sm font-medium text-ink">
                      {t(f.labelKey)}
                    </label>
                    <input
                      id={f.name}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={f.step ?? 1}
                      value={values[f.name]}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [f.name]: Number(e.target.value) }))
                      }
                      className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus-visible:border-brand"
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                <CalcIcon className="h-5 w-5" />
                {t('calculate')}
              </Button>
            </form>

            {/* Result */}
            {result ? (
              <div className="mt-6 rounded-card bg-canvas p-5">
                {result.area != null ? (
                  <p className="text-sm text-muted">
                    {t('roomArea')}: <span className="num font-medium text-ink">{result.area.toFixed(2)} m²</span>
                  </p>
                ) : null}
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm text-muted">{t(config.resultKey)}:</span>
                  <span className="num text-3xl font-bold text-navy-ink">{result.quantity}</span>
                  <span className="text-sm text-muted">{t(config.unitKey)}</span>
                </p>
                {result.extra?.map((e) => (
                  <p key={e.label} className="mt-1 text-sm text-muted">
                    {t('resSand')}: <span className="num font-medium text-ink">{e.value}</span>
                  </p>
                ))}
                <p className="num mt-3 border-t border-line pt-3 text-xs text-muted">
                  {t('formula')}: {result.formula}
                </p>
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-muted">{t('enterValues')}</p>
            )}
          </CardBody>
        </Card>

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{t('disclaimer')}</p>
        </div>
      </div>
    </>
  );
}
