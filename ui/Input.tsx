import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  isOptional?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', containerClassName = '', isOptional = false, ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {isOptional && <span className="text-gray-500 text-xs">(Opcional)</span>}
      </label>
      <input
        type="text"
        id={id}
        className={`mt-1 block w-full border-pdc-b border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;