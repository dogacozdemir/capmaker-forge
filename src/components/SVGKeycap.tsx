import React from 'react';
import { KeycapConfig, KeycapLayer } from '@/types/keyboard';

// Helper function to adjust color brightness (same as in KeycapPreview)
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

interface SVGKeycapProps {
  keycap: KeycapConfig;
  scale?: number;
  showBorder?: boolean;
  borderColor?: string;
  className?: string;
}

const SVGKeycap: React.FC<SVGKeycapProps> = ({
  keycap,
  scale = 1,
  showBorder = false,
  borderColor = '#1990ff',
  className = ''
}) => {
  const UNIT = 48 * scale;
  const KEY_SPACING = 4 * scale;
  const BORDER_RADIUS = 2 * scale;
  const INNER_RADIUS = 3 * scale;

  const width = keycap.width * UNIT - KEY_SPACING;
  const height = keycap.height * UNIT - KEY_SPACING;

  // Calculate positions for inner square (matching KeycapPreview)
  const innerTop = 2 * scale;
  const innerLeft = 6 * scale;
  const innerRight = 6 * scale;
  const innerBottom = 10 * scale;

  const innerWidth = width - innerLeft - innerRight;
  const innerHeight = height - innerTop - innerBottom;

  // Get base color (darker version)
  const baseColor = adjustColor(keycap.color || '#ffffff', -20);
  const mainColor = keycap.color || '#ffffff';

  // Convert colors to HSL for better SVG compatibility
  const baseHsl = hexToHsl(baseColor);
  const mainHsl = hexToHsl(mainColor);

  const renderLayer = (layer: KeycapLayer, index: number) => {
    const transform = `
      translate(${(layer.offsetX || 0) * scale}, ${(layer.offsetY || 0) * scale})
      rotate(${layer.rotation || 0})
      scale(${layer.mirrorX ? -1 : 1}, ${layer.mirrorY ? -1 : 1})
    `;

    if (layer.type === 'image' && layer.content && layer.content.trim() !== '') {
      return (
        <g key={layer.id} transform={transform}>
          <defs>
            <clipPath id={`image-clip-${keycap.id}-${index}`}>
              <rect
                x={innerLeft}
                y={innerTop}
                width={innerWidth}
                height={innerHeight}
                rx={INNER_RADIUS}
              />
            </clipPath>
          </defs>
          <image
            href={layer.content}
            x={innerLeft + innerWidth * 0.1}
            y={innerTop + innerHeight * 0.1}
            width={innerWidth * 0.8}
            height={innerHeight * 0.8}
            clipPath={`url(#image-clip-${keycap.id}-${index})`}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      );
    }

    // Text layer
    const fontSize = (layer.fontSize || 14) * scale;
    const textColor = layer.color || keycap.textColor || '#ffffff';
    const textHsl = hexToHsl(textColor);

    // Calculate text position based on alignment
    let textX = width / 2;
    let textY = height / 2;
    let textAnchor = 'middle';
    let dominantBaseline = 'central';

    if (layer.alignment === 'left') {
      textX = innerLeft + 4 * scale;
      textAnchor = 'start';
    } else if (layer.alignment === 'right') {
      textX = width - innerRight - 4 * scale;
      textAnchor = 'end';
    }

    if (layer.verticalAlignment === 'top') {
      textY = innerTop + fontSize + 2 * scale;
      dominantBaseline = 'hanging';
    } else if (layer.verticalAlignment === 'bottom') {
      textY = height - innerBottom - 2 * scale;
      dominantBaseline = 'text-before-edge';
    }

    return (
      <g key={layer.id} transform={transform}>
        <text
          x={textX}
          y={textY}
          fontSize={fontSize}
          fontFamily={layer.font || 'inherit'}
          fontWeight={layer.bold ? 'bold' : 'normal'}
          fontStyle={layer.italic ? 'italic' : 'normal'}
          textDecoration={layer.underline ? 'underline' : 'none'}
          fill={`hsl(${textHsl.h}, ${textHsl.s}%, ${textHsl.l}%)`}
          textAnchor={textAnchor}
          dominantBaseline={dominantBaseline}
        >
          {layer.content || ''}
        </text>
      </g>
    );
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ borderRadius: BORDER_RADIUS }}
    >
      <defs>
        {/* Gradient for base layer */}
        <linearGradient id={`base-gradient-${keycap.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l + 5}%)`} />
          <stop offset="50%" stopColor={`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l}%)`} />
          <stop offset="100%" stopColor={`hsl(${baseHsl.h}, ${baseHsl.s}%, ${baseHsl.l - 5}%)`} />
        </linearGradient>

        {/* Gradient for main layer */}
        <linearGradient id={`main-gradient-${keycap.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${mainHsl.h}, ${mainHsl.s}%, ${mainHsl.l + 3}%)`} />
          <stop offset="50%" stopColor={`hsl(${mainHsl.h}, ${mainHsl.s}%, ${mainHsl.l}%)`} />
          <stop offset="100%" stopColor={`hsl(${mainHsl.h}, ${mainHsl.s}%, ${mainHsl.l - 3}%)`} />
        </linearGradient>

        {/* Shadow filter */}
        <filter id={`shadow-${keycap.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      {/* Base layer - darker version */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx={BORDER_RADIUS}
        fill={`url(#base-gradient-${keycap.id})`}
        stroke="rgba(0, 0, 0, 0.15)"
        strokeWidth="1"
        filter={`url(#shadow-${keycap.id})`}
      />

      {/* Inner square - main keycap color */}
      <rect
        x={innerLeft}
        y={innerTop}
        width={innerWidth}
        height={innerHeight}
        rx={INNER_RADIUS}
        fill={`url(#main-gradient-${keycap.id})`}
      />

      {/* Border ring if selected */}
      {showBorder && (
        <rect
          x="-2"
          y="-2"
          width={width + 4}
          height={height + 4}
          rx={BORDER_RADIUS + 2}
          fill="none"
          stroke={borderColor}
          strokeWidth="2"
          strokeOpacity="0.5"
        />
      )}

      {/* Content layers */}
      {keycap.layers?.map((layer, index) => renderLayer(layer, index))}
    </svg>
  );
};

export default SVGKeycap;
