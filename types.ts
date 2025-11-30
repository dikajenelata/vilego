export type BrickSize = '1x1' | '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '2x2' | '2x3' | '2x4' | '2x6';

export interface BrickColor {
  id: string;
  name: string; // e.g., "Kuning", "Biru Tua"
  hexClass: string; // Tailwind class for background
  textColorClass: string; // Tailwind class for text
}

export interface Subkon {
  id: string;
  name: string;
  description: string;
  colors: BrickColor[];
}

// Order structure: Keyed by layer, then by unique brick key (color + size)
export interface OrderItem {
  layer: number;
  colorId: string;
  size: BrickSize;
  quantity: number;
}

export interface AggregatedBrick {
  colorId: string;
  colorName: string;
  size: BrickSize;
  totalQuantity: number;
  layers: {
    [layerNumber: number]: number;
  };
}