import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import TerminalAnimation from './TerminalAnimation';

export const SciencePlatformSection = () => {
  return (
    <section id="plataforma" className="bg-light-bg py-20 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <AnimateOnScroll className="relative lg:h-auto" aria-hidden="true">
            <TerminalAnimation />
          </AnimateOnScroll>

          <AnimateOnScroll delay={200} className="mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
              Rio 2.0 Evolve: laboratório evolutivo com o Rio 2.0 Omni
            </h2>
            <p className="mt-4 text-lg text-prose-light">
              O Rio 2.0 Evolve é o motor de experimentos da prefeitura. Ele transforma um pedido em português simples
              em dezenas de propostas, coloca todas para competir em simulações reais e guarda as melhores ideias para o
              próximo desafio.
            </p>
            <p className="mt-4 text-base text-prose-light">
              Com esse ciclo encontramos, em poucas dezenas de tentativas, uma solução otimizada para acomodar 32 círculos.
              É a mesma tarefa clássica usada pelos laboratórios internacionais para testar frameworks evolutivos — só que
              aqui ela nasce pronta para virar política pública.
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">1. Problema em linguagem comum</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  A equipe descreve o desafio (“como distribuir 32 estruturas sem sobreposição”, por exemplo). O sistema
                  identifica metas, restrições e dados relevantes.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">2. Geração de candidatos</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  O Rio 2.0 Omni usa soluções campeãs anteriores como semente e cria variações explicadas, com custo
                  estimado e indicadores de resultado.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">3. Torneio e aprendizado</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  Simuladores urbanos, séries históricas e testes automatizados avaliam cada proposta. O sistema aprende
                  durante o processo e evita repetir combinações que não funcionam.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">4. Campeão em produção</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  A melhor solução vai para os times da prefeitura e fica registrada em um arquivo vivo. Ela pode ser
                  reutilizada como ponto de partida em desafios futuros — o ciclo recomeça mais forte.
                </dd>
              </div>
            </dl>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
