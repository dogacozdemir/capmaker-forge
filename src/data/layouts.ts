import { KeyboardLayout, LayoutOption } from '@/types/keyboard';
import { thockFactory60Layout } from './thockfactory-60-layout';

export const layoutOptions: LayoutOption[] = [
  {
    id: '60%',
    name: '60% Compact',
    description: '61 keys - Perfect for minimalists',
    keyCount: 61,
  },
  {
    id: 'ISO-60%',
    name: '60% ISO Layout',
    description: 'ISO standard 60% layout with UK/European key legends',
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

// Generate 60% layout (61 keys) - ThockFactory Math
const generate60Layout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1 (Numbers and backspace) - This is the top row in 60%
  const row1Keys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
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
      y: 0, // Top row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
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
      y: 1, // Second row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
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
      y: 2, // Third row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
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
      y: 3, // Fourth row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  // Row 5 (Bottom row) - ThockFactory exact sizing
  const row5Keys = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl'];
  const row5Widths = [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25]; // Exact ThockFactory sizing
  x = 0;
  row5Keys.forEach((legend, i) => {
    const width = row5Widths[i];
    keys.push({
      id: `key-${keyId++}`,
      row: 4,
      col: i,
      width,
      height: 1,
      x,
      y: 4, // Bottom row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  return {
    id: '60%',
    name: '60% Compact (ThockFactory Math)',
    keys,
    totalKeys: 61,
    width: 15, // 1.25+1.25+1.25+6.25+1.25+1.25+1.25+1.25 = 15 units
    height: 5, // 5 rows
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
        offsetX: 0,
        offsetY: -4,
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
        offsetX: 0,
        offsetY: -4,
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
        offsetX: 0,
        offsetY: -4,
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

// Generate ISO 60% layout based on pixel-perfect SVG analysis
const generateISO60Layout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1 (Numbers and backspace) - Pixel perfect from SVG
  // SVG: x=1,55,109,163,217,271,325,379,433,487,541,595,649,703
  const row1Keys = [
    { legend: '`', width: 1, x: 0 },
    { legend: '1', width: 1, x: 1 },
    { legend: '2', width: 1, x: 2 },
    { legend: '3', width: 1, x: 3 },
    { legend: '4', width: 1, x: 4 },
    { legend: '5', width: 1, x: 5 },
    { legend: '6', width: 1, x: 6 },
    { legend: '7', width: 1, x: 7 },
    { legend: '8', width: 1, x: 8 },
    { legend: '9', width: 1, x: 9 },
    { legend: '0', width: 1, x: 10 },
    { legend: '-', width: 1, x: 11 },
    { legend: '=', width: 1, x: 12 },
    { legend: 'Backspace', width: 2, x: 13 }
  ];
  
  row1Keys.forEach((key, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width: key.width,
      height: 1,
      x: key.x,
      y: 0,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: key.legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  // Row 2 (Tab and QWERTY) - Pixel perfect from SVG
  // SVG: x=1,82,136,190,244,298,352,406,460,514,568,622,676,730
  // Tab: 79px (1.46u), Enter: 79px x 52px (1.46u x 1u) - üst kısım
  const row2Keys = [
    { legend: 'Tab', width: 1.46, x: 0 },
    { legend: 'Q', width: 1, x: 1.46 },
    { legend: 'W', width: 1, x: 2.46 },
    { legend: 'E', width: 1, x: 3.46 },
    { legend: 'R', width: 1, x: 4.46 },
    { legend: 'T', width: 1, x: 5.46 },
    { legend: 'Y', width: 1, x: 6.46 },
    { legend: 'U', width: 1, x: 7.46 },
    { legend: 'I', width: 1, x: 8.46 },
    { legend: 'O', width: 1, x: 9.46 },
    { legend: 'P', width: 1, x: 10.46 },
    { legend: '[', width: 1, x: 11.46 },
    { legend: ']', width: 1, x: 12.46 },
    { legend: 'Enter', width: 1.46, height: 2, x: 13.46 }
  ];
  
  row2Keys.forEach((key, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 1,
      col: i,
      width: key.width,
      height: key.height || 1,
      x: key.x,
      y: 1,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: key.legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  // Row 3 (Caps Lock and ASDF) - Pixel perfect from SVG
  // SVG: x=1,95.5,149.5,203.5,257.5,311.5,365.5,419.5,473.5,527.5,581.5,635.5,689.5
  // Caps Lock: 92.5px (1.71u), Enter alt kısım: 65.5px (1.21u)
  const row3Keys = [
    { legend: 'Caps Lock', width: 1.71, x: 0 },
    { legend: 'A', width: 1, x: 1.71 },
    { legend: 'S', width: 1, x: 2.71 },
    { legend: 'D', width: 1, x: 3.71 },
    { legend: 'F', width: 1, x: 4.71 },
    { legend: 'G', width: 1, x: 5.71 },
    { legend: 'H', width: 1, x: 6.71 },
    { legend: 'J', width: 1, x: 7.71 },
    { legend: 'K', width: 1, x: 8.71 },
    { legend: 'L', width: 1, x: 9.71 },
    { legend: ';', width: 1, x: 10.71 },
    { legend: "'", width: 1, x: 11.71 },
    { legend: '#', width: 1, x: 12.71 },
  ];
  
  row3Keys.forEach((key, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 2,
      col: i,
      width: key.width,
      height: 1,
      x: key.x,
      y: 2,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: key.legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  // Row 4 (Shift and ZXCV) - Pixel perfect from SVG
  // SVG: x=1,68.5,122.5,176.5,230.5,284.5,338.5,392.5,446.5,500.5,554.5,608.5,662.5
  // Left Shift: 65.5px (1.21u), Right Shift: 146.5px (2.71u)
  const row4Keys = [
    { legend: 'Shift', width: 1.21, x: 0 },
    { legend: '\\', width: 1, x: 1.21 },
    { legend: 'Z', width: 1, x: 2.21 },
    { legend: 'X', width: 1, x: 3.21 },
    { legend: 'C', width: 1, x: 4.21 },
    { legend: 'V', width: 1, x: 5.21 },
    { legend: 'B', width: 1, x: 6.21 },
    { legend: 'N', width: 1, x: 7.21 },
    { legend: 'M', width: 1, x: 8.21 },
    { legend: ',', width: 1, x: 9.21 },
    { legend: '.', width: 1, x: 10.21 },
    { legend: '/', width: 1, x: 11.21 },
    { legend: 'Shift', width: 2.71, x: 12.21 }
  ];
  
  row4Keys.forEach((key, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 3,
      col: i,
      width: key.width,
      height: 1,
      x: key.x,
      y: 3,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: key.legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  // Row 5 (Bottom row) - Pixel perfect from SVG
  // SVG: x=1,68.5,136,203.5,541,608.5,676,743.5
  // Space: 335.5px (6.21u)
  const row5Keys = [
    { legend: 'Ctrl', width: 1.21, x: 0 },
    { legend: 'Win', width: 1.21, x: 1.21 },
    { legend: 'Alt', width: 1.21, x: 2.42 },
    { legend: 'Space', width: 6.21, x: 3.63 },
    { legend: 'AltGr', width: 1.21, x: 9.84 },
    { legend: 'Win', width: 1.21, x: 11.05 },
    { legend: 'Menu', width: 1.21, x: 12.26 },
    { legend: 'Ctrl', width: 1.21, x: 13.47 }
  ];
  
  row5Keys.forEach((key, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 4,
      col: i,
      width: key.width,
      height: 1,
      x: key.x,
      y: 4,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: key.legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  return {
    id: 'ISO-60%',
    name: '60% ISO Layout (Pixel Perfect SVG)',
    keys,
    totalKeys: keys.length,
    width: 15, // Total width of the layout (13.5 + 1.46 = 14.96, rounded to 15)
    height: 5, // 5 rows
  };
};

export const keyboardLayouts: Record<string, KeyboardLayout> = {
  '60%': generate60Layout(),
  'ISO-60%': generateISO60Layout(),
  'thockfactory-60': thockFactory60Layout,
  'TKL': generateTKLLayout(),
  'Full': generateFullLayout(),
};