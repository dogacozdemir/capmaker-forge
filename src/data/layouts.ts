import { KeyboardLayout, LayoutOption } from '@/types/keyboard';

export const layoutOptions: LayoutOption[] = [
  {
    id: '60%',
    name: '60% Compact',
    description: '61 keys - Perfect for minimalists',
    keyCount: 61,
  },
  {
    id: 'TKL',
    name: 'Tenkeyless',
    description: '87 keys - Function keys without numpad',
    keyCount: 87,
  },
  {
    id: 'Full',
    name: 'Full Size',
    description: '104 keys - Complete layout with numpad',
    keyCount: 104,
  },
];

// Key unit size (standard keycap unit)
const UNIT = 48;
const GAP = 4;

// Generate 60% layout (61 keys)
const generate60Layout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1 (Numbers and backspace)
  const row1Keys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '-', 'Backspace'];
  let x = 0;
  row1Keys.forEach((legend, i) => {
    const width = legend === 'Backspace' ? 2 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width,
      height: 1,
      x,
      y: 0,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
    x += width + (width > 1 ? 0 : 0);
  });

  // Row 2 (Tab and QWERTY)
  const row2Keys = ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü', '\\'];
  x = 0;
  row2Keys.forEach((legend, i) => {
    const width = legend === 'Tab' ? 1.5 : legend === '\\' ? 1.5 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 1,
      col: i,
      width,
      height: 1,
      x,
      y: 1,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
    x += width;
  });

  // Row 3 (Caps Lock and ASDF)
  const row3Keys = ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', "İ", 'Enter'];
  x = 0;
  row3Keys.forEach((legend, i) => {
    const width = legend === 'Caps' ? 1.75 : legend === 'Enter' ? 2.25 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 2,
      col: i,
      width,
      height: 1,
      x,
      y: 2,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
    x += width;
  });

  // Row 4 (Shift and ZXCV)
  const row4Keys = ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', ':', 'Shift'];
  x = 0;
  row4Keys.forEach((legend, i) => {
    const width = legend === 'Shift' ? (i === 0 ? 2.25 : 2.75) : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 3,
      col: i,
      width,
      height: 1,
      x,
      y: 3,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
    x += width;
  });

  // Row 5 (Bottom row)
  const row5Keys = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl'];
  x = 0;
  row5Keys.forEach((legend, i) => {
    const width = legend === 'Space' ? 6.25 : legend === 'Ctrl' || legend === 'Win' || legend === 'Alt' ? 1.25 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 4,
      col: i,
      width,
      height: 1,
      x,
      y: 4,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
    x += width;
  });

  return {
    id: '60%',
    name: '60% Compact',
    keys,
    totalKeys: 61,
    width: 15,
    height: 5,
  };
};

// Generate TKL layout (87 keys) - extends 60% with function row and nav cluster
const generateTKLLayout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Function row
  const funcKeys = ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause'];
  funcKeys.forEach((legend, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width: 1,
      height: 1,
      x: i + (i > 3 ? 0.5 : 0) + (i > 7 ? 0.5 : 0) + (i > 11 ? 0.5 : 0),
      y: 0,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
  });

  // Main 60% section (offset by 1 row)
  const sixtyLayout = generate60Layout();
  sixtyLayout.keys.forEach(key => {
    keys.push({
      ...key,
      id: `key-${keyId++}`,
      y: key.y + 1.5,
    });
  });

  // Navigation cluster
  const navKeys = [
    { legend: 'Ins', x: 15.5, y: 1.5 },
    { legend: 'Home', x: 16.5, y: 1.5 },
    { legend: 'PgUp', x: 17.5, y: 1.5 },
    { legend: 'Del', x: 15.5, y: 2.5 },
    { legend: 'End', x: 16.5, y: 2.5 },
    { legend: 'PgDn', x: 17.5, y: 2.5 },
    { legend: '↑', x: 16.5, y: 4.5 },
    { legend: '←', x: 15.5, y: 5.5 },
    { legend: '↓', x: 16.5, y: 5.5 },
    { legend: '→', x: 17.5, y: 5.5 },
  ];

  navKeys.forEach(({ legend, x, y }) => {
    keys.push({
      id: `key-${keyId++}`,
      row: Math.floor(y),
      col: Math.floor(x),
      width: 1,
      height: 1,
      x,
      y,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
  });

  return {
    id: 'TKL',
    name: 'Tenkeyless',
    keys,
    totalKeys: 87,
    width: 18.5,
    height: 6.5,
  };
};

// Generate Full layout (104 keys) - extends TKL with numpad
const generateFullLayout = (): KeyboardLayout => {
  const tklLayout = generateTKLLayout();
  const keys = [...tklLayout.keys];
  let keyId = keys.length;

  // Numpad
  const numpadKeys = [
    { legend: 'NumLk', x: 19.5, y: 1.5, w: 1, h: 1 },
    { legend: '/', x: 20.5, y: 1.5, w: 1, h: 1 },
    { legend: '*', x: 21.5, y: 1.5, w: 1, h: 1 },
    { legend: '-', x: 22.5, y: 1.5, w: 1, h: 1 },
    
    { legend: '7', x: 19.5, y: 2.5, w: 1, h: 1 },
    { legend: '8', x: 20.5, y: 2.5, w: 1, h: 1 },
    { legend: '9', x: 21.5, y: 2.5, w: 1, h: 1 },
    { legend: '+', x: 22.5, y: 2.5, w: 1, h: 2 },
    
    { legend: '4', x: 19.5, y: 3.5, w: 1, h: 1 },
    { legend: '5', x: 20.5, y: 3.5, w: 1, h: 1 },
    { legend: '6', x: 21.5, y: 3.5, w: 1, h: 1 },
    
    { legend: '1', x: 19.5, y: 4.5, w: 1, h: 1 },
    { legend: '2', x: 20.5, y: 4.5, w: 1, h: 1 },
    { legend: '3', x: 21.5, y: 4.5, w: 1, h: 1 },
    { legend: 'Enter', x: 22.5, y: 4.5, w: 1, h: 2 },
    
    { legend: '0', x: 19.5, y: 5.5, w: 2, h: 1 },
    { legend: '.', x: 21.5, y: 5.5, w: 1, h: 1 },
  ];

  numpadKeys.forEach(({ legend, x, y, w, h }) => {
    keys.push({
      id: `key-${keyId++}`,
      row: Math.floor(y),
      col: Math.floor(x),
      width: w,
      height: h,
      x,
      y,
      color: '#2D3748',
      textColor: '#FFFFFF',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
      }],
    });
  });

  return {
    id: 'Full',
    name: 'Full Size',
    keys,
    totalKeys: 104,
    width: 23.5,
    height: 6.5,
  };
};

export const keyboardLayouts: Record<string, KeyboardLayout> = {
  '60%': generate60Layout(),
  'TKL': generateTKLLayout(),
  'Full': generateFullLayout(),
};