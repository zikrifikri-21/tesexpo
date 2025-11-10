// This service handles all interactions with the local Hugging Face models.
import { MODEL_CONFIG, ModelId, ProgressCallback } from '../constants';

// Type assertion for the Transformers.js library from the CDN, accessed via the window object.
declare global {
    interface Window {
        transformers: any;
    }
}

// Create a promise that resolves when the Transformers.js library is loaded and ready.
// This prevents race conditions where the library is called before it's initialized.
const transformersReady = new Promise<any>((resolve, reject) => {
    if (window.transformers) {
        return resolve(window.transformers);
    }
    
    // Poll for the library to become available on the window object.
    const interval = setInterval(() => {
        if (window.transformers) {
            clearInterval(interval);
            resolve(window.transformers);
        }
    }, 100);

    // Add a timeout to fail gracefully if the script doesn't load.
    setTimeout(() => {
        clearInterval(interval);
        if (!window.transformers) {
            reject(new Error("Timeout: Transformers.js library failed to load."));
        }
    }, 60000); // 60 second timeout
});


class HuggingFacePipeline {
  private static instances = new Map<ModelId, any>();

  static async getInstance(modelId: ModelId, progressCallback: ProgressCallback) {
    // Wait for the transformers library to be loaded before proceeding.
    const transformers = await transformersReady;
    
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