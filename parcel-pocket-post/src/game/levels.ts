import type { Level, Rectangle } from './types';

const roads: readonly Rectangle[] = [
  { x: 64, y: 90, width: 832, height: 76 },
  { x: 40, y: 282, width: 880, height: 76 },
  { x: 64, y: 474, width: 832, height: 76 },
  { x: 122, y: 90, width: 76, height: 460 },
  { x: 442, y: 90, width: 76, height: 460 },
  { x: 762, y: 90, width: 76, height: 460 },
];

export const LEVELS: readonly Level[] = [
  {
    id: 'maple-quarter',
    name: 'Maple Quarter',
    subtitle: 'A good day for a little delivery.',
    spawn: { x: 96, y: 320 },
    depot: { x: 160, y: 320 },
    roads,
    buildings: [
      { x: 245, y: 184, width: 125, height: 66, color: 0xf1d8ae, roof: 0xd38f75, label: 'BAKERY' },
      { x: 580, y: 184, width: 124, height: 66, color: 0xc6d9e4, roof: 0x7895a7, label: 'STUDIO' },
      { x: 245, y: 390, width: 125, height: 54, color: 0xe6d1db, roof: 0xad8396, label: 'FLORIST' },
      { x: 580, y: 390, width: 124, height: 54, color: 0xd8dfbb, roof: 0x8c9d6c, label: 'LIBRARY' },
    ],
    deliveries: [
      { id: 'maple-bakery', name: 'The bakery', color: 0xe7a351, x: 800, y: 128 },
      { id: 'maple-studio', name: 'The studio', color: 0x7b9bb7, x: 800, y: 320 },
      { id: 'maple-florist', name: 'The florist', color: 0xbe81a0, x: 800, y: 512 },
    ],
    trees: [
      { x: 76, y: 216 },
      { x: 884, y: 216 },
      { x: 76, y: 418 },
      { x: 884, y: 418 },
      { x: 404, y: 216 },
      { x: 548, y: 420 },
      { x: 384, y: 580 },
      { x: 574, y: 62 },
    ],
  },
  {
    id: 'garden-district',
    name: 'Garden District',
    subtitle: 'New streets. Familiar friendly faces.',
    spawn: { x: 864, y: 320 },
    depot: { x: 800, y: 320 },
    roads,
    buildings: [
      {
        x: 252,
        y: 182,
        width: 144,
        height: 70,
        color: 0xc6d9e4,
        roof: 0x7895a7,
        label: 'BOOKSHOP',
      },
      { x: 570, y: 182, width: 120, height: 70, color: 0xf1d8ae, roof: 0xd38f75, label: 'CAFE' },
      { x: 252, y: 384, width: 144, height: 64, color: 0xd8dfbb, roof: 0x8c9d6c, label: 'MARKET' },
      { x: 570, y: 384, width: 120, height: 64, color: 0xe6d1db, roof: 0xad8396, label: 'GALLERY' },
    ],
    deliveries: [
      { id: 'garden-books', name: 'The bookshop', color: 0x7b9bb7, x: 160, y: 128 },
      { id: 'garden-market', name: 'The market', color: 0xe7a351, x: 160, y: 320 },
      { id: 'garden-gallery', name: 'The gallery', color: 0xbe81a0, x: 160, y: 512 },
    ],
    trees: [
      { x: 76, y: 216 },
      { x: 884, y: 216 },
      { x: 76, y: 418 },
      { x: 884, y: 418 },
      { x: 430, y: 580 },
      { x: 550, y: 62 },
      { x: 530, y: 216 },
      { x: 720, y: 420 },
    ],
  },
];
