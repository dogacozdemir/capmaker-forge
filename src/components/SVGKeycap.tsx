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
  shape?: 'rect' | 'l-shape';
  selected?: boolean;
  hovered?: boolean;
}

const SVGKeycap: React.FC<SVGKeycapProps> = ({
  keycap,
  scale = 1,
  showBorder = false,
  borderColor = '#1990ff',
  className = '',
  shape = 'rect',
  selected = false,
  hovered = false
}) => {
  const UNIT = 48 * scale;
  const KEY_SPACING = 4 * scale;
  const BORDER_RADIUS = 2 * scale;
  const INNER_RADIUS = 3 * scale; // Match CSS version exactly

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
  let baseColor = adjustColor(keycap.color || '#ffffff', -20);
  let mainColor = keycap.color || '#ffffff';
  
  // Apply hover/selection effects
  if (selected) {
    baseColor = adjustColor(baseColor, 10);
    mainColor = adjustColor(mainColor, 10);
  } else if (hovered) {
    baseColor = adjustColor(baseColor, 5);
    mainColor = adjustColor(mainColor, 5);
  }

  // Convert colors to HSL for better SVG compatibility
  const baseHsl = hexToHsl(baseColor);
  const mainHsl = hexToHsl(mainColor);

  const renderLayer = (layer: KeycapLayer, index: number) => {
    // Calculate center point for proper mirroring
    const centerX = innerLeft + innerWidth / 2;
    const centerY = innerTop + innerHeight / 2;
    
    const transform = `
      translate(${centerX}, ${centerY})
      rotate(${layer.rotation || 0})
      scale(${layer.mirrorX ? -1 : 1}, ${layer.mirrorY ? -1 : 1})
      translate(${-centerX}, ${-centerY})
    `;

    if (layer.type === 'image' && layer.content && layer.content.trim() !== '') {
      return (
        <g key={layer.id} transform={transform} clipPath={`url(#text-clip-${keycap.id}-${index})`}>
          <image
            href={layer.content}
            x={innerLeft + innerWidth * 0.1}
            y={innerTop + innerHeight * 0.1}
            width={innerWidth * 0.8}
            height={innerHeight * 0.8}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      );
    }

    // Text layer
    const fontSize = (layer.fontSize || 14) * scale;
    const textColor = layer.color || keycap.textColor || '#ffffff';
    const textHsl = hexToHsl(textColor);

    // Calculate text position using CSS flexbox logic
    // CSS version uses: inset: 0, padding: 4px, flex center
    const padding = 4 * scale;
    const availableWidth = innerWidth - (padding * 2);
    const availableHeight = innerHeight - (padding * 2);
    
    let textX = innerLeft + padding + availableWidth / 2;
    let textY = innerTop + padding + availableHeight / 2 + fontSize * 0.3; // Biraz aşağı kaydır
    let textAnchor = 'middle';
    let dominantBaseline = 'middle';

    if (layer.alignment === 'left') {
      textX = innerLeft + padding;
      textAnchor = 'start';
    } else if (layer.alignment === 'right') {
      textX = innerLeft + padding + availableWidth;
      textAnchor = 'end';
    }

    if (layer.verticalAlignment === 'top') {
      textY = innerTop + padding + fontSize * 0.8; // Font size'a göre ayarla
      dominantBaseline = 'baseline';
     } else if (layer.verticalAlignment === 'bottom') {
       textY = innerTop + innerHeight; // Inner square'ın tam alt kenarı
       dominantBaseline = 'text-bottom';
     }
    
    

    return (
      <g key={layer.id} transform={transform} clipPath={`url(#text-clip-${keycap.id}-${index})`}>
        <text
          x={textX + (layer.offsetX || 0) * scale}
          y={textY + (layer.offsetY || 0) * scale}
          fontSize={fontSize}
          fontFamily={layer.font || 'Arial, sans-serif'}
          textRendering="geometricPrecision"
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

  const renderLShape = () => {
    // ISO Enter L-shape dimensions based on SVG analysis
    // Top part: 79px x 52px (1.46u x 1u)
    // Bottom part: 65.5px x 106px (1.21u x 2u)
    const topWidth = 79 * scale;
    const topHeight = 52 * scale;
    const bottomWidth = 65.5 * scale;
    const bottomHeight = 106 * scale;
    
    const topLeft = 0;
    const topTop = 0;
    const bottomLeft = 13.5 * scale; // Offset for bottom part
    const bottomTop = 0;

    return (
      <>
        {/* Top part - darker base */}
        <rect
          x={topLeft}
          y={topTop}
          width={topWidth}
          height={topHeight}
          rx={BORDER_RADIUS}
          fill={baseColor}
          stroke="rgba(0, 0, 0, 0.15)"
          strokeWidth="1"
        />
        
        {/* Bottom part - darker base */}
        <rect
          x={bottomLeft}
          y={bottomTop}
          width={bottomWidth}
          height={bottomHeight}
          rx={BORDER_RADIUS}
          fill={baseColor}
          stroke="rgba(0, 0, 0, 0.15)"
          strokeWidth="1"
        />

        {/* Top part - main color */}
        <rect
          x={topLeft + innerLeft}
          y={topTop + innerTop}
          width={topWidth - innerLeft - innerRight}
          height={topHeight - innerTop - innerBottom}
          rx={INNER_RADIUS}
          fill={mainColor}
        />
        
        {/* Bottom part - main color */}
        <rect
          x={bottomLeft + innerLeft}
          y={bottomTop + innerTop}
          width={bottomWidth - innerLeft - innerRight}
          height={bottomHeight - innerTop - innerBottom}
          rx={INNER_RADIUS}
          fill={mainColor}
        />

        {/* Border ring if selected */}
        {(showBorder || selected) && (
          <>
            <rect
              x={topLeft - 2}
              y={topTop - 2}
              width={topWidth + 4}
              height={topHeight + 4}
              rx={BORDER_RADIUS + 2}
              fill="none"
              stroke={borderColor}
              strokeWidth="2"
              strokeOpacity="0.5"
            />
            <rect
              x={bottomLeft - 2}
              y={bottomTop - 2}
              width={bottomWidth + 4}
              height={bottomHeight + 4}
              rx={BORDER_RADIUS + 2}
              fill="none"
              stroke={borderColor}
              strokeWidth="2"
              strokeOpacity="0.5"
            />
          </>
        )}
      </>
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
        {/* Clipping paths for text and images */}
        {keycap.layers?.map((layer, index) => (
          <clipPath key={`text-clip-${index}`} id={`text-clip-${keycap.id}-${index}`}>
            <rect
              x={innerLeft}
              y={innerTop}
              width={innerWidth}
              height={innerHeight}
              rx={INNER_RADIUS}
            />
          </clipPath>
        ))}
      </defs>

      {/* Render based on shape */}
      {shape === 'l-shape' ? (
        renderLShape()
      ) : (
        <>
          {/* Base layer - darker version (matching CSS exactly) */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx={BORDER_RADIUS}
            fill={baseColor}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="1"
          />

          {/* Inner square - main keycap color (matching CSS exactly) */}
          <rect
            x={innerLeft}
            y={innerTop}
            width={innerWidth}
            height={innerHeight}
            rx={INNER_RADIUS}
            fill={mainColor}
          />

          {/* Border ring if selected */}
          {(showBorder || selected) && (
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
        </>
      )}

      {/* Content layers */}
      {keycap.layers?.map((layer, index) => renderLayer(layer, index))}
    </svg>
  );
};

export default SVGKeycap;
