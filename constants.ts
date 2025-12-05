import type { Model } from './types';
import {
  Bot,
  Cpu,
  Code2,
  FileText,
  Mic,
  ScanSearch,
  GitBranch,
  Aperture,
  BoxSelect,
  Volume2,
  FlaskConical,
  GraduationCap,
  Hammer,
  Terminal,
  Sparkles,
  Brain,
  Globe,
  Eye,
  Scan,
  AudioLines,
  Binary,
  Atom,
  Music,
  Palette,
  Box,
  Map,
} from 'lucide-react';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 2.0 Omni',
    description:
      'Nosso modelo flagship multimodal, unindo as capacidades de Transcrição, ML, Search e Visão em uma única e poderosa IA.',
    category: 'Flagship',
    Icon: Sparkles,
    tags: ['Flagship', 'Multimodal', 'State-of-the-art'],
    supportsChat: true,
  },
  {
    name: 'Rio 2.5 Omni',
    description:
      'Nosso modelo flagship multimodal, unindo as capacidades de Transcrição, ML, Search e Visão em uma única e poderosa IA.',
    category: 'Flagship',
    Icon: Sparkles,
    tags: ['Flagship', 'Multimodal', 'State-of-the-art'],
    supportsChat: true,
  },
  {
    name: 'Rio 2.0',
    description:
      'Modelo de linguagem de grande escala pós-treinado a partir do Qwen 2.5 32B para alta performance em tarefas complexas.',
    category: 'Linguagem',
    Icon: Brain,
    tags: ['Linguagem', '32B Parâmetros'],
    baseModel: 'Qwen 2.5 32B Instruct',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen2.5-32B-Instruct',
    parameters: '32 Bilhões',
    license: 'Uso proprietário (não open source)',
    codeSnippets: [
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.0-32b",
  "messages": [{"role": "user", "content": "Resuma o plano diretor de mobilidade do Rio."}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5',
    description:
      'Modelo de linguagem de grande escala pós-treinado a partir do Qwen3-Next para alta performance em tarefas complexas.',
    category: 'Linguagem',
    Icon: Brain,
    tags: ['Linguagem', '80B Parâmetros'],
    baseModel: 'Qwen3-Next',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-Next',
    parameters: '80 Bilhões (3B ativados)',
    license: 'Uso proprietário (não open source)',
    codeSnippets: [
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5",
  "messages": [{"role": "user", "content": "Resuma o plano diretor de mobilidade do Rio."}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5 Preview',
    description:
      'Uma prévia do futuro. Este modelo open source, baseado no Qwen 3, oferece um equilíbrio excepcional entre performance e eficiência.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '30B Parâmetros', 'Research Preview'],
    isOpenSource: true,
    baseModel: 'Qwen 3 30B-A3B 2507 Thinking',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507',
    parameters: '30 Bilhões (3B ativados)',
    license: 'Creative Commons Attribution 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.en',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.5-preview',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-preview")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-preview")

# Experimente a nova geração de modelos Rio!`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-preview",
  "messages": [{"role": "user", "content": "Quais as novidades do Rio 2.5?"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 Preview',
    description:
      'Versão open source de alta performance, pós-treinada a partir do Qwen 2.5 14B, ideal para pesquisa e desenvolvimento.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '14B Parâmetros'],
    isOpenSource: true,
    baseModel: 'Qwen 2.5 14B Instruct',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen2.5-14B-Instruct',
    parameters: '14 Bilhões',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.en',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.0-14b',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.0-14b")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.0-14b")

# Seu código de inferência aqui...`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.0-14b",
  "messages": [{"role": "user", "content": "Oi, Rio!"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.0 Search',
    description:
      'Variante do Rio 2.0 otimizada para pesquisas na web, oferecendo respostas rápidas e custo-eficientes.',
    category: 'Busca',
    Icon: Globe,
    tags: ['Busca na Web', 'Rápido', 'Custo-eficiente', 'Open Source'],
    isOpenSource: true,
  },
  {
    name: 'Rio 2.5 Search',
    description:
      'Variante do Rio 2.5 otimizada para pesquisas na web, oferecendo respostas rápidas e custo-eficientes.',
    category: 'Busca',
    Icon: Globe,
    tags: ['Busca na Web', 'Rápido', 'Custo-eficiente', 'Open Source'],
    isOpenSource: true,
  },
  {
    name: 'Rio 2.0 Visão',
    description:
      'Especializado em visão computacional, com foco em OCR e VQA para documentos em português do Brasil.',
    category: 'Visão',
    Icon: Eye,
    tags: ['Visão', 'OCR', 'VQA', 'PT-BR'],
  },
  {
    name: 'Rio 2.5 Visão',
    description:
      'Especializado em visão computacional, com foco em OCR e VQA para documentos em português do Brasil.',
    category: 'Visão',
    Icon: Eye,
    tags: ['Visão', 'OCR', 'VQA', 'PT-BR'],
  },
  {
    name: 'Rio 2.0 Grounding',
    description:
      'Treinado para detectar e localizar objetos em imagens com precisão, utilizando bounding boxes e pontos.',
    category: 'Visão',
    Icon: Scan,
    tags: ['Visão', 'Detecção de Objetos', 'Grounding'],
  },
  {
    name: 'Rio 2.5 Grounding',
    description:
      'Treinado para detectar e localizar objetos em imagens com precisão, utilizando bounding boxes e pontos.',
    category: 'Visão',
    Icon: Scan,
    tags: ['Visão', 'Detecção de Objetos', 'Grounding'],
  },
  {
    name: 'Rio 2.0 Transcrição',
    description:
      'State-of-the-art em transcrição de áudio para texto, com especialização em português do Brasil e inglês.',
    category: 'Áudio',
    Icon: AudioLines,
    tags: ['Áudio', 'Transcrição', 'State-of-the-art', 'PT-BR'],
  },
  {
    name: 'Rio 2.5 Transcrição',
    description:
      'State-of-the-art em transcrição de áudio para texto, com especialização em português do Brasil e inglês.',
    category: 'Áudio',
    Icon: AudioLines,
    tags: ['Áudio', 'Transcrição', 'State-of-the-art', 'PT-BR'],
  },
  {
    name: 'Rio 2.0 Voz',
    description:
      'Gera áudio natural e realista a partir de texto, considerado state-of-the-art para sotaques brasileiros.',
    category: 'Áudio',
    Icon: Volume2,
    tags: ['Áudio', 'Text-to-Speech', 'Sotaques Brasileiros'],
  },
  {
    name: 'Rio 2.5 Voz',
    description:
      'Gera áudio natural e realista a partir de texto, considerado state-of-the-art para sotaques brasileiros.',
    category: 'Áudio',
    Icon: Volume2,
    tags: ['Áudio', 'Text-to-Speech', 'Sotaques Brasileiros'],
  },
  {
    name: 'Rio 2.0 ML',
    description:
      'Especializado em programação, com foco em machine learning e desenvolvimento de kernels de alta performance.',
    category: 'Código',
    Icon: Binary,
    tags: ['Código', 'Machine Learning', 'Kaggle'],
  },
  {
    name: 'Rio 2.5 ML',
    description:
      'Especializado em programação, com foco em machine learning e desenvolvimento de kernels de alta performance.',
    category: 'Código',
    Icon: Binary,
    tags: ['Código', 'Machine Learning', 'Kaggle'],
  },
];
