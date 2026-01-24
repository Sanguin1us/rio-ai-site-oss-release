import type { Model } from './types/index';
import { Code2, Terminal, FlaskConical } from 'lucide-react';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 2.5 Open',
    description:
      'Uma versão aberta do futuro. Este modelo open source, baseado no Qwen 3, oferece um equilíbrio excepcional entre performance e eficiência.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '30B Parâmetros'],
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
    huggingFaceUrl: 'https://huggingface.co/IPLANRIO/rio-2.5-open',
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
    name: 'Rio 3.0 Open Mini',
    description:
      'Modelo open source compacto da geração 3.0, pensado para eficiência e experimentação rápida.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '4B Parâmetros', 'Geração 3.0', 'Compacto'],
    isOpenSource: true,
    baseModel: 'Qwen3-4B-Thinking-2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-4B-Thinking-2507',
    parameters: '4 Bilhões',
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
  },
  {
    name: 'Rio 3.0 Open',
    description:
      'Modelo open source principal da geração 3.0, equilibrando qualidade e custo para uso amplo.',
    category: 'Open Source',
    Icon: FlaskConical,
    tags: ['Open Source', 'CC BY 4.0', '235B Parâmetros', 'Geração 3.0'],
    isOpenSource: true,
    baseModel: 'Qwen3-235B-A22B-Thinking-2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507',
    parameters: '235 Bilhões (22B ativados)',
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
  },
  {
    name: 'Rio 2.0 Open',
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
];
