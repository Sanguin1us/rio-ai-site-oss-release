import React from 'react';
import type { Model } from '../../types';

interface DetailSpecsProps {
  model: Model;
}

const SpecItem: React.FC<{ label: string; value?: React.ReactNode | React.ReactNode[] }> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-prose-light">{label}</dt>
      <dd className="mt-1 text-sm text-prose sm:col-span-2 sm:mt-0">
        {Array.isArray(value) ? (
          <ul className="list-disc list-inside">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

const createLink = (label: string, url: string, className: string) => (
  <a href={url} target="_blank" rel="noreferrer" className={className}>
    {label}
  </a>
);

export const DetailSpecs: React.FC<DetailSpecsProps> = ({ model }) => {
  const isRioPreview = model.name === 'Rio 2.5 Preview';
  const linkClass = 'text-rio-primary hover:underline';
  const createLinkedValue = (label: string, url?: string) =>
    url ? createLink(label, url, linkClass) : label;

  const baseModelValue = model.baseModel
    ? createLinkedValue(
        model.baseModel,
        model.baseModelUrl ??
          (isRioPreview ? 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507' : undefined)
      )
    : undefined;

  const licenseLabel =
    model.license ?? (isRioPreview ? 'Creative Commons Attribution 4.0' : undefined);
  const licenseValue = licenseLabel
    ? createLinkedValue(
        licenseLabel,
        model.licenseUrl ??
          (isRioPreview ? 'https://creativecommons.org/licenses/by/4.0/deed.en' : undefined)
      )
    : undefined;

  const datasetLinkNodes =
    model.datasetLinks?.length
      ? model.datasetLinks.map((dataset) =>
          createLink(dataset.label, dataset.url, linkClass)
        )
      : isRioPreview
      ? [
          createLink(
            'nvidia/OpenScienceReasoning-2',
            'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
            linkClass
          ),
          createLink(
            'nvidia/Nemotron-Post-Training-Dataset-v1',
            'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
            linkClass
          ),
        ]
      : undefined;
  const datasetsValue = datasetLinkNodes ?? model.datasets;

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <h3 className="text-lg font-semibold text-prose p-4 border-b border-slate-200">Especificações</h3>
      <div className="px-4 divide-y divide-slate-200">
        <SpecItem label="Modelo Base" value={baseModelValue} />
        <SpecItem label="Parâmetros" value={model.parameters} />
        <SpecItem label="Licença" value={licenseValue} />
        <SpecItem label="Datasets" value={datasetsValue} />
      </div>
    </div>
  );
};
