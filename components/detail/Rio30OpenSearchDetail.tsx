import React from 'react';
import type { Model } from '../../types/index';
import { DetailHeader } from './DetailHeader';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio30OpenSearchDetailProps {
  model: Model;
  onBack: () => void;
}

interface BenchmarkScoreRow {
  benchmark: string;
  rioWithContextManagement: string;
  rioWithoutContextManagement: string;
  kimiK25: string;
  deepSeekV32: string;
  glm47: string;
  miniMaxM21: string;
  tongyiDeepResearch30BA3B: string;
  step35Flash: string;
}

type ScoreKey =
  | 'rioWithContextManagement'
  | 'rioWithoutContextManagement'
  | 'kimiK25'
  | 'deepSeekV32'
  | 'glm47'
  | 'miniMaxM21'
  | 'tongyiDeepResearch30BA3B'
  | 'step35Flash';

type BenchmarkLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface BenchmarkChartDatum {
  model: string;
  sizeB: number;
  score: number;
  color: string;
  isRio?: boolean;
  labelPosition?: BenchmarkLabelPosition;
}

interface BenchmarkSizeChartConfig {
  label: string;
  yMin: number;
  yMax: number;
  yTicks: number[];
  data: BenchmarkChartDatum[];
}

const SCORE_KEYS: ScoreKey[] = [
  'rioWithContextManagement',
  'rioWithoutContextManagement',
  'kimiK25',
  'deepSeekV32',
  'glm47',
  'miniMaxM21',
  'tongyiDeepResearch30BA3B',
  'step35Flash',
];

const BENCHMARK_SCORE_ROWS: BenchmarkScoreRow[] = [
  {
    benchmark: "Humanity's Last Exam",
    rioWithContextManagement: '42.5',
    rioWithoutContextManagement: '36.7',
    kimiK25: '50.2',
    deepSeekV32: '40.8',
    glm47: '42.8',
    miniMaxM21: '38.9',
    tongyiDeepResearch30BA3B: '32.9',
    step35Flash: '38.6',
  },
  {
    benchmark: 'GAIA',
    rioWithContextManagement: '85.2',
    rioWithoutContextManagement: '80.7',
    kimiK25: '75.9',
    deepSeekV32: '75.1',
    glm47: '61.9',
    miniMaxM21: '64.3',
    tongyiDeepResearch30BA3B: '70.9',
    step35Flash: '84.5',
  },
  {
    benchmark: 'BrowseComp',
    rioWithContextManagement: '75.1',
    rioWithoutContextManagement: '58.2',
    kimiK25: '74.9',
    deepSeekV32: '67.6',
    glm47: '67.5',
    miniMaxM21: '62.0',
    tongyiDeepResearch30BA3B: '43.4',
    step35Flash: '69.0',
  },
  {
    benchmark: 'BrowseComp-ZH',
    rioWithContextManagement: '77.4',
    rioWithoutContextManagement: '67.3',
    kimiK25: '76.4',
    deepSeekV32: '65.0',
    glm47: '66.6',
    miniMaxM21: '63.8',
    tongyiDeepResearch30BA3B: '46.7',
    step35Flash: '73.7',
  },
];

const parseScore = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getTopScores = (row: BenchmarkScoreRow): Set<ScoreKey> => {
  const validScores = SCORE_KEYS.map((key) => ({
    key,
    score: parseScore(row[key]),
  })).filter((item): item is { key: ScoreKey; score: number } => item.score !== null);

  if (validScores.length === 0) {
    return new Set<ScoreKey>();
  }

  const maxScore = Math.max(...validScores.map((item) => item.score));
  return new Set(
    validScores.filter((item) => item.score === maxScore).map((item) => item.key)
  );
};

const scoreCellClass = (isTopScore: boolean) =>
  isTopScore
    ? 'px-4 py-3 font-semibold text-emerald-700 bg-emerald-50 whitespace-nowrap'
    : 'px-4 py-3 text-prose whitespace-nowrap';

const SIZE_DOMAIN_MIN = 30;
const SIZE_DOMAIN_MAX = 1000;
const SIZE_TICKS = [30, 100, 300, 1000];
const SIZE_CHART_DIMENSIONS = { width: 620, height: 340 };
const SIZE_CHART_PADDING = { top: 22, right: 30, bottom: 64, left: 56 };

const formatSizeTick = (value: number) => (value >= 1000 ? '1T' : `${value}B`);

const BENCHMARK_SIZE_CHARTS: BenchmarkSizeChartConfig[] = [
  {
    label: 'BrowseComp',
    yMin: 40,
    yMax: 80,
    yTicks: [40, 50, 60, 70, 80],
    data: [
      {
        model: 'Rio 3.0 Open Search',
        sizeB: 235,
        score: 75.1,
        color: '#1E40AF',
        isRio: true,
        labelPosition: 'top-left',
      },
      {
        model: 'Kimi K2.5 Thinking',
        sizeB: 1000,
        score: 74.9,
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'DeepSeek V3.2',
        sizeB: 671,
        score: 67.6,
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'GLM 4.7',
        sizeB: 355,
        score: 67.5,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'MiniMax-M2.1',
        sizeB: 230,
        score: 62.0,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Step 3.5 Flash',
        sizeB: 196,
        score: 69.0,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Tongyi DeepResearch',
        sizeB: 30,
        score: 43.4,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
    ],
  },
  {
    label: "Humanity's Last Exam",
    yMin: 30,
    yMax: 52,
    yTicks: [30, 35, 40, 45, 50],
    data: [
      {
        model: 'Rio 3.0 Open Search',
        sizeB: 235,
        score: 42.5,
        color: '#1E40AF',
        isRio: true,
        labelPosition: 'top-left',
      },
      {
        model: 'Kimi K2.5 Thinking',
        sizeB: 1000,
        score: 50.2,
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'DeepSeek V3.2',
        sizeB: 671,
        score: 40.8,
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'GLM 4.7',
        sizeB: 355,
        score: 42.8,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'MiniMax-M2.1',
        sizeB: 230,
        score: 38.9,
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'Step 3.5 Flash',
        sizeB: 196,
        score: 38.6,
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'Tongyi DeepResearch',
        sizeB: 30,
        score: 32.9,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
    ],
  },
  {
    label: 'BrowseComp-ZH',
    yMin: 45,
    yMax: 80,
    yTicks: [45, 55, 65, 75],
    data: [
      {
        model: 'Rio 3.0 Open Search',
        sizeB: 235,
        score: 77.4,
        color: '#1E40AF',
        isRio: true,
        labelPosition: 'top-left',
      },
      {
        model: 'Kimi K2.5 Thinking',
        sizeB: 1000,
        score: 76.4,
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'DeepSeek V3.2',
        sizeB: 671,
        score: 65.0,
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'GLM 4.7',
        sizeB: 355,
        score: 66.6,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'MiniMax-M2.1',
        sizeB: 230,
        score: 63.8,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Step 3.5 Flash',
        sizeB: 196,
        score: 73.7,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Tongyi DeepResearch',
        sizeB: 30,
        score: 46.7,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
    ],
  },
  {
    label: 'GAIA',
    yMin: 60,
    yMax: 90,
    yTicks: [60, 70, 80, 90],
    data: [
      {
        model: 'Rio 3.0 Open Search',
        sizeB: 235,
        score: 85.2,
        color: '#1E40AF',
        isRio: true,
        labelPosition: 'top-right',
      },
      {
        model: 'Kimi K2.5 Thinking',
        sizeB: 1000,
        score: 75.9,
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'DeepSeek V3.2',
        sizeB: 671,
        score: 75.1,
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'GLM 4.7',
        sizeB: 355,
        score: 61.9,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'MiniMax-M2.1',
        sizeB: 230,
        score: 64.3,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Step 3.5 Flash',
        sizeB: 196,
        score: 84.5,
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Tongyi DeepResearch',
        sizeB: 30,
        score: 70.9,
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
    ],
  },
];

const BenchmarkSizeChart: React.FC<BenchmarkSizeChartConfig> = ({ label, yMin, yMax, yTicks, data }) => {
  const { width, height } = SIZE_CHART_DIMENSIONS;
  const { top, right, bottom, left } = SIZE_CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(SIZE_DOMAIN_MIN);
  const logMax = Math.log10(SIZE_DOMAIN_MAX);

  const getX = (value: number) => {
    const ratio = (Math.log10(value) - logMin) / Math.max(logMax - logMin, 1);
    return left + ratio * plotWidth;
  };

  const getY = (value: number) => {
    const ratio = (value - yMin) / Math.max(yMax - yMin, 1);
    return height - bottom - ratio * plotHeight;
  };

  return (
    <div className="rounded-3xl bg-white/80 p-4 sm:p-5 ring-1 ring-slate-200">
      <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-rio-primary">
        {label}
      </p>
      <div className="mt-3">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" className="h-[20rem] w-full overflow-visible">
          <line
            x1={left}
            y1={height - bottom}
            x2={width - right}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />
          <line
            x1={left}
            y1={top}
            x2={left}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />

          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <text
                key={`${label}-y-${tick}`}
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-500"
              >
                {tick}
              </text>
            );
          })}

          {SIZE_TICKS.map((tick) => {
            const x = getX(tick);
            return (
              <text
                key={`${label}-x-${tick}`}
                x={x}
                y={height - bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                {formatSizeTick(tick)}
              </text>
            );
          })}

          <text
            x={(left + width - right) / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-[11px] fill-slate-400"
          >
            Parâmetros do modelo
          </text>

          {data.map((item) => {
            const x = getX(item.sizeB);
            const y = getY(item.score);
            const position = item.labelPosition ?? 'top-right';
            const offset = {
              'top-right': { dx: 10, dy: -8, anchor: 'start' as const },
              'top-left': { dx: -10, dy: -8, anchor: 'end' as const },
              'bottom-right': { dx: 10, dy: 16, anchor: 'start' as const },
              'bottom-left': { dx: -10, dy: 16, anchor: 'end' as const },
            }[position];
            const radius = item.isRio ? 7 : 5;
            const labelX = x + offset.dx;
            const labelY = y + offset.dy;
            const isBelow = offset.dy >= 0;
            const lineStartX = x + (offset.anchor === 'end' ? -radius : radius);
            const lineStartY = y + (isBelow ? radius : -radius);
            const targetX = labelX;
            const targetY = labelY - (isBelow ? 2 : 4);
            const dxLine = targetX - lineStartX;
            const dyLine = targetY - lineStartY;
            const lineLength = Math.hypot(dxLine, dyLine);
            const shorten = 4;
            const scale = lineLength > shorten ? (lineLength - shorten) / lineLength : 0;
            const lineEndX = lineStartX + dxLine * scale;
            const lineEndY = lineStartY + dyLine * scale;
            return (
              <g key={`${label}-${item.model}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius + (item.isRio ? 1 : 0)}
                  fill={item.isRio ? item.color : '#ffffff'}
                  stroke={item.color}
                  strokeWidth={item.isRio ? 2.5 : 1.5}
                />
                <line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineEndX}
                  y2={lineEndY}
                  className="stroke-slate-300"
                  strokeWidth={1}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={offset.anchor}
                  className="text-[11px] font-semibold fill-slate-700"
                >
                  {item.model}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const Rio30OpenSearchDetail: React.FC<Rio30OpenSearchDetailProps> = ({
  model,
  onBack,
}) => {
  const huggingFaceWeightsUrl =
    model.huggingFaceUrl ?? 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Search';
  const hleChart = BENCHMARK_SIZE_CHARTS.find((chart) => chart.label === "Humanity's Last Exam");
  const gaiaChart = BENCHMARK_SIZE_CHARTS.find((chart) => chart.label === 'GAIA');
  const browseCompCharts = BENCHMARK_SIZE_CHARTS.filter(
    (chart) => chart.label === 'BrowseComp' || chart.label === 'BrowseComp-ZH'
  );

  return (
    <div className="bg-white">
      <AnimateOnScroll>
        <DetailHeader
          model={model}
          onBack={onBack}
          huggingFaceWeightsUrl={huggingFaceWeightsUrl}
        />
      </AnimateOnScroll>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white p-4 sm:p-6">
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {hleChart && <BenchmarkSizeChart key={hleChart.label} {...hleChart} />}
                {gaiaChart && <BenchmarkSizeChart key={gaiaChart.label} {...gaiaChart} />}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {browseCompCharts.map((chart) => (
                  <BenchmarkSizeChart key={chart.label} {...chart} />
                ))}
              </div>
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-prose whitespace-nowrap">
                      Benchmark
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-rio-primary">
                      Rio 3.0 Open Search
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">
                      <span className="whitespace-nowrap">Rio 3.0 Open Search</span>
                      <br />
                      <span className="whitespace-nowrap">(w/o context management)</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">Kimi K2.5</th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">DeepSeek V3.2</th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">GLM 4.7</th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">MiniMax-M2.1</th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">
                      Tongyi DeepResearch
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">Step 3.5 Flash</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_SCORE_ROWS.map((row) => {
                    const topScores = getTopScores(row);
                    return (
                      <tr key={row.benchmark} className="border-b border-slate-100 bg-white">
                        <th
                          scope="row"
                          className="px-4 py-3 text-left font-medium text-prose whitespace-nowrap"
                        >
                          {row.benchmark}
                        </th>
                        <td className={scoreCellClass(topScores.has('rioWithContextManagement'))}>
                          {row.rioWithContextManagement}
                        </td>
                        <td className={scoreCellClass(topScores.has('rioWithoutContextManagement'))}>
                          {row.rioWithoutContextManagement}
                        </td>
                        <td className={scoreCellClass(topScores.has('kimiK25'))}>{row.kimiK25}</td>
                        <td className={scoreCellClass(topScores.has('deepSeekV32'))}>
                          {row.deepSeekV32}
                        </td>
                        <td className={scoreCellClass(topScores.has('glm47'))}>{row.glm47}</td>
                        <td className={scoreCellClass(topScores.has('miniMaxM21'))}>
                          {row.miniMaxM21}
                        </td>
                        <td className={scoreCellClass(topScores.has('tongyiDeepResearch30BA3B'))}>
                          {row.tongyiDeepResearch30BA3B}
                        </td>
                        <td className={scoreCellClass(topScores.has('step35Flash'))}>
                          {row.step35Flash}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="grid lg:grid-cols-5 gap-12">
            <div className="space-y-12 lg:col-span-3">
              {model.useCases && <DetailUseCases useCases={model.useCases} />}
              {model.codeSnippets && <DetailCodeSnippets snippets={model.codeSnippets} />}
            </div>
            <div className="space-y-12 lg:col-span-2">
              <DetailSpecs model={model} />
            </div>
          </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
};
