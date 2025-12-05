import React, { useState, useMemo } from 'react';
import { RIO_MODELS } from '../constants';
import { ModelCard } from './ModelCard';
import { AnimateOnScroll } from './AnimateOnScroll';
import { LineageTree } from './LineageTree';
import type { Model } from '../types';

interface ModelsSectionProps {
  onSelectModel: (model: Model) => void;
}

export const ModelsSection: React.FC<ModelsSectionProps> = ({ onSelectModel }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

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
          <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 overflow-hidden">
            <LineageTree onSelectModel={onSelectModel} />
          </div>
        </AnimateOnScroll>

        {/* Mobile Fallback / Detailed Grid View */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-prose">Catálogo Completo</h3>
            {/* Simple Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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
        </div>
      </div>
    </section>
  );
};
