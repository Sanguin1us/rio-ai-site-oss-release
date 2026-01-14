import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TTA_BENCHMARK_DATA, TTABenchmarkPoint } from '../../data/research-data';

// Color palette - muted for baselines, vibrant gradient for Rio
const BASELINE_COLORS: Record<string, string> = {
    'Claude Opus 4.5': '#A78BFA',
    'DeepSeek v3.2': '#F472B6',
    'GPT-5.2 xhigh': '#34D399',
    'Gemini 3 Pro': '#FBBF24',
};

// Rio uses a blue gradient from light to dark based on TTA count
const RIO_COLORS: Record<string, string> = {
    'Rio 3 TTA 1': '#BFDBFE',      // Blue-200
    'Rio 3 TTA 10': '#93C5FD',     // Blue-300
    'Rio 3 TTA 100': '#60A5FA',    // Blue-400
    'Rio 3 TTA 1000': '#3B82F6',   // Blue-500
    'Rio 3 TTA 10000': '#1D4ED8',  // Blue-700 (hero line)
};

const TTA_LABELS: Record<string, string> = {
    'Rio 3 TTA 1': '1',
    'Rio 3 TTA 10': '10',
    'Rio 3 TTA 100': '100',
    'Rio 3 TTA 1000': '1K',
    'Rio 3 TTA 10000': '10K',
};

const ALL_COLORS = { ...BASELINE_COLORS, ...RIO_COLORS };
const BASELINE_MODELS = Object.keys(BASELINE_COLORS);
const RIO_MODELS = Object.keys(RIO_COLORS);

export const TTABenchmarkChart: React.FC = () => {
    const [hoveredModel, setHoveredModel] = useState<string | null>(null);
    const [hoveredContext, setHoveredContext] = useState<number | null>(null);

    // Dimensions
    const width = 900;
    const height = 520;
    const padding = { top: 50, right: 50, bottom: 80, left: 72 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Domain
    const xMin = 13;
    const xMax = 30;
    const yMin = 0;
    const yMax = 100;

    // Scale functions
    const getX = (val: number) => padding.left + ((val - xMin) / (xMax - xMin)) * plotWidth;
    const getY = (val: number) => padding.top + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;

    // Create smooth path using Catmull-Rom spline
    const createPath = (model: string) => {
        const points = TTA_BENCHMARK_DATA
            .filter(d => d[model as keyof TTABenchmarkPoint] !== undefined)
            .map(d => ({ x: getX(d.context), y: getY(d[model as keyof TTABenchmarkPoint] as number) }));

        if (points.length < 2) return '';

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    // Get data points for a model
    const getDataPoints = (model: string) => {
        return TTA_BENCHMARK_DATA
            .filter(d => d[model as keyof TTABenchmarkPoint] !== undefined)
            .map(d => ({
                x: getX(d.context),
                y: getY(d[model as keyof TTABenchmarkPoint] as number),
                context: d.context,
                value: d[model as keyof TTABenchmarkPoint] as number
            }));
    };



    const isHighlighted = (model: string) => {
        if (!hoveredModel) return true;
        return hoveredModel === model;
    };

    const isRio = (model: string) => RIO_MODELS.includes(model);
    const isHeroLine = (model: string) => model === 'Rio 3 TTA 10000';

    // Get opacity for lines based on state
    const getLineOpacity = (model: string) => {
        if (hoveredModel) {
            return hoveredModel === model ? 1 : 0.12;
        }
        if (isRio(model)) return isHeroLine(model) ? 1 : 0.7;
        return 0.5;
    };

    // Get stroke width
    const getStrokeWidth = (model: string) => {
        if (hoveredModel === model) return isRio(model) ? 5 : 3.5;
        if (isHeroLine(model)) return 4;
        if (isRio(model)) return 2.5;
        return 2;
    };

    // Format context length for labels
    const formatContext = (val: number) => {
        if (val === 30) return '1B';
        if (val >= 20) {
            const m = Math.pow(2, val) / (1024 * 1024);
            return `${Math.round(m)}M`;
        }
        const k = Math.pow(2, val) / 1024;
        return `${Math.round(k)}K`;
    };

    // Milestones to label on X-axis
    const milestoneContexts = [14, 17, 20, 22, 24, 27, 30];

    return (
        <div className="my-12 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-8 shadow-lg border border-slate-200/60">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div className="flex-1 min-w-[280px]">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Needle In A Haystack</h4>
                        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed max-w-lg">
                            Retrieval accuracy as context length increases exponentially.
                        </p>
                    </div>
                    {/* Context Indicator (HUD Mode) */}
                    <AnimatePresence>
                        {hoveredContext !== null && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl"
                            >
                                <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Context</div>
                                <motion.div
                                    key={hoveredContext}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.08 }}
                                    className="flex items-baseline gap-1"
                                >
                                    <span className="text-lg font-black text-slate-900">{formatContext(hoveredContext)}</span>
                                    <span className="text-xs font-medium text-slate-400">Tokens</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dynamic HUD Legend */}
                <div className="flex flex-col items-center gap-2 text-xs mt-6 min-h-[60px]">
                    {/* Rio Legend Row */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-[60px]">
                            <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue-300 to-blue-700" />
                            <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider">Rio 3</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {RIO_MODELS.map(m => {
                                const val = hoveredContext !== null
                                    ? TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext)?.[m as keyof TTABenchmarkPoint]
                                    : undefined;

                                return (
                                    <button
                                        key={m}
                                        onMouseEnter={() => setHoveredModel(m)}
                                        onMouseLeave={() => setHoveredModel(null)}
                                        className={`group flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-75 ${hoveredModel === m
                                            ? 'bg-blue-100 ring-1 ring-blue-200 scale-[1.02]'
                                            : 'hover:bg-slate-100'
                                            } ${isHeroLine(m) ? 'font-bold' : ''}`}
                                    >
                                        <div
                                            className={`rounded-full transition-all ${isHeroLine(m) ? 'w-2.5 h-2.5 ring-1 ring-blue-300' : 'w-2 h-2'}`}
                                            style={{ backgroundColor: RIO_COLORS[m] }}
                                        />
                                        <div className="flex items-baseline gap-1.5 leading-none">
                                            <span className={`${isHeroLine(m) ? 'text-blue-700 font-bold' : 'text-slate-600 font-semibold'} text-[11px]`}>
                                                {TTA_LABELS[m]}
                                            </span>
                                            {/* Value Indicator (HUD) */}
                                            <AnimatePresence>
                                                {val !== undefined && (
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.08 }}
                                                        className={`text-[11px] font-black tabular-nums ${isHeroLine(m) ? 'text-blue-600' : 'text-slate-700'}`}
                                                    >
                                                        {val.toFixed(1)}%
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Baselines Legend Row */}
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                        {BASELINE_MODELS.map(m => {
                            const val = hoveredContext !== null
                                ? TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext)?.[m as keyof TTABenchmarkPoint]
                                : undefined;

                            // Short names for HUD
                            const shortName = m
                                .replace('Claude Opus', 'Claude')
                                .replace('GPT-5.2 xhigh', 'GPT')
                                .replace('Gemini 3 Pro', 'Gemini');

                            return (
                                <button
                                    key={m}
                                    onMouseEnter={() => setHoveredModel(m)}
                                    onMouseLeave={() => setHoveredModel(null)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-75 ${hoveredModel === m
                                        ? 'bg-slate-200 ring-1 ring-slate-300 scale-[1.02]'
                                        : 'hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BASELINE_COLORS[m] }} />
                                    <span className="font-medium text-slate-500 text-[11px]">{shortName}</span>

                                    {/* Value Indicator (HUD) */}
                                    <AnimatePresence mode="wait">
                                        {val !== undefined && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="ml-1 text-[11px] font-bold text-slate-600"
                                            >
                                                {val.toFixed(1)}%
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto"
                    style={{ maxHeight: '450px' }}
                    onMouseLeave={() => { setHoveredModel(null); setHoveredContext(null); }}
                >
                    <defs>
                        {/* Gradient for hero line glow */}
                        <linearGradient id="hero-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1D4ED8" />
                        </linearGradient>

                        {/* Subtle area gradient for hero performance */}
                        <linearGradient id="hero-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
                        </linearGradient>


                        {/* Glow filter for hovered lines */}
                        <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>


                    {/* Grid - Horizontal lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <g key={y}>
                            <line
                                x1={padding.left}
                                y1={getY(y)}
                                x2={width - padding.right}
                                y2={getY(y)}
                                stroke={y === 50 ? '#CBD5E1' : '#F1F5F9'}
                                strokeWidth={y === 50 ? 1 : 1}
                                strokeDasharray={y === 50 ? '' : '3 6'}
                            />
                            <text
                                x={padding.left - 14}
                                y={getY(y) + 4}
                                textAnchor="end"
                                className="text-[11px] font-semibold fill-slate-400"
                            >
                                {y}%
                            </text>
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {TTA_BENCHMARK_DATA.filter(d => milestoneContexts.includes(d.context)).map(d => (
                        <text
                            key={d.context}
                            x={getX(d.context)}
                            y={height - padding.bottom + 28}
                            textAnchor="middle"
                            className={`text-[11px] font-bold transition-all duration-200 ${hoveredContext === d.context ? 'fill-blue-600' : 'fill-slate-400'
                                }`}
                        >
                            {formatContext(d.context)}
                        </text>
                    ))}

                    {/* X-axis title */}
                    <text
                        x={padding.left + plotWidth / 2}
                        y={height - 18}
                        textAnchor="middle"
                        className="text-[11px] font-bold uppercase tracking-[0.2em] fill-slate-300"
                    >
                        Context Length (tokens)
                    </text>

                    {/* Subtle area under hero line */}
                    <path
                        d={`${createPath('Rio 3 TTA 10000')} L ${getX(30)} ${getY(0)} L ${getX(13)} ${getY(0)} Z`}
                        fill="url(#hero-area-gradient)"
                        className="pointer-events-none transition-opacity duration-300"
                        style={{ opacity: hoveredModel && !isHeroLine(hoveredModel) ? 0.2 : 1 }}
                    />

                    {/* Baseline model lines */}
                    {BASELINE_MODELS.map(model => (
                        <path
                            key={model}
                            d={createPath(model)}
                            fill="none"
                            stroke={ALL_COLORS[model]}
                            strokeWidth={getStrokeWidth(model)}
                            strokeOpacity={getLineOpacity(model)}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-300 cursor-pointer"
                            filter={hoveredModel === model ? 'url(#line-glow)' : undefined}
                            onMouseEnter={() => setHoveredModel(model)}
                        />
                    ))}

                    {/* Rio model lines (non-hero first, then hero on top) */}
                    {RIO_MODELS.filter(m => !isHeroLine(m)).map(model => (
                        <path
                            key={model}
                            d={createPath(model)}
                            fill="none"
                            stroke={ALL_COLORS[model]}
                            strokeWidth={getStrokeWidth(model)}
                            strokeOpacity={getLineOpacity(model)}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-300 cursor-pointer"
                            filter={hoveredModel === model ? 'url(#line-glow)' : undefined}
                            onMouseEnter={() => setHoveredModel(model)}
                        />
                    ))}

                    {/* Hero line (Rio 3 TTA 10000) - rendered last for z-index */}
                    <path
                        d={createPath('Rio 3 TTA 10000')}
                        fill="none"
                        stroke="url(#hero-line-gradient)"
                        strokeWidth={getStrokeWidth('Rio 3 TTA 10000')}
                        strokeOpacity={getLineOpacity('Rio 3 TTA 10000')}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 cursor-pointer"
                        filter={hoveredModel === 'Rio 3 TTA 10000' || !hoveredModel ? 'url(#line-glow)' : undefined}
                        onMouseEnter={() => setHoveredModel('Rio 3 TTA 10000')}
                    />


                    {/* Hoverable columns for tooltip */}
                    {TTA_BENCHMARK_DATA.map(d => (
                        <rect
                            key={`hit-${d.context}`}
                            x={getX(d.context) - (plotWidth / (xMax - xMin)) / 2}
                            y={padding.top}
                            width={plotWidth / (xMax - xMin)}
                            height={plotHeight}
                            fill="transparent"
                            className="cursor-crosshair"
                            onMouseEnter={() => setHoveredContext(d.context)}
                            onMouseLeave={() => setHoveredContext(null)}
                        />
                    ))}

                    {/* Hover line and dots */}
                    {hoveredContext !== null && (
                        <g>
                            <line
                                x1={getX(hoveredContext)}
                                y1={padding.top}
                                x2={getX(hoveredContext)}
                                y2={padding.top + plotHeight}
                                stroke="#94A3B8"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                            />
                            {[...RIO_MODELS, ...BASELINE_MODELS]
                                .map(model => {
                                    const d = TTA_BENCHMARK_DATA.find(p => p.context === hoveredContext);
                                    const val = d?.[model as keyof TTABenchmarkPoint];
                                    if (val === undefined) return null;
                                    return (
                                        <circle
                                            key={model}
                                            cx={getX(hoveredContext)}
                                            cy={getY(val as number)}
                                            r={isHeroLine(model) ? 6 : isRio(model) ? 4 : 3}
                                            fill={ALL_COLORS[model]}
                                            stroke="#FFF"
                                            strokeWidth={1.5}
                                        />
                                    );
                                })}
                        </g>
                    )}
                </svg>

            </div>

        </div >
    );
};
