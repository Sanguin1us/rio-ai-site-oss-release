import React from 'react';
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
} from '../../types/chart';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio30OpenMiniDetailProps {
  model: Model;
  onBack: () => void;
}

const BENCHMARKS = [
  { metric: 'AIME 2025', base: '81.3', rl: '86.6', latent: '90.0' },
  { metric: 'HMMT Feb 25', base: '55.5', rl: '68.3', latent: '73.3' },
  { metric: 'GPQA Diamond', base: '65.8', rl: '70.1', latent: '71.9' },
  { metric: 'LiveCodeBench v6', base: '55.2', rl: '62.0', latent: '63.5' },
];

const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
  'Gemini 3 Pro': 'top-left',
  'GPT-5.2': 'bottom-right',
  'Gemini 3 Flash': 'bottom-right',
  'Claude Sonnet 4.5': 'bottom-left',
  'Gemini 2.5 Flash-Lite': { gpqa: 'bottom-right' },
  'GPT-5 mini': { aime: 'bottom-right' },
};

const MIN_COST = 0.02;

const MODEL_COMPARISON: ModelComparisonDatum[] = [
  { model: 'Gemini 3 Pro', cost: 12, gpqa: 91.9, aime: 95.0, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5.2', cost: 14, gpqa: 92.4, aime: 100.0, color: '#9CA3AF', isRio: false },
  { model: 'Rio 3.0 Open Mini', cost: 0.04, gpqa: 71.9, aime: 90.0, color: '#1E40AF', isRio: true },
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

export const Rio30OpenMiniDetail: React.FC<Rio30OpenMiniDetailProps> = ({ model, onBack }) => {
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
            Voltar para todos os modelos
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
                  Os gráficos mostram como refinamos o Qwen3-4B-Thinking-2507 utilizando Reinforcement
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
                    <p className="text-sm font-semibold text-prose">{model.baseModel ?? 'Qwen3-4B'}</p>
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
                            animation: `flowParticleMini${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticleMini0 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          50% { transform: translateY(-4px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini1 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          50% { transform: translateY(3px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini2 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          50% { transform: translateY(-2px) scale(0.95); }
                          85% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini3 {
                          0% { left: -7px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          50% { transform: translateY(5px) scale(0.9); }
                          85% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          100% { left: calc(100% + 7px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini4 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          50% { transform: translateY(-3px) scale(0.85); }
                          85% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini5 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          50% { transform: translateY(2px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini6 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          50% { transform: translateY(-5px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleMini7 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateY(8px) scale(1); }
                          50% { transform: translateY(4px) scale(0.9); }
                          85% { opacity: 0.85; transform: translateY(8px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                      `}</style>
                    </div>

                    {/* Flowing particles - Mobile (vertical, 2D) */}
                    <div className="flex sm:hidden items-center justify-center w-16 h-16 relative overflow-hidden">
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
                            animation: `flowParticleMiniMobile${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticleMiniMobile0 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          50% { transform: translateX(-3px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMiniMobile1 {
                          0% { top: -7px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          50% { transform: translateX(4px) scale(0.85); }
                          85% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          100% { top: calc(100% + 7px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMiniMobile2 {
                          0% { top: -5px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          50% { transform: translateX(-2px) scale(0.9); }
                          85% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          100% { top: calc(100% + 5px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMiniMobile3 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          50% { transform: translateX(3px) scale(0.85); }
                          85% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleMiniMobile4 {
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
