import type { Model } from './types/index';
import { Code2, Terminal, Eye, Search } from 'lucide-react';
import { ModelGlyphXL, ModelGlyphL, ModelGlyphM, ModelGlyphS } from './components/icons/ModelSizeGlyphs';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 3.0 Open',
    description:
      'Modelo open source principal da geração 3.0, equilibrando qualidade e custo para uso amplo.',
    category: 'Open Source',
    Icon: ModelGlyphXL,
    tags: ['235B parâmetros · 22B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen3-235B-A22B-Thinking-2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507',
    parameters: '235 Bilhões (22B ativados)',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
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
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open',
  },
  {
    name: 'Rio 3.0 Open Mini',
    description:
      'Modelo open source compacto da geração 3.0, pensado para eficiência e experimentação rápida.',
    category: 'Open Source',
    Icon: ModelGlyphM,
    tags: ['4B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 4B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-4B-Thinking-2507',
    parameters: '4 Bilhões',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
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
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Mini',
  },
  {
    name: 'Rio 3.0 Open Nano',
    description:
      'Modelo open source ultracompacto da geração 3.0, otimizado para baixa latência e cenários com recursos limitados.',
    category: 'Open Source',
    Icon: ModelGlyphS,
    tags: ['1.7B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 1.7B',
    parameters: '1.7 Bilhões',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Nano',
  },
  {
    name: 'Rio 2.5 Open',
    description:
      'Uma versão aberta do futuro. Este modelo open source, baseado no Qwen 3, oferece um equilíbrio excepcional entre performance e eficiência.',
    category: 'Open Source',
    Icon: ModelGlyphL,
    tags: ['30B parâmetros · 3B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 30B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507',
    parameters: '30 Bilhões (3B ativados)',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
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
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-2.5-Open',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-open")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-open")

# Experimente a nova geração de modelos Rio!`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-open",
  "messages": [{"role": "user", "content": "Quais as novidades do Rio 2.5?"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5 Open VL',
    description:
      'Modelo open source multimodal da geração 2.5,\nprojetado para tarefas de visão e linguagem.',
    category: 'Open Source',
    Icon: Eye,
    tags: ['4B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 VL 4b',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-2.5-Open-VL',
  },
  {
    name: 'Rio 3.0 Open Search',
    description:
      'Modelo open source voltado para busca e recuperação de informação, ideal para experiências de pesquisa e RAG.',
    category: 'Open Source',
    Icon: Search,
    tags: ['235B parâmetros · 22B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 235B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Search',
  },
];
