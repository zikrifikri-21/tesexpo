import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { downloadModel } from '../services/huggingFaceService';
import { ModelId, ModelStatus, ProgressCallback } from '../constants';

type Engine = 'cloud' | 'local';

interface LocalModel {
  status: 'not_downloaded' | 'downloading' | 'ready';
  progress: number;
  file: string;
}

interface ModelContextState {
  editorEngine: Engine;
  generatorEngine: Engine;
  localModels: Record<ModelId, LocalModel>;
  setEditorEngine: (engine: Engine) => void;
  setGeneratorEngine: (engine: Engine) => void;
  downloadLocalModel: (modelId: ModelId) => Promise<void>;
}

export const ModelContext = createContext<ModelContextState>({} as ModelContextState);

export const ModelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editorEngine, setEditorEngine] = useState<Engine>('cloud');
  const [generatorEngine, setGeneratorEngine] = useState<Engine>('cloud');
  const [localModels, setLocalModels] = useState<Record<ModelId, LocalModel>>({
    editor: { status: 'not_downloaded', progress: 0, file: '' },
    generator: { status: 'not_downloaded', progress: 0, file: '' },
  });

  const downloadLocalModel = useCallback(async (modelId: ModelId) => {
    if (localModels[modelId].status === 'downloading' || localModels[modelId].status === 'ready') return;

    const progressCallback: ProgressCallback = (progress) => {
      setLocalModels(prev => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          progress: progress.progress,
          file: progress.file,
        },
      }));
    };
    
    setLocalModels(prev => ({
      ...prev,
      [modelId]: { ...prev[modelId], status: 'downloading', progress: 0 },
    }));

    try {
      await downloadModel(modelId, progressCallback);
      setLocalModels(prev => ({
        ...prev,
        [modelId]: { ...prev[modelId], status: 'ready', progress: 100 },
      }));
    } catch (error) {
      console.error("Failed to download model:", error);
      setLocalModels(prev => ({
        ...prev,
        [modelId]: { ...prev[modelId], status: 'not_downloaded', progress: 0 },
      }));
    }
  }, [localModels]);

  const value = {
    editorEngine,
    generatorEngine,
    localModels,
    setEditorEngine,
    setGeneratorEngine,
    downloadLocalModel,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};