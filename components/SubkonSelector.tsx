import React from 'react';
import { SUBKONS } from '../constants';
import { Subkon } from '../types';
import { User, ArrowRight } from 'lucide-react';

interface SubkonSelectorProps {
  onSelect: (subkon: Subkon) => void;
}

const SubkonSelector: React.FC<SubkonSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Pemesanan Bricks</h1>
          <p className="opacity-90">Silahkan pilih Sub Kontraktor Anda</p>
        </div>
        
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Kontraktor <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            {SUBKONS.map((subkon) => (
              <button
                key={subkon.id}
                onClick={() => onSelect(subkon)}
                className="w-full group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{subkon.name}</h3>
                    <p className="text-sm text-gray-500">{subkon.description}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 text-xs text-gray-400 text-center">
          Sistem Pemesanan VILEGO Pre-Planning
        </div>
      </div>
    </div>
  );
};

export default SubkonSelector;