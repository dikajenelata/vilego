import React, { useState } from 'react';
import { Subkon, OrderItem, BrickSize, BrickColor } from '../types';
import { BRICK_SIZES } from '../constants';
import SummaryPanel from './SummaryPanel';
import { ArrowLeft, Layers, Info, Check, ShoppingCart, Plus, Minus } from 'lucide-react';

interface OrderInterfaceProps {
  subkon: Subkon;
  onBack: () => void;
}

const BrickVisual = ({ size, color }: { size: BrickSize, color: BrickColor }) => {
    // Parse size. Assuming standard Lego naming where 2x4 means 2 studs width (columns) and 4 studs length (rows)
    // However, conventionally usually usually Width x Length.
    // Based on screenshot 2x4 is vertical. So 2 cols, 4 rows.
    const [cols, rows] = size.split('x').map(Number);
    const cellSize = 28; // px
    const gap = 4; // px
    
    return (
      <div 
        className={`${color.hexClass} rounded shadow-lg flex items-center justify-center relative p-1 transition-all duration-300 transform`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap}px`,
          width: `${cols * cellSize + (cols-1)*gap + 8}px`,
          height: `${rows * cellSize + (rows-1)*gap + 8}px`,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
           <div key={i} className="w-full h-full min-w-[12px] min-h-[12px] rounded-full bg-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] border border-black/5" />
        ))}
      </div>
    );
  };

const OrderInterface: React.FC<OrderInterfaceProps> = ({ subkon, onBack }) => {
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  
  // Builder State
  const [selectedSize, setSelectedSize] = useState<BrickSize>('2x4');
  const [selectedColor, setSelectedColor] = useState<BrickColor>(subkon.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddOrder = () => {
      setOrders(prev => {
          const existingIndex = prev.findIndex(o => 
              o.layer === currentLayer && 
              o.colorId === selectedColor.id && 
              o.size === selectedSize
          );

          if (existingIndex >= 0) {
              const newOrders = [...prev];
              newOrders[existingIndex] = {
                  ...newOrders[existingIndex],
                  quantity: newOrders[existingIndex].quantity + quantity
              };
              return newOrders;
          }

          return [...prev, {
              layer: currentLayer,
              colorId: selectedColor.id,
              size: selectedSize,
              quantity: quantity
          }];
      });
      // Optional: Reset quantity to 1 after add
      setQuantity(1);
  };

  const handleRemoveItem = (layer: number, colorId: string, size: BrickSize) => {
    setOrders(prev => prev.filter(o => !(o.layer === layer && o.colorId === colorId && o.size === size)));
  };

  const handleClear = () => {
      if(window.confirm("Hapus semua pesanan?")) {
          setOrders([]);
          setCurrentLayer(1);
      }
  }

  const totalItems = orders.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">{subkon.name}</h1>
              <p className="text-gray-500 text-xs">{subkon.description}</p>
            </div>
          </div>
          
          <button 
            className="md:hidden relative p-2 bg-indigo-50 text-indigo-600 rounded-lg"
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          >
            <Layers size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        
        {/* Layer Selector */}
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto flex space-x-2">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider py-1.5 mr-2 self-center">
                    Layer
                </span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(layer => (
                    <button
                        key={layer}
                        onClick={() => setCurrentLayer(layer)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
                            currentLayer === layer 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                        {layer}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Builder Interface */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
                    {currentLayer}
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">Pilih Spesifikasi</h2>
            </div>

            <div className="p-6 space-y-8">
                {/* Size Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ukuran</label>
                    <div className="grid grid-cols-5 gap-3">
                        {BRICK_SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`py-3 px-1 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                                    selectedSize === size
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-inner'
                                    : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Warna</label>
                    <div className="flex flex-wrap gap-4">
                        {subkon.colors.map(color => {
                            const isSelected = selectedColor.id === color.id;
                            return (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color)}
                                    className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        color.hexClass
                                    } ${isSelected ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110 shadow-lg' : 'hover:scale-105 opacity-90 hover:opacity-100'}`}
                                    title={color.name}
                                >
                                    {isSelected && <Check size={24} className={color.textColorClass} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Preview & Action Area */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                    {/* Visual Preview */}
                    <div className="flex flex-col items-center w-full sm:w-auto min-h-[16rem]">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preview</label>
                         
                         <div className="flex-1 flex items-center justify-center py-4">
                             <BrickVisual size={selectedSize} color={selectedColor} />
                         </div>
                         
                         <div className="relative px-3 py-1 bg-white rounded-full border border-gray-200 text-xs font-medium text-gray-500 shadow-sm whitespace-nowrap z-10 mt-2">
                             {selectedSize} • {selectedColor.name}
                         </div>
                    </div>

                    {/* Quantity & Add */}
                    <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
                        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center w-full sm:w-auto">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <div className="w-16 h-10 flex items-center justify-center font-bold text-xl text-gray-800">
                                {quantity}
                            </div>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-12 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddOrder}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            <ShoppingCart size={20} />
                            <span>Tambah ke Keranjang</span>
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary (Desktop) */}
        <div className="hidden md:block md:col-span-1">
            <div className="sticky top-24">
                <SummaryPanel orders={orders} onClear={handleClear} onRemoveItem={handleRemoveItem} />
            </div>
        </div>
      </main>

      {/* Mobile Summary Modal */}
      {isSummaryOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="absolute inset-0" 
                onClick={() => setIsSummaryOpen(false)}
            />
            <div className="bg-white rounded-t-2xl shadow-xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-center pt-3 pb-2" onClick={() => setIsSummaryOpen(false)}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <SummaryPanel orders={orders} onClear={handleClear} onRemoveItem={handleRemoveItem} />
                </div>
                <div className="p-4 border-t border-gray-100 bg-white pb-safe">
                    <button 
                        onClick={() => setIsSummaryOpen(false)}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        Tutup Ringkasan
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default OrderInterface;