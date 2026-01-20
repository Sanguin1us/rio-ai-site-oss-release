import React, { useEffect, useRef, useState } from 'react';

const PHRASES = [
    'Mas o que são 1 bilhão de tokens?',
    'Se escrevêssemos cada token lado a lado em folhas de papel, eles percorreriam um quarto da circunferência do planeta.',
    'Isso equivale à distância entre ...',
];

export const TTATypingCallout: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (hasStarted) return;
        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: '0px', threshold: 0.3 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;
        if (isComplete) return;

        const fullText = PHRASES[phraseIndex] ?? '';

        if (!isDeleting && displayText === fullText) {
            if (phraseIndex === PHRASES.length - 1) {
                setIsComplete(true);
                return;
            }
            const pause = setTimeout(() => setIsDeleting(true), 1100);
            return () => clearTimeout(pause);
        }

        if (isDeleting && displayText.length === 0) {
            setIsDeleting(false);
            setPhraseIndex((prev) => prev + 1);
            return;
        }

        const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1;
        const stepDelay = isDeleting ? 26 : 38;
        const tick = setTimeout(() => {
            setDisplayText(fullText.slice(0, nextLength));
        }, stepDelay);

        return () => clearTimeout(tick);
    }, [displayText, hasStarted, isDeleting, isComplete, phraseIndex]);

    useEffect(() => {
        if (!isComplete) return;
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('tta-typewriter-complete'));
    }, [isComplete]);

    return (
        <div className="my-16" ref={containerRef}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
                    <p className="text-center text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-snug whitespace-normal break-words">
                        <span>{displayText}</span>
                        {!isComplete && (
                            <span className="ml-1 inline-block h-[1em] w-[2px] bg-rio-primary align-[-0.15em] animate-pulse" />
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
