import React, { useMemo } from 'react';
import { OrderItem, AggregatedBrick, BrickSize } from '../types';
import { Layers, Trash2, PackageOpen, X } from 'lucide-react';
import { COLORS } from '../constants';

interface SummaryPanelProps {
  orders: OrderItem[];
  onClear: () => void;
  onRemoveItem: (layer: number, colorId: string, size: BrickSize) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ orders, onClear, onRemoveItem }) => {
  // Aggregate Logic: Group by Color+Size
  const aggregatedOrders = useMemo(() => {
    const map = new Map<string, AggregatedBrick>();

    orders.forEach((item) => {
      if (item.quantity === 0) return;

      const key = `${item.colorId}-${item.size}`;
      if (!map.has(key)) {
        const colorName = Object.values(COLORS).find(c => c.id === item.colorId)?.name || item.colorId;
        map.set(key, {
          colorId: item.colorId,
          colorName,
          size: item.size,
          totalQuantity: 0,
          layers: {},
        });
      }

      const entry = map.get(key)!;
      entry.totalQuantity += item.quantity;
      entry.layers[item.layer] = (entry.layers[item.layer] || 0) + item.quantity;
    });

    return Array.from(map.values());
  }, [orders]);

  if (aggregatedOrders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <PackageOpen size={48} className="mb-4 opacity-50" />
        <p className="text-sm font-medium text-gray-900">Belum ada pesanan</p>
        <p className="text-xs text-gray-500 mt-1">Pilih spesifikasi bricks dan tambahkan ke keranjang.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <Layers size={18} />
           <h2 className="font-bold">Ringkasan Pesanan</h2>
        </div>
        <button 
            onClick={onClear}
            className="text-xs bg-red-500/20 hover:bg-red-500 hover:text-white text-red-200 px-2 py-1.5 rounded transition-colors flex items-center gap-1"
        >
            <Trash2 size={12} /> Reset
        </button>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
        {aggregatedOrders.map((brick) => (
          <div key={`${brick.colorId}-${brick.size}`} className="relative pl-4 border-l-4 border-indigo-500 bg-gray-50/50 rounded-r-lg p-2">
            {/* Main Header */}
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-base">
                <span className={COLORS[brick.colorId]?.textColorClass.replace('text-white', 'text-gray-800').replace('text-cyan-900', 'text-cyan-700') || ''}>
                    {brick.colorName}
                </span> 
                <span className="mx-1 text-gray-400 text-xs">x</span> 
                {brick.size}
              </h3>
              <span className="font-bold bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                {brick.totalQuantity}
              </span>
            </div>

            <div className="w-full h-px bg-gray-200 mb-2 opacity-50"></div>

            {/* Sub-list: Layers */}
            <div className="space-y-1">
              {Object.entries(brick.layers)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([layer, qty]) => (
                <div key={layer} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded shadow-sm border border-gray-100 group">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 text-xs font-bold">
                       Layer {layer}
                    </span>
                    <span className="text-gray-900 font-medium">
                        {qty} <span className="text-gray-400 font-normal text-xs">bricks</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => onRemoveItem(Number(layer), brick.colorId, brick.size)}
                    className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus item ini"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 font-medium">
        Total: {aggregatedOrders.reduce((acc, curr) => acc + curr.totalQuantity, 0)} bricks
      </div>
    </div>
  );
};

export default SummaryPanel;