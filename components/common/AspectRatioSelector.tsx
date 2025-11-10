import React from 'react';
import { AspectRatio } from '../../constants';

interface AspectRatioSelectorProps {
  options: { value: AspectRatio; label:string }[];
  selected: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ options, selected, onChange, disabled = false }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 ${disabled ? 'opacity-50' : ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`font-bold p-3 border-2 border-black text-center transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed
            ${selected === option.value
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-yellow-100 shadow-neo-sm hover:shadow-none transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none disabled:bg-gray-200'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;