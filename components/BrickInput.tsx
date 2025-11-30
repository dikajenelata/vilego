import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { BrickColor } from '../types';

interface BrickInputProps {
  size: string;
  color: BrickColor;
  value: number;
  onChange: (val: number) => void;
}

const BrickInput: React.FC<BrickInputProps> = ({ size, color, value, onChange }) => {
  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  // Safe width calculation
  let widthVal = '2rem';
  if (size === 'PELAT') {
    widthVal = '3rem';
  } else {
    const parts = size.split('x');
    if (parts.length === 2) {
        widthVal = `${Math.max(2, parseInt(parts[1]) * 0.8)}rem`;
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
      <div className="flex items-center space-x-3">
        {/* Visual representation of the brick */}
        <div 
          className={`h-8 rounded shadow-sm flex items-center justify-center text-[10px] font-bold ${color.hexClass} ${color.textColorClass}`}
          style={{ width: widthVal }} 
        >
          {size}
        </div>
        <span className="text-sm font-medium text-gray-700">{size}</span>
      </div>

      <div className="flex items-center bg-white rounded-md border border-gray-300 shadow-sm">
        <button 
          onClick={handleDecrement}
          disabled={value === 0}
          className="p-1.5 text-gray-500 hover:text-red-500 disabled:opacity-30 transition-colors"
        >
          <Minus size={14} />
        </button>
        <div className="w-8 text-center font-semibold text-gray-900 text-sm select-none">
          {value}
        </div>
        <button 
          onClick={handleIncrement}
          className="p-1.5 text-gray-500 hover:text-green-600 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default BrickInput;