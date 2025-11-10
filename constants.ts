export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "3:4", label: "Portrait (3:4)" },
  { value: "4:3", label: "Landscape (4:3)" },
  { value: "9:16", label: "Tall (9:16)" },
  { value: "16:9", label: "Wide (16:9)" },
];

// Types for local models
export type ModelId = 'generator' | 'editor';
export type ModelTask = 'text-to-image' | 'image-to-image';

export interface ModelStatus {
    status: string;
    file: string;
    progress: number;
}
export type ProgressCallback = (progress: ModelStatus) => void;

interface ModelConfig {
  name: string;
  description: string;
  model: string;
  task: ModelTask;
  size: string;
}

export const MODEL_CONFIG: Record<ModelId, ModelConfig> = {
  generator: {
    name: 'Image Generator (Stable Diffusion)',
    description: 'Creates images from text prompts. Runs completely on your device.',
    model: 'Xenova/sd-turbo',
    task: 'text-to-image',
    size: '1.2 GB'
  },
  editor: {
    name: 'Image Editor (InstructPix2Pix)',
    description: 'Edits an existing image based on your text instructions.',
    model: 'Xenova/instruct-pix2pix-224-224-fp16',
    task: 'image-to-image',
    size: '1.9 GB'
  }
};