import React from 'react';
import { ChevronLeft, Calendar, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ResearchPost } from '../types/index';

interface ResearchDetailViewProps {
    post: ResearchPost;
    onBack: () => void;
}

export const ResearchDetailView: React.FC<ResearchDetailViewProps> = ({ post, onBack }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Header */}
            <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-rio-primary transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Voltar para Pesquisa
                    </button>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-rio-primary transition-colors" title="Salvar artigo">
                            <Bookmark className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rio-primary transition-colors" title="Compartilhar">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Post Meta */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">{post.date}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-medium">8 min de leitura</span>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-[21/9]">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-slate prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-5 pb-2 border-b border-slate-100" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
                        p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-6" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-3 mb-6" {...props} />,
                        li: ({ node, ...props }) => <li className="text-slate-700 marker:text-rio-primary" {...props} />,
                        blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-rio-primary bg-slate-50 px-6 py-8 my-10 rounded-r-2xl italic text-slate-800 text-xl font-medium" {...props} />
                        ),
                    }}>
                        {post.content || post.summary}
                    </ReactMarkdown>
                </div>

                {/* Footer info */}
                <div className="mt-20 pt-10 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rio-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                R
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">Equipe de Pesquisa Rio-AI</p>
                                <p className="text-sm text-slate-500">Desenvolvendo o futuro da IA governamental</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                            Seguir Equipe
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};
