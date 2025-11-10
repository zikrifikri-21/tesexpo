import React, { useState, useCallback, useContext } from 'react';
import { editImageCloud } from '../services/geminiService';
import { editImageLocal } from '../services/huggingFaceService';
import { Button } from './common/Button';
import { TextInput } from './common/TextInput';
import ImageDropzone from './common/ImageDropzone';
import Spinner from './common/Spinner';
import { AlertTriangleIcon, DownloadIcon } from './common/Icons';
import { ModelContext } from '../contexts/ModelContext';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { editorEngine, localModels } = useContext(ModelContext);

  const isLocalModelReady = localModels.editor.status === 'ready';

  const handleImageUpload = (file: File) => {
    setError(null);
    setEditedImage(null);
    setOriginalImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditImage = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }

    if (editorEngine === 'local' && !isLocalModelReady) {
      setError('The local editor model is not ready. Please download it from the settings.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      let result: string;
      if (editorEngine === 'local') {
        result = await editImageLocal(originalImage, prompt);
      } else {
        const base64Image = originalImage?.split(',')[1];
        if (!base64Image || !originalImageFile) {
          throw new Error('Could not read the image data.');
        }
        result = await editImageCloud(base64Image, originalImageFile.type, prompt);
      }
      setEditedImage(result);
    } catch (err: any) {
      console.error('Error editing image:', err);
      setError(`Failed to edit image. ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage, originalImageFile, editorEngine, isLocalModelReady]);

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const engineName = editorEngine === 'local' ? 'Local Engine' : 'Cloud Engine';

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2">1. Upload Image</h2>
          <ImageDropzone onImageDrop={handleImageUpload} currentImage={originalImage} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
             <h2 className="text-xl font-bold">2. Describe Your Edit</h2>
             <span className="text-sm font-semibold bg-gray-200 px-2 py-1 border border-black">{engineName}</span>
          </div>

          <TextInput
            placeholder="e.g., Add a retro filter, make it black and white..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!originalImage}
          />
          <Button onClick={handleEditImage} disabled={!originalImage || !prompt || isLoading} className="mt-auto">
            {isLoading ? <Spinner /> : 'Edit Image'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="border-2 border-black bg-red-100 p-4 flex items-center gap-3">
          <AlertTriangleIcon className="w-6 h-6 text-red-600"/>
          <p className="font-bold text-red-700">{error}</p>
        </div>
      )}

      {isLoading && (
         <div className="text-center p-4 border-2 border-black bg-blue-100">
            <p className="font-bold">Editing in progress... Please wait.</p>
            {editorEngine === 'local' && <p className="text-sm">Local models can be slower, especially on the first run.</p>}
         </div>
      )}

      {editedImage && (
        <div>
            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
                <h2 className="text-xl font-bold">3. Result</h2>
                <Button onClick={handleDownload} className="w-auto !py-2 !px-4" disabled={!editedImage}>
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download
                </Button>
            </div>
          <div className="border-2 border-black shadow-neo">
             <img src={editedImage} alt="Edited result" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;