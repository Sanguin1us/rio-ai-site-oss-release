import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ChatSection } from './components/ChatSection';
import { OpenSourceSection } from './components/OpenSourceSection';
import { ModelDetailView } from './components/ModelDetailView';
import { ErrorBoundary, ChatErrorBoundary, SectionErrorBoundary } from './components/ErrorBoundary';
import type { Model, View } from './types/index';
import { RIO_MODELS } from './constants';

function App() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedModel(null);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setSelectedModel(null);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatErrorBoundary>
            <ChatSection />
          </ChatErrorBoundary>
        );
      case 'opensource': {
        const openSourceModels = RIO_MODELS.filter(
          (m) => m.isOpenSource && m.name.includes('Open'),
        );
        return openSourceModels.length > 0 ? (
          <SectionErrorBoundary sectionName="OpenSource">
            <OpenSourceSection models={openSourceModels} onSelectModel={handleSelectModel} />
          </SectionErrorBoundary>
        ) : null;
      }
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <ErrorBoundary name="App">
      <div className="min-h-screen bg-white font-sans">
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main>
          {selectedModel ? (
            <ErrorBoundary name="ModelDetail">
              <ModelDetailView model={selectedModel} onBack={handleBack} />
            </ErrorBoundary>
          ) : (
            renderView()
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
