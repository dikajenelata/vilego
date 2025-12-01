import React, { useMemo, useState } from 'react';
import { OrderItem, AggregatedBrick, BrickSize } from '../types';
import { Layers, Trash2, PackageOpen, X, Box } from 'lucide-react';
import { COLORS } from '../constants';

interface SummaryPanelProps {
  orders: OrderItem[];
  onClear: () => void;
  onRemoveItem: (layer: number, colorId: string, size: BrickSize) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ orders, onClear, onRemoveItem }) => {
  const [groupBy, setGroupBy] = useState<'brick' | 'layer'>('brick');

  // Aggregate Logic: Group by Brick (Color+Size) -> Layer
  const aggregatedByBrick = useMemo(() => {
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

  // Aggregate Logic: Group by Layer -> Brick
  const aggregatedByLayer = useMemo(() => {
    const map = new Map<number, {
        layer: number,
        totalQuantity: number,
        items: Array<{ colorId: string, colorName: string, size: BrickSize, quantity: number }>
    }>();

    orders.forEach((item) => {
      if (item.quantity === 0) return;

      if (!map.has(item.layer)) {
        map.set(item.layer, {
            layer: item.layer,
            totalQuantity: 0,
            items: []
        });
      }

      const layerGroup = map.get(item.layer)!;
      
      const existingItem = layerGroup.items.find(i => i.colorId === item.colorId && i.size === item.size);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        const colorName = Object.values(COLORS).find(c => c.id === item.colorId)?.name || item.colorId;
        layerGroup.items.push({
            colorId: item.colorId,
            colorName,
            size: item.size,
            quantity: item.quantity
        });
      }
      
      layerGroup.totalQuantity += item.quantity;
    });

    // Sort layers ascending
    return Array.from(map.values()).sort((a, b) => a.layer - b.layer);
  }, [orders]);

  if (orders.length === 0) {
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
      {/* Header */}
      <div className="p-4 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
           <Layers size={18} />
           <h2 className="font-bold">Ringkasan Pesanan</h2>
        </div>
        <button 
            type="button"
            onClick={onClear}
            className="text-xs bg-red-500/20 hover:bg-red-500 hover:text-white text-red-200 px-2 py-1.5 rounded transition-colors flex items-center gap-1"
        >
            <Trash2 size={12} /> Reset
        </button>
      </div>

      {/* View Toggle */}
      <div className="p-2 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex bg-gray-200/50 p-1 rounded-lg">
            <button 
                type="button"
                onClick={() => setGroupBy('brick')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${
                    groupBy === 'brick' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Box size={14} /> By Brick
            </button>
            <button 
                type="button"
                onClick={() => setGroupBy('layer')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${
                    groupBy === 'layer' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Layers size={14} /> By Layer
            </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto p-4 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
        
        {groupBy === 'brick' ? (
             // Group by Brick (Existing)
             aggregatedByBrick.map((brick) => (
                <div key={`${brick.colorId}-${brick.size}`} className="relative pl-4 border-l-4 border-indigo-500 bg-gray-50/50 rounded-r-lg p-2">
                    {/* Header: Brick Type */}
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
                            type="button"
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
             ))
        ) : (
            // Group by Layer (New)
            aggregatedByLayer.map((group) => (
                <div key={group.layer} className="relative pl-4 border-l-4 border-indigo-500 bg-gray-50/50 rounded-r-lg p-2">
                    {/* Header: Layer */}
                    <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-bold text-indigo-700 text-base">
                            Layer {group.layer}
                        </h3>
                        <span className="font-bold bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-200">
                            {group.totalQuantity} items
                        </span>
                    </div>

                    <div className="w-full h-px bg-gray-200 mb-2 opacity-50"></div>

                     {/* Sub-list: Bricks */}
                     <div className="space-y-1">
                        {group.items.map((item) => (
                            <div key={`${item.colorId}-${item.size}`} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded shadow-sm border border-gray-100 group">
                                <div className="flex items-center gap-2">
                                     {/* Color Dot */}
                                     <div className={`w-3 h-3 rounded-full ${COLORS[item.colorId]?.hexClass} border border-black/10`}></div>
                                     <span className="text-gray-900 font-medium">
                                        {item.colorName} {item.size}
                                     </span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-900 font-bold">
                                        {item.quantity}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => onRemoveItem(group.layer, item.colorId, item.size)}
                                        className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Hapus item ini"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            ))
        )}

      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 font-medium shrink-0">
        Total: {orders.reduce((acc, curr) => acc + curr.quantity, 0)} bricks
      </div>
    </div>
  );
};

export default SummaryPanel;