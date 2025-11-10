import React, { useState, useCallback, useContext } from 'react';
import { generateImageCloud } from '../services/geminiService';
import { generateImageLocal } from '../services/huggingFaceService';
import { AspectRatio, ASPECT_RATIO_OPTIONS } from '../constants';
import { Button } from './common/Button';
import { TextInput } from './common/TextInput';
import Spinner from './common/Spinner';
import AspectRatioSelector from './common/AspectRatioSelector';
import { AlertTriangleIcon, DownloadIcon } from './common/Icons';
import { ModelContext } from '../contexts/ModelContext';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { generatorEngine, localModels } = useContext(ModelContext);

  const isLocalModelReady = localModels.generator.status === 'ready';

  const handleGenerateImage = useCallback(async () => {
    if (!prompt) {
      setError('Please provide a prompt to generate an image.');
      return;
    }

    if (generatorEngine === 'local' && !isLocalModelReady) {
      setError('The local generator model is not ready. Please download it from the settings.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let result: string;
      if (generatorEngine === 'local') {
        result = await generateImageLocal(prompt, () => {});
      } else {
        result = await generateImageCloud(prompt, aspectRatio);
      }
      setGeneratedImage(result);
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(`Failed to generate image. ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, generatorEngine, isLocalModelReady]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const engineName = generatorEngine === 'local' ? 'Local Engine' : 'Cloud Engine';

  return (
    <div className="flex flex-col gap-6">
       <div className="flex justify-between items-center border-b-2 border-black pb-2">
         <h2 className="text-xl font-bold">1. Describe Your Image</h2>
         <span className="text-sm font-semibold bg-gray-200 px-2 py-1 border border-black">{engineName}</span>
      </div>
      <TextInput
        placeholder="e.g., A robot holding a red skateboard, high detail"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

       <div className="flex flex-col gap-4">
         <h2 className="text-xl font-bold border-b-2 border-black pb-2">2. Choose Aspect Ratio</h2>
         <AspectRatioSelector
            options={ASPECT_RATIO_OPTIONS}
            selected={aspectRatio}
            onChange={setAspectRatio}
            disabled={generatorEngine === 'local'}
         />
         {generatorEngine === 'local' && <p className="text-sm text-gray-600 -mt-2">Aspect ratio is fixed for the current local model.</p>}
      </div>
      
      <Button onClick={handleGenerateImage} disabled={!prompt || isLoading}>
        {isLoading ? <Spinner /> : 'Generate Image'}
      </Button>

      {error && (
        <div className="border-2 border-black bg-red-100 p-4 flex items-center gap-3">
            <AlertTriangleIcon className="w-6 h-6 text-red-600"/>
            <p className="font-bold text-red-700">{error}</p>
        </div>
      )}
      
      {isLoading && (
        <div className="text-center p-4 border-2 border-black bg-blue-100">
            <p className="font-bold">Generating image... This may take a moment.</p>
            {generatorEngine === 'local' && <p className="text-sm">Local models can be slower, especially on the first run.</p>}
        </div>
      )}

      {generatedImage && (
        <div>
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
            <h2 className="text-xl font-bold">3. Result</h2>
            <Button onClick={handleDownload} className="w-auto !py-2 !px-4" disabled={!generatedImage}>
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download
            </Button>
          </div>
          <div className="border-2 border-black shadow-neo">
             <img src={generatedImage} alt="Generated result" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;