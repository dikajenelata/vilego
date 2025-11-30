import { BrickColor, BrickSize, Subkon } from './types';

export const BRICK_SIZES: BrickSize[] = [
  '1x1', '1x2', '1x3', '1x4', '1x6', '1x8', 
  '2x2', '2x3', '2x4', '2x6', 'PELAT'
];

export const COLORS: Record<string, BrickColor> = {
  kuning: { id: 'kuning', name: 'Kuning', hexClass: 'bg-yellow-400', textColorClass: 'text-yellow-900' },
  biruTua: { id: 'biruTua', name: 'Biru Tua', hexClass: 'bg-blue-800', textColorClass: 'text-white' },
  coklat: { id: 'coklat', name: 'Coklat', hexClass: 'bg-amber-800', textColorClass: 'text-white' },
  biruMuda: { id: 'biruMuda', name: 'Biru Muda', hexClass: 'bg-cyan-400', textColorClass: 'text-cyan-900' },
  pink: { id: 'pink', name: 'Pink', hexClass: 'bg-pink-400', textColorClass: 'text-pink-900' },
  abuAbu: { id: 'abuAbu', name: 'Abu-Abu', hexClass: 'bg-gray-400', textColorClass: 'text-gray-900' },
  hijauMuda: { id: 'hijauMuda', name: 'Hijau Muda', hexClass: 'bg-lime-400', textColorClass: 'text-lime-900' },
  hitam: { id: 'hitam', name: 'Hitam', hexClass: 'bg-gray-900', textColorClass: 'text-white' },
  hijauTua: { id: 'hijauTua', name: 'Hijau Tua', hexClass: 'bg-green-700', textColorClass: 'text-white' },
  ungu: { id: 'ungu', name: 'Ungu', hexClass: 'bg-purple-600', textColorClass: 'text-white' },
  pelat: { id: 'pelat', name: 'Pelat', hexClass: 'bg-slate-200 border border-slate-300', textColorClass: 'text-slate-700' },
  merah: { id: 'merah', name: 'Merah', hexClass: 'bg-red-600', textColorClass: 'text-white' },
  orange: { id: 'orange', name: 'Orange', hexClass: 'bg-orange-500', textColorClass: 'text-white' },
};

export const SUBKONS: Subkon[] = [
  {
    id: 'A',
    name: 'Subkon A',
    description: 'Kuning + Biru Tua',
    colors: [COLORS.kuning, COLORS.biruTua],
  },
  {
    id: 'B',
    name: 'Subkon B',
    description: 'Coklat + Biru Muda',
    colors: [COLORS.coklat, COLORS.biruMuda],
  },
  {
    id: 'C',
    name: 'Subkon C',
    description: 'Pink + Abu-Abu',
    colors: [COLORS.pink, COLORS.abuAbu],
  },
  {
    id: 'D',
    name: 'Subkon D',
    description: 'Hijau Muda + Hitam',
    colors: [COLORS.hijauMuda, COLORS.hitam],
  },
  {
    id: 'E',
    name: 'Subkon E',
    description: 'Hijau Tua + Ungu + Pelat',
    colors: [COLORS.hijauTua, COLORS.ungu, COLORS.pelat],
  },
  {
    id: 'F',
    name: 'Subkon F',
    description: 'Merah + Orange',
    colors: [COLORS.merah, COLORS.orange],
  },
];