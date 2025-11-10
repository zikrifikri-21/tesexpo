import React, { useContext } from 'react';
import { ModelContext } from '../contexts/ModelContext';
import { MODEL_CONFIG, ModelId } from '../constants';
import { Button } from './common/Button';
import { XIcon } from './common/Icons';

interface ModelSettingsProps {
  onClose: () => void;
}

const ModelSettings: React.FC<ModelSettingsProps> = ({ onClose }) => {
  const { 
    editorEngine, setEditorEngine, 
    generatorEngine, setGeneratorEngine, 
    localModels, downloadLocalModel 
  } = useContext(ModelContext);

  const renderModelCard = (modelId: ModelId, currentEngine: 'cloud' | 'local', setEngine: (e: 'cloud' | 'local') => void) => {
    const model = localModels[modelId];
    const config = MODEL_CONFIG[modelId];
    const isLocalReady = model.status === 'ready';

    const getStatusText = () => {
        switch (model.status) {
            case 'not_downloaded': return <span className="text-gray-500">Not Downloaded</span>;
            case 'downloading': return <span className="text-blue-600">Downloading...</span>;
            case 'ready': return <span className="text-green-600 font-bold">Ready for Offline Use</span>;
        }
    };

    return (
        <div className="border-2 border-black p-4 bg-white flex flex-col gap-3">
            <h3 className="text-lg font-bold">{config.name}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
            
            <div className="flex gap-2 my-2">
                <button onClick={() => setEngine('cloud')} className={`flex-1 p-2 border-2 border-black font-semibold ${currentEngine === 'cloud' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    Cloud Engine
                </button>
                <button onClick={() => setEngine('local')} disabled={!isLocalReady} className={`flex-1 p-2 border-2 border-black font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed ${currentEngine === 'local' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    Local Engine
                </button>
            </div>

            <div className="border-t-2 border-black pt-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">Local Model Status:</p>
                    {getStatusText()}
                </div>
                {model.status === 'downloading' && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 border border-black">
                            <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none" style={{ width: `${model.progress}%` }}>
                                {model.progress.toFixed(0)}%
                            </div>
                        </div>
                        <p className="text-xs text-center mt-1 truncate">{model.file}</p>
                    </div>
                )}
                 {model.status !== 'ready' && model.status !== 'downloading' && (
                    <Button onClick={() => downloadLocalModel(modelId)} className="w-full mt-2 !py-2">
                        Download Model (~{config.size})
                    </Button>
                 )}
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-rose-100 border-2 border-black shadow-neo p-6 relative">
        <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
            <h2 className="text-2xl font-bold">Model Settings</h2>
            <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-200">
                <XIcon className="w-6 h-6"/>
            </button>
        </div>
        
        <div className="flex flex-col gap-6">
            {renderModelCard('generator', generatorEngine, setGeneratorEngine)}
            {renderModelCard('editor', editorEngine, setEditorEngine)}
        </div>
      </div>
    </div>
  );
};

export default ModelSettings;