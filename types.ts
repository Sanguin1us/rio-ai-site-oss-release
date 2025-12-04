
import type { LucideIcon } from 'lucide-react';

export interface UseCase {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface CodeSnippet {
  lang: string;
  code: string;
  Icon: LucideIcon;
}

export interface DatasetLink {
  label: string;
  url: string;
}

export interface Model {
  name: string;
  description: string;
  category: string;
  Icon: LucideIcon;
  tags: string[];
  isOpenSource?: boolean;
  supportsChat?: boolean;

  // Detailed view fields
  baseModel?: string;
  baseModelUrl?: string;
  parameters?: string;
  license?: string;
  licenseUrl?: string;
  datasets?: string[];
  datasetLinks?: DatasetLink[];
  useCases?: UseCase[];
  codeSnippets?: CodeSnippet[];
  huggingFaceUrl?: string;
}

export interface ResearchPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  tags: string[];
}
