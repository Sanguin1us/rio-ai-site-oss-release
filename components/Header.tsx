import React from 'react';
import { Twitter, Youtube, Github } from 'lucide-react';
import type { View } from '../types/index';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Logos: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => (
  <button
    onClick={() => onNavigate('home')}
    className="flex items-center gap-4 text-sm text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary rounded-md"
  >
    <div className="flex items-center gap-2 font-bold text-slate-800">
      <img
        src="/logos/RIOPREFEITURA%20IplanRio%20horizontal.png"
        alt="Logo da Prefeitura do Rio de Janeiro e IplanRio"
        className="h-10 w-auto"
      />
    </div>
  </button>
);

const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://x.com/IplanRio_rj"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="Twitter"
    >
      <Twitter size={20} />
    </a>

    <a
      href="https://www.youtube.com/@iplanrio-empresamunicipald5095"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="YouTube"
    >
      <Youtube size={20} />
    </a>
    <a
      href="https://github.com/prefeitura-rio"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="GitHub"
    >
      <Github size={20} />
    </a>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const navLinks: { name: string; view: View }[] = [
    { name: 'Home', view: 'home' },
    { name: 'Chat', view: 'chat' },
    { name: 'Open Source', view: 'opensource' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logos onNavigate={onNavigate} />
          <SocialIcons />
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <li key={link.view}>
                    <button
                      onClick={() => onNavigate(link.view)}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        currentView === link.view
                          ? 'text-rio-primary'
                          : 'text-prose hover:text-rio-primary'
                      }`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
