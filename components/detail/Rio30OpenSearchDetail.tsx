import React from 'react';
import type { Model } from '../../types/index';
import { ArrowDown, Box, GraduationCap, Sparkles } from 'lucide-react';
import { DetailHeader } from './DetailHeader';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { DetailSpecs } from './DetailSpecs';
import { AnimateOnScroll } from '../AnimateOnScroll';

interface Rio30OpenSearchDetailProps {
  model: Model;
  onBack: () => void;
}

export const Rio30OpenSearchDetail: React.FC<Rio30OpenSearchDetailProps> = ({
  model,
  onBack,
}) => {
  return (
    <div className="bg-white">
      <AnimateOnScroll>
        <DetailHeader model={model} onBack={onBack} />
      </AnimateOnScroll>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rio-primary">
                  Como treinamos esse modelo
                </p>
                <h2 className="mt-2 text-3xl font-bold text-prose">
                  Destilação On-Policy com Rio 3.0
                </h2>
              </div>
              <p className="text-sm text-prose-light max-w-lg">Treinamento nativo em 4-bit</p>
            </div>
            <div className="mt-10 rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-prose">Pipeline de Treinamento</h3>
                <p className="text-sm text-prose-light max-w-4xl">
                  Partimos de um modelo base e aplicamos destilação on-policy utilizando o Rio 3.0
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
                    <p className="text-sm font-semibold text-prose">
                      {model.baseModel ?? 'Modelo base'}
                    </p>
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
                        <p className="text-sm font-semibold text-prose">Rio 3.0</p>
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
                            animation: `flowParticleSearch_${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticleSearch_0 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          50% { transform: translateY(-4px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(-8px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_1 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          50% { transform: translateY(3px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(6px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_2 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          50% { transform: translateY(-2px) scale(0.95); }
                          85% { opacity: 0.7; transform: translateY(-4px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_3 {
                          0% { left: -7px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          50% { transform: translateY(5px) scale(0.9); }
                          85% { opacity: 0.85; transform: translateY(10px) scale(1); }
                          100% { left: calc(100% + 7px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_4 {
                          0% { left: -6px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          50% { transform: translateY(-3px) scale(0.85); }
                          85% { opacity: 0.75; transform: translateY(-6px) scale(1); }
                          100% { left: calc(100% + 6px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_5 {
                          0% { left: -5px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          50% { transform: translateY(2px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateY(5px) scale(1); }
                          100% { left: calc(100% + 5px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_6 {
                          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
                          15% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          50% { transform: translateY(-5px) scale(0.85); }
                          85% { opacity: 0.9; transform: translateY(-10px) scale(1); }
                          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearch_7 {
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
                            animation: `flowParticleSearchMobile_${i} ${p.duration}s ease-in-out infinite`,
                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes flowParticleSearchMobile_0 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          50% { transform: translateX(-3px) scale(0.9); }
                          85% { opacity: 0.8; transform: translateX(-6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearchMobile_1 {
                          0% { top: -7px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          50% { transform: translateX(4px) scale(0.85); }
                          85% { opacity: 0.85; transform: translateX(8px) scale(1); }
                          100% { top: calc(100% + 7px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearchMobile_2 {
                          0% { top: -5px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          50% { transform: translateX(-2px) scale(0.9); }
                          85% { opacity: 0.75; transform: translateX(-4px) scale(1); }
                          100% { top: calc(100% + 5px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearchMobile_3 {
                          0% { top: -6px; opacity: 0; transform: translateX(0) scale(0.3); }
                          15% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          50% { transform: translateX(3px) scale(0.85); }
                          85% { opacity: 0.8; transform: translateX(6px) scale(1); }
                          100% { top: calc(100% + 6px); opacity: 0; transform: translateX(0) scale(0.3); }
                        }
                        @keyframes flowParticleSearchMobile_4 {
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
