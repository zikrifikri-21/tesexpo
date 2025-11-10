// This service handles all interactions with the local Hugging Face models.
import { MODEL_CONFIG, ModelId, ProgressCallback } from '../constants';

// Type assertion for the Transformers.js library from the CDN
declare const transformers: any;

class HuggingFacePipeline {
  private static instances = new Map<ModelId, any>();

  static async getInstance(modelId: ModelId, progressCallback: ProgressCallback) {
    if (!this.instances.has(modelId)) {
      const config = MODEL_CONFIG[modelId];
      if (!config) {
        throw new Error(`Invalid local model ID: ${modelId}`);
      }

      try {
        const instance = await transformers.pipeline(config.task, config.model, {
          progress_callback: (progress: any) => {
            progressCallback({
              status: progress.status,
              file: progress.file,
              progress: progress.progress,
            });
          },
        });
        this.instances.set(modelId, instance);
      } catch (err) {
        console.error(`Failed to load model: ${modelId}`, err);
        throw err;
      }
    }
    return this.instances.get(modelId);
  }
}

export const downloadModel = async (modelId: ModelId, progressCallback: ProgressCallback) => {
  await HuggingFacePipeline.getInstance(modelId, progressCallback);
};

export const generateImageLocal = async (prompt: string, progressCallback: ProgressCallback): Promise<string> => {
  const modelId: ModelId = 'generator';
  const generator = await HuggingFacePipeline.getInstance(modelId, progressCallback);
  
  const result = await generator(prompt, {
    height: 512,
    width: 512,
    num_inference_steps: 20,
  });

  return result.images[0].src;
};

export const editImageLocal = async (imageUrl: string, prompt: string): Promise<string> => {
  const modelId: ModelId = 'editor';
  const editor = await HuggingFacePipeline.getInstance(modelId, () => {}); // No progress needed for inference
  
  const result = await editor({
    image: imageUrl,
    prompt: prompt,
  });

  return result.src;
};