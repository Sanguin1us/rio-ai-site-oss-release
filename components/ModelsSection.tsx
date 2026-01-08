import React, { useState, useMemo } from 'react';
import { RIO_1_NODES, RIO_1_5_NODES, RIO_2_NODES, RIO_2_5_NODES, RIO_3_NODES } from './lineage-data';
import { AnimateOnScroll } from './AnimateOnScroll';
import { LineageTree } from './LineageTree';
import type { Model } from '../types/index';

interface ModelsSectionProps {
  onSelectModel: (model: Model) => void;
}

type Generation = '1.0' | '1.5' | '2.0' | '2.5' | '3.0';

export const ModelsSection: React.FC<ModelsSectionProps> = ({ onSelectModel }) => {
  const [selectedGeneration, setSelectedGeneration] = useState<Generation>('3.0');

  const currentNodes = useMemo(() => {
    switch (selectedGeneration) {
      case '1.0':
        return RIO_1_NODES;
      case '1.5':
        return RIO_1_5_NODES;
      case '2.0':
        return RIO_2_NODES;
      case '2.5':
        return RIO_2_5_NODES;
      case '3.0':
        return RIO_3_NODES;
      default:
        return RIO_3_NODES;
    }
  }, [selectedGeneration]);

  return (
    <section id="modelos" className="bg-light-bg py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
            Nossa Jornada
          </h2>
          <p className="mt-4 text-lg text-prose-light">
            Explore as gerações de modelos que construímos para transformar o Rio.
          </p>
        </AnimateOnScroll>

        {/* Interactive Tree Visualization */}
        <AnimateOnScroll delay={100} className="mt-12 mb-16 hidden md:block">
          {/* Generation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-sm">
              {(['1.0', '1.5', '2.0', '2.5', '3.0'] as Generation[]).map((gen) => (
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
            <LineageTree
              onSelectModel={onSelectModel}
              nodes={currentNodes}
              variant={selectedGeneration === '3.0' ? '3d-ring' : 'tree'}
            />
          </div>
        </AnimateOnScroll>

        {/* Mobile Fallback / Detailed Grid View is being removed as requested */}
      </div>
    </section>
  );
};
