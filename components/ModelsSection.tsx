import React, { useState, useMemo } from 'react';
import { RIO_MODELS } from '../constants';
import { ModelCard } from './ModelCard';
import { AnimateOnScroll } from './AnimateOnScroll';
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
            Cada modelo foi projetado com um propósito específico para atender às necessidades da cidade e da indústria.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200} className="mt-12 mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedCategory === category
                  ? 'bg-rio-primary text-white shadow'
                  : 'bg-white text-prose hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {category}
            </button>
          ))}
        </AnimateOnScroll>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model, index) => (
            <AnimateOnScroll key={model.name} delay={index * 50} duration="duration-500">
              <ModelCard model={model} onSelectModel={onSelectModel} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
