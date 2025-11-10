
import React, { useCallback } from 'react';
import { UploadCloudIcon } from './Icons';

interface ImageDropzoneProps {
  onImageDrop: (file: File) => void;
  currentImage: string | null;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageDrop, currentImage }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageDrop(event.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if(event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageDrop(event.dataTransfer.files[0]);
    }
  }, [onImageDrop]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <label
      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-black border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {currentImage ? (
        <img src={currentImage} alt="Uploaded preview" className="object-contain w-full h-full" />
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <UploadCloudIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
        </div>
      )}
      <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
    </label>
  );
};

export default ImageDropzone;
