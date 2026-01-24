/**
 * React components for the Rio-AI application.
 *
 * This module exports all public components using named exports
 * for consistency and better tree-shaking.
 *
 * @module components
 */

// Layout components
export { Header } from './Header';

// Hero & Landing
export { Hero } from './Hero';
export { HeroTitleAnimation } from './HeroTitleAnimation';

// Page sections
export { ChatSection } from './ChatSection';
export { OpenSourceSection } from './OpenSourceSection';

// Model display
export { ModelCard } from './ModelCard';
export { ModelDetailView } from './ModelDetailView';

// Utilities
export { AnimateOnScroll } from './AnimateOnScroll';
export { ErrorBoundary, SectionErrorBoundary, ChatErrorBoundary } from './ErrorBoundary';

// UI components
export { Button } from './ui/Button';
export { Badge } from './ui/Badge';
export { Card } from './ui/Card';
