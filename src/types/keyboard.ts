export interface KeycapConfig {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  legend: string;
  color: string;
  textColor: string;
  group?: string;
  // Enhanced legend settings
  legendMode?: 'text' | 'image';
  legendImage?: string | null; // data URL when using image
  legendFont?: string; // e.g., 'Arial'
  legendFontSize?: number; // px
  legendOffsetX?: number; // px offset from center
  legendOffsetY?: number; // px offset from center
  legendAlignment?: 'left' | 'center' | 'right';
  legendVerticalAlignment?: 'top' | 'center' | 'bottom';
  legendRotation?: number; // degrees
  legendMirrorX?: boolean; // horizontal mirroring
  legendMirrorY?: boolean; // vertical mirroring
  legendBold?: boolean; // bold text
  legendItalic?: boolean; // italic text
  legendUnderline?: boolean; // underlined text
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