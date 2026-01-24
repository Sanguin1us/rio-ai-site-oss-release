import React, { useState } from 'react';
import type { Model } from '../../types/index';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Box,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import {
  ComparisonMetric,
  LabelOverride,
  ModelComparisonDatum,
  CHART_DIMENSIONS,
  CHART_PADDING,
} from '../../types/chart';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio30OpenDetailProps {
  model: Model;
  onBack: () => void;
}

const BENCHMARKS = [
  { metric: 'AIME 2025', base: '92.3', rl: '95.0', latent: '96.6' },
  { metric: 'HMMT Feb 25', base: '83.9', rl: '85.0', latent: '90.0' },
  { metric: 'GPQA Diamond', base: '81.1', rl: '83.2', latent: '85.1' },
  { metric: 'LiveCodeBench v6', base: '74.1', rl: '76.0', latent: '76.0' },
];

const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
  'Gemini 3 Pro': 'top-left',
  'GPT-5.2': 'bottom-right',
  'Gemini 3 Flash': 'bottom-right',
  'Claude Sonnet 4.5': 'bottom-left',
  'Gemini 2.5 Flash-Lite': { gpqa: 'bottom-right' },
  'GPT-5 mini': { aime: 'bottom-right' },
};

const MIN_COST = 0.3;

const MODEL_COMPARISON: ModelComparisonDatum[] = [
  { model: 'Gemini 3 Pro', cost: 12, gpqa: 91.9, aime: 95.0, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5.2', cost: 14, gpqa: 92.4, aime: 100.0, color: '#9CA3AF', isRio: false },
  { model: 'Rio 3.0 Open', cost: 0.4, gpqa: 85.1, aime: 96.6, color: '#1E40AF', isRio: true },
  { model: 'Gemini 3 Flash', cost: 3, gpqa: 90.4, aime: 95.2, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 mini', cost: 2, gpqa: 82.3, aime: 91.1, color: '#9CA3AF', isRio: false },
  { model: 'Gemini 2.5 Flash-Lite', cost: 0.4, gpqa: 71, aime: 69, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 nano', cost: 0.4, gpqa: 71.2, aime: 85.2, color: '#9CA3AF', isRio: false },
  { model: 'Claude Sonnet 4.5', cost: 15, gpqa: 83.4, aime: 87, color: '#9CA3AF', isRio: false },
  { model: 'Claude Haiku 4.5', cost: 5, gpqa: 73, aime: 80.7, color: '#9CA3AF', isRio: false },
];

const METRIC_CONFIGS: Array<{
  metric: ComparisonMetric;
  label: string;
  yTicks: number[];
  minY?: number;
}> = [
    {
      metric: 'aime',
      label: 'AIME 2025',
      yTicks: [70, 80, 90, 100],
    },
    {
      metric: 'gpqa',
      label: 'GPQA-Diamond',
      yTicks: [70, 80, 90],
      minY: 67,
    },
  ];

const PARAMETER_TICKS = [100, 235, 357, 685, 1000];

type ParameterLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ParameterDatum {
  model: string;
  paramsB: number;
  score: number;
  color: string;
  labelPosition?: ParameterLabelPosition;
  isRio?: boolean;
}

interface EmptyParameterChartProps {
  label: string;
  yMax: number;
  yTicks: number[];
  data: ParameterDatum[];
}

const formatParameterTick = (value: number) => {
  if (value >= 1000) return '1T';
  return `${value}B`;
};

const formatParameterValue = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}T`;
  return `${value}B`;
};

const formatScoreValue = (value: number) => {
  const formatted = value.toFixed(2);
  return formatted.replace(/\.?0+$/, '');
};

const EmptyParameterChart: React.FC<EmptyParameterChartProps> = ({ label, yMax, yTicks, data }) => {
  const [hovered, setHovered] = useState<ParameterDatum | null>(null);
  const { width, height } = CHART_DIMENSIONS;
  const { top, right, bottom, left } = CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(PARAMETER_TICKS[0] ?? 1);
  const logMax = Math.log10(PARAMETER_TICKS[PARAMETER_TICKS.length - 1] ?? 1000);

  const getX = (value: number) => {
    const ratio = (Math.log10(value) - logMin) / Math.max(logMax - logMin, 1);
    return left + ratio * plotWidth;
  };

  const getY = (value: number) => {
    const ratio = value / Math.max(yMax, 1);
    return height - bottom - ratio * plotHeight;
  };

  const tooltipMetrics = hovered
    ? {
        pointX: getX(hovered.paramsB),
        pointY: getY(hovered.score),
      }
    : null;

  const tooltipBox = (() => {
    if (!tooltipMetrics || !hovered) return null;
    const tooltipWidth = 210;
    const tooltipHeight = 72;
    const xMin = left;
    const xMax = width - right - tooltipWidth;
    const clampedX = Math.min(Math.max(tooltipMetrics.pointX - tooltipWidth / 2, xMin), xMax);
    const clampedY = Math.max(tooltipMetrics.pointY - tooltipHeight - 16, top);
    return {
      ...tooltipMetrics,
      boxX: clampedX,
      boxY: clampedY,
      width: tooltipWidth,
      height: tooltipHeight,
    };
  })();
  const tooltipLabel = label === "Humanity's Last Exam" ? 'HLE' : label;

  return (
    <div className="rounded-3xl bg-white/80 p-4 sm:p-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-rio-primary">
          {label}
        </p>
      </div>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          className="h-80 w-full"
          onMouseLeave={() => setHovered(null)}
        >
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

          {PARAMETER_TICKS.map((tick) => {
            const x = getX(tick);
            return (
              <text
                key={`${label}-x-${tick}`}
                x={x}
                y={height - bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                {formatParameterTick(tick)}
              </text>
            );
          })}

          <text
            x={(left + width - right) / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] fill-slate-400"
          >
            Parâmetros do modelo
          </text>

          {data.map((item) => {
            const x = getX(item.paramsB);
            const y = getY(item.score);
            const position = item.labelPosition ?? 'top-right';
            const offset = {
              'top-right': { dx: 10, dy: -8, anchor: 'start' as const },
              'top-left': { dx: -10, dy: -8, anchor: 'end' as const },
              'bottom-right': { dx: 10, dy: 16, anchor: 'start' as const },
              'bottom-left': { dx: -10, dy: 16, anchor: 'end' as const },
            }[position];
            const radius = item.isRio ? 7 : 5;
            const isHovered = hovered?.model === item.model;
            const faded = Boolean(hovered) && !isHovered;
            const circleRadius = radius + (isHovered ? 2 : 0);
            const strokeWidth = item.isRio ? 2.5 : 1.5;
            const fill = item.isRio ? item.color : '#ffffff';
            const stroke = item.isRio ? item.color : item.color;
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
              <g
                key={`${label}-${item.model}`}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${item.model} - ${tooltipLabel} ${formatScoreValue(item.score)}, parâmetros ${formatParameterValue(item.paramsB)}`}
                onMouseEnter={() => setHovered(item)}
                onFocus={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={circleRadius + (item.isRio ? 1 : 0)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  opacity={faded ? 0.4 : 1}
                />
                <line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineEndX}
                  y2={lineEndY}
                  className="stroke-slate-300"
                  strokeWidth={1}
                  opacity={faded ? 0.5 : 1}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={offset.anchor}
                  className="text-[11px] font-semibold fill-slate-700"
                  opacity={faded ? 0.5 : 1}
                >
                  {item.model}
                </text>
              </g>
            );
          })}

          {tooltipBox && hovered && (
            <>
              <line
                x1={tooltipBox.pointX}
                y1={tooltipBox.pointY}
                x2={tooltipBox.pointX}
                y2={tooltipBox.boxY + tooltipBox.height}
                className="stroke-slate-300"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <foreignObject
                x={tooltipBox.boxX}
                y={tooltipBox.boxY}
                width={tooltipBox.width}
                height={tooltipBox.height}
                pointerEvents="none"
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg ring-1 ring-black/5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {hovered.model}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {tooltipLabel}:{' '}
                    <span className="text-rio-primary">
                      {formatScoreValue(hovered.score)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Parâmetros: {formatParameterValue(hovered.paramsB)}
                  </p>
                </div>
              </foreignObject>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

const parseScore = (value: string) => Number.parseFloat(value);
const RAW_MIN = Math.min(...BENCHMARKS.map((row) => parseScore(row.base)));
const RAW_MAX = Math.max(...BENCHMARKS.map((row) => parseScore(row.latent)));
const SCALE_MIN = Math.max(0, Math.floor((RAW_MIN - 2) / 5) * 5);
const SCALE_MAX = Math.ceil((RAW_MAX + 2) / 5) * 5;
const scaleValue = (value: string) => {
  if (SCALE_MAX === SCALE_MIN) return 0.5;
  const ratio = (parseScore(value) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return Math.min(Math.max(ratio, 0), 1);
};
const positionStyle = (value: string) => ({
  left: `${scaleValue(value) * 100}%`,
});
const segmentStyle = (start: string, end: string) => {
  const startRatio = scaleValue(start);
  const endRatio = scaleValue(end);
  const width = Math.abs(endRatio - startRatio) * 100;
  const left = Math.min(startRatio, endRatio) * 100;
  return {
    left: `${left}%`,
    width: `${Math.max(width, 4)}%`,
  };
};

const PARAMETER_BENCHMARKS = {
  hle: [
    { model: 'Kimi K2 Thinking', paramsB: 1000, score: 23.9, color: '#9CA3AF', labelPosition: 'bottom-left' },
    { model: 'GLM 4.7', paramsB: 357, score: 24.8, color: '#9CA3AF' },
    { model: 'gpt-oss-120b (high)', paramsB: 120, score: 14.9, color: '#9CA3AF' },
    { model: 'Qwen3-235B-Thinking-2507', paramsB: 235, score: 18.2, color: '#9CA3AF' },
    { model: 'DeepSeek V3.2', paramsB: 685, score: 25.1, color: '#9CA3AF' },
    { model: 'Rio 3.0 Open', paramsB: 235, score: 25.2, color: '#1E40AF', isRio: true },
  ],
  matharena: [
    { model: 'Kimi K2 Thinking', paramsB: 1000, score: 0.0, color: '#9CA3AF', labelPosition: 'top-left' },
    { model: 'GLM 4.7', paramsB: 357, score: 3.3, color: '#9CA3AF' },
    { model: 'gpt-oss-120b (high)', paramsB: 120, score: 1.04, color: '#9CA3AF' },
    { model: 'Qwen3-235B-Thinking-2507', paramsB: 235, score: 5.21, color: '#9CA3AF' },
    { model: 'DeepSeek V3.2', paramsB: 685, score: 2.08, color: '#9CA3AF' },
    { model: 'Rio 3.0 Open', paramsB: 235, score: 9.17, color: '#1E40AF', isRio: true },
  ],
};

export const Rio30OpenDetail: React.FC<Rio30OpenDetailProps> = ({ model, onBack }) => {
  const huggingFaceWeightsUrl = model.huggingFaceUrl;

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para modelos Open
          </button>

          <div className="mt-6 space-y-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-6 lg:max-w-3xl">
                <h1 className="text-4xl font-bold leading-tight text-prose sm:text-5xl">
                  {model.name}
                </h1>
                <p className="text-lg text-prose-light leading-relaxed">{model.description}</p>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {huggingFaceWeightsUrl && (
                <a
                  href={huggingFaceWeightsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-prose shadow-sm transition hover:border-rio-primary/50 hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:self-start"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                    <img
                      src="/logos/huggingface-2.svg"
                      alt="Logomarca do Hugging Face"
                      className="h-6 w-6"
                    />
                  </span>
                  <span className="text-base">Acessar pesos</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  {METRIC_CONFIGS.map((config) => (
                    <ComparisonChart
                      key={config.metric}
                      {...config}
                      data={MODEL_COMPARISON}
                      labelOverrides={LABEL_POSITION_OVERRIDES}
                      minCost={MIN_COST}
                    />
                  ))}
                  <EmptyParameterChart
                    label="Humanity's Last Exam"
                    yMax={30}
                    yTicks={[10, 20, 30]}
                    data={PARAMETER_BENCHMARKS.hle}
                  />
                  <EmptyParameterChart
                    label="MathArena Apex"
                    yMax={15}
                    yTicks={[5, 10, 15]}
                    data={PARAMETER_BENCHMARKS.matharena}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <section className="rounded-[40px] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                  Benchmarks oficiais
                </p>
                <p className="mt-2 text-sm text-prose-light">
                  Os gráficos mostram como refinamos o Qwen3-235B-A22B-Thinking-2507 utilizando Reinforcement
                  Learning e o mecanismo de pensamento latente.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {BENCHMARKS.map((row) => (
                <div
                  key={row.metric}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rio-primary">
                      {row.metric}
                    </p>
                  </div>
                  <div className="relative mt-4 h-3 rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-[3px] rounded-full bg-gradient-to-r from-rio-primary via-rio-primary/70 to-emerald-500"
                      style={segmentStyle(row.base, row.latent)}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0">
                      {[
                        {
                          label: 'Base',
                          value: row.base,
                          className: 'text-slate-600',
                          showValue: true,
                        },
                        {
                          label: '+RL',
                          value: row.rl,
                          className: 'text-rio-primary',
                          showValue: false,
                        },
                        {
                          label: '+Latente',
                          value: row.latent,
                          className: 'text-emerald-600',
                          showValue: true,
                        },
                      ].map((mark) => (
                        <div
                          key={mark.label}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[11px] font-semibold"
                          style={positionStyle(mark.value)}
                        >
                          <div className="relative flex items-center justify-center">
                            {mark.showValue && (
                              <span
                                className={`absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-2 py-0.5 shadow ${mark.className}`}
                              >
                                {mark.value}
                              </span>
                            )}
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-slate-500 shadow">
                              {mark.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                  Como treinamos esse modelo
                </p>
                <h2 className="mt-2 text-3xl font-bold text-prose">
                  Destilação On-Policy com Rio 3.0 Preview
                </h2>
              </div>
              <p className="text-sm text-prose-light max-w-lg">Treinamento nativo em 4-bit</p>
            </div>
            <div className="mt-10 rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-prose">Pipeline de Treinamento</h3>
                <p className="text-sm text-prose-light max-w-4xl">
                  Partimos de um modelo base e aplicamos destilação on-policy utilizando o Rio 3.0 Preview
                  como professor, transferindo seu conhecimento para produzir o modelo final.
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                {/* Base Model */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Box className="h-6 w-6 text-rio-primary" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-prose">{model.baseModel ?? 'Qwen3-235B-A22B'}</p>
                    <p className="text-xs text-prose-light">Modelo base</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center py-2">
                  <ArrowDown className="h-8 w-8 text-slate-300" />
                </div>

                {/* OPD Process with Teacher */}
                <div className="relative flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-rio-primary/30 bg-rio-primary/5 px-8 py-6">
                  <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rio-primary shadow-sm">
                    On-Policy Distillation
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                    {/* Teacher Model */}
                    <div className="flex items-center gap-3 rounded-2xl border border-rio-primary/20 bg-white px-4 py-3 shadow-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rio-primary/10">
                        <GraduationCap className="h-5 w-5 text-rio-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-prose">Rio 3.0 Preview</p>
                        <p className="text-xs text-prose-light">Professor</p>
                      </div>
                    </div>

                    {/* Flowing particles - Desktop (horizontal, 2D) */}
                    <div className="hidden sm:flex items-center justify-center w-24 h-16 relative">
                      {/* Particle field */}
                      {[
                        { delay: 0, y: 20, size: 6, duration: 1.8, curve: -8 },
                        { delay: 0.3, y: 45, size: 8, duration: 1.5, curve: 6 },
                        { delay: 0.5, y: 30, size: 5, duration: 2.0, curve: -4 },
                        { delay: 0.8, y: 55, size: 7, duration: 1.6, curve: 10 },
                        { delay: 1.1, y: 15, size: 6, duration: 1.9, curve: -6 },
                        { delay: 1.4, y: 40, size: 5, duration: 1.7, curve: 5 },
                        { delay: 1.7, y: 60, size: 8, duration: 1.4, curve: -10 },
                        { delay: 2.0, y: 25, size: 6, duration: 2.1, curve: 8 },
                      ].map((p, i) => (
                        <span
                          key={i}
                          className="absolute rounded-full bg-rio-primary shadow-lg shadow-rio-primary/40"
                          style={{
                            width: p.size,
                            height: p.size,
                            top: `${p.y}%`,
                            animation: `flowParticle${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticle0 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          50% { transform: translateY(-4px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle1 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          50% { transform: translateY(3px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle2 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          50% { transform: translateY(-2px) scale(0.95); }
                          85% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle3 {
                          0% { left: -7px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          50% { transform: translateY(5px) scale(0.9); }
                          85% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          100% { left: calc(100% + 7px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle4 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          50% { transform: translateY(-3px) scale(0.85); }
                          85% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle5 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          50% { transform: translateY(2px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle6 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          50% { transform: translateY(-5px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticle7 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateY(8px) scale(1); }
                          50% { transform: translateY(4px) scale(0.9); }
                          85% { opacity: 0.85; transform: translateY(8px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                      `}</style>
                    </div>

                    {/* Flowing particles - Mobile (vertical, 2D) */}
                    <div className="flex sm:hidden items-center justify-center w-16 h-16 relative">
                      {[
                        { delay: 0, x: 30, size: 6, duration: 1.4, curve: -6 },
                        { delay: 0.35, x: 55, size: 7, duration: 1.2, curve: 8 },
                        { delay: 0.7, x: 40, size: 5, duration: 1.5, curve: -4 },
                        { delay: 1.0, x: 65, size: 6, duration: 1.3, curve: 6 },
                        { delay: 1.3, x: 25, size: 7, duration: 1.1, curve: -8 },
                      ].map((p, i) => (
                        <span
                          key={i}
                          className="absolute rounded-full bg-rio-primary shadow-lg shadow-rio-primary/40"
                          style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.x}%`,
                            animation: `flowParticleMobile${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticleMobile0 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          50% { transform: translateX(-3px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMobile1 {
                          0% { top: -7px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          50% { transform: translateX(4px) scale(0.85); }
                          85% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          100% { top: calc(100% + 7px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMobile2 {
                          0% { top: -5px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          50% { transform: translateX(-2px) scale(0.9); }
                          85% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          100% { top: calc(100% + 5px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMobile3 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          50% { transform: translateX(3px) scale(0.85); }
                          85% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMobile4 {
                          0% { top: -7px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateX(-8px) scale(1); }
                          50% { transform: translateX(-4px) scale(0.9); }
                          85% { opacity: 0.9; transform: translateX(-8px) scale(1); }
                          100% { top: calc(100% + 7px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                      `}</style>
                    </div>

                    {/* Student/Base being trained */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Box className="h-5 w-5 text-slate-600" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-prose">Modelo base</p>
                        <p className="text-xs text-prose-light">Aluno</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center py-2">
                  <ArrowDown className="h-8 w-8 text-slate-300" />
                </div>

                {/* Final Model */}
                <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-prose">{model.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">Modelo final</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="grid gap-12 lg:grid-cols-5">
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
