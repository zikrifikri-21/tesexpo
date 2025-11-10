
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-3 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-200 ${className}`}
      type="text"
      {...props}
    />
  );
};
