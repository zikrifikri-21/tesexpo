
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full bg-lime-300 border-2 border-black text-black font-bold py-3 px-6 shadow-neo hover:shadow-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-150 ease-in-out transform hover:-translate-x-1 hover:-translate-y-1 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isActive: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ children, isActive, ...props }) => {
    return (
        <button
            className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 font-bold text-lg flex items-center justify-center transition-colors duration-200 ease-in-out border-black -mb-[2px]
                ${isActive
                    ? 'bg-white border-t-2 border-l-2 border-r-2 text-black'
                    : 'bg-gray-200 border-2 border-transparent hover:bg-gray-300'
                }`
            }
            {...props}
        >
            {children}
        </button>
    );
};
