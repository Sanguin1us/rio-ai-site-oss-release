import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RIO_MODELS } from '../constants';
import { ModelCard } from './ModelCard';
import { AnimateOnScroll } from './AnimateOnScroll';
import { LineageTree } from './LineageTree';
import type { Model } from '../types';
import {
  RIO_1_NODES,
  RIO_1_5_NODES,
  RIO_2_NODES,
  RIO_2_5_NODES
} from './lineage-data';

interface ModelsSectionProps {
  onSelectModel: (model: Model) => void;
}

type Generation = '1.0' | '1.5' | '2.0' | '2.5';

export const ModelsSection: React.FC<ModelsSectionProps> = ({ onSelectModel }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation>('2.5');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const categories = useMemo(
    () => ['Todos', ...new Set(RIO_MODELS.map((model) => model.category))],
    []
  );

  const filteredModels = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? RIO_MODELS
        : RIO_MODELS.filter((model) => model.category === selectedCategory),
    [selectedCategory]
  );

  const currentNodes = useMemo(() => {
    switch (selectedGeneration) {
      case '1.0': return RIO_1_NODES;
      case '1.5': return RIO_1_5_NODES;
      case '2.0': return RIO_2_NODES;
      case '2.5': return RIO_2_5_NODES;
      default: return RIO_2_5_NODES;
    }
  }, [selectedGeneration]);

  return (
    <section id="modelos" className="bg-light-bg py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            Nossa Família de Modelos
          </h2>
          <p className="mt-4 text-lg text-prose-light">
            Da fundação à convergência: conheça a evolução da nossa inteligência artificial.
          </p>
        </AnimateOnScroll>

        {/* Interactive Tree Visualization */}
        <AnimateOnScroll delay={100} className="mt-12 mb-16 hidden md:block">
          {/* Generation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-sm">
              {(['1.0', '1.5', '2.0', '2.5'] as Generation[]).map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGeneration(gen)}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedGeneration === gen
                    ? 'text-white shadow-md'
                    : 'text-slate-500 hover:text-prose hover:bg-slate-50'
                    }`}
                >
                  {selectedGeneration === gen && (
                    <div className="absolute inset-0 bg-rio-primary rounded-full" />
                  )}
                  <span className="relative z-10">Rio {gen}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 overflow-hidden">
            <LineageTree onSelectModel={onSelectModel} nodes={currentNodes} />
          </div>
        </AnimateOnScroll>

        {/* Mobile Fallback / Detailed Grid View */}
        {/* Mobile Fallback / Detailed Grid View */}
        <div className="mt-12">
          {!isCatalogOpen ? (
            <div className="flex justify-center py-8">
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-rio-primary via-blue-600 to-rio-primary bg-[length:200%_auto] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-500 hover:bg-[position:right_center] hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
                  </span>
                  <span className="text-lg tracking-wide">Catálogo Completo</span>
                  <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                </div>
              </button>
            </div>
          ) : (
            <div className="animate-slideIn">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <button
                  onClick={() => setIsCatalogOpen(false)}
                  className="group flex items-center gap-2 text-xl font-semibold text-prose hover:text-rio-primary transition-colors"
                >
                  Catálogo Completo
                  <ChevronUp className="h-5 w-5 text-slate-400 transition-transform group-hover:-translate-y-1 group-hover:text-rio-primary" />
                </button>

                {/* Simple Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar justify-center sm:justify-start">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${selectedCategory === category
                        ? 'bg-rio-primary text-white'
                        : 'bg-white text-prose hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredModels.map((model, index) => (
                  <AnimateOnScroll key={model.name} delay={index * 50} duration="duration-500">
                    <ModelCard model={model} onSelectModel={onSelectModel} />
                  </AnimateOnScroll>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setIsCatalogOpen(false)}
                  className="text-sm font-medium text-slate-500 hover:text-rio-primary transition-colors flex items-center gap-1"
                >
                  Fechar Catálogo <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
