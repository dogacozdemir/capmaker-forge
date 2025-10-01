export interface KeycapLayer {
  id: string;
  type: 'text' | 'image';
  content: string; // text content or image data URL
  font?: string;
  fontSize?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  rotation?: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface KeycapConfig {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  textColor: string;
  group?: string;
  layers: KeycapLayer[];
}

export interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeycapConfig[];
  totalKeys: number;
  width: number;
  height: number;
}

export interface KeyboardConfig {
  layout: KeyboardLayout;
  globalSettings: {
    theme: string;
    font: string;
  };
  selectedKeys: string[];
  groups: Record<string, string[]>;
  allLayouts: Record<LayoutType, KeyboardLayout>;
  currentLayoutType: LayoutType;
}

export type LayoutType = '60%' | 'TKL' | 'Full';

export interface LayoutOption {
  id: LayoutType;
  name: string;
  description: string;
  keyCount: number;
}