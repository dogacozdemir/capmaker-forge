import React, { forwardRef } from 'react';
import { KeycapConfig, KeycapLayer } from '@/types/keyboard';
import { createKeycapShape } from '@/data/svgKeycapShapes';

// Helper function to adjust color brightness
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

interface SVGKeycapPreviewProps {
  keycap: KeycapConfig;
  selected: boolean;
  previewSelected?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onDoubleClick: () => void;
  scale?: number;
}

const SVGKeycapPreview = forwardRef<HTMLDivElement, SVGKeycapPreviewProps>(
  (
    {
      keycap,
      selected,
      previewSelected = false,
      onClick,
      onDoubleClick,
      scale = 1,
    },
    ref
  ) => {
    const UNIT = 48 * scale;
    const KEY_SPACING = 4 * scale;

    const width = keycap.width * UNIT - KEY_SPACING;
    const height = keycap.height * UNIT - KEY_SPACING;

    // Get colors
    const baseColor = adjustColor(keycap.color || '#ffffff', -20);
    const mainColor = keycap.color || '#ffffff';
    
    // Create the keycap shape with colors
    const keycapShape = createKeycapShape(keycap.width, keycap.height, baseColor, mainColor, keycap.id);

    const renderLayer = (layer: KeycapLayer, index: number) => {
      const transform = `
        translate(${(layer.offsetX || 0) * scale}, ${(layer.offsetY || 0) * scale})
        rotate(${layer.rotation || 0})
        scale(${layer.mirrorX ? -1 : 1}, ${layer.mirrorY ? -1 : 1})
      `;

      if (layer.type === 'image' && layer.content && layer.content.trim() !== '') {
        const legendX = keycapShape.legendArea.x * scale;
        const legendY = keycapShape.legendArea.y * scale;
        const legendWidth = keycapShape.legendArea.width * scale;
        const legendHeight = keycapShape.legendArea.height * scale;
        
        // Use proportional padding for images too
        const imagePadding = Math.max(4 * scale, Math.min(legendWidth, legendHeight) * 0.1);
        
        return (
          <g key={layer.id} transform={transform}>
            <image
              href={layer.content}
              x={legendX + imagePadding}
              y={legendY + imagePadding}
              width={legendWidth - (imagePadding * 2)}
              height={legendHeight - (imagePadding * 2)}
              clipPath={`url(#inner-area-clip-${keycap.id})`}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        );
      }

      // Text layer
      const fontSize = (layer.fontSize || 14) * scale;
      const textColor = layer.color || keycap.textColor || '#ffffff';
      const textHsl = hexToHsl(textColor);

      // Calculate text position based on alignment within innerSquare bounds
      const innerX = keycapShape.legendArea.x * scale;
      const innerY = keycapShape.legendArea.y * scale;
      const innerWidth = keycapShape.legendArea.width * scale;
      const innerHeight = keycapShape.legendArea.height * scale;
      
      // Padding within the inner rectangle
      const horizontalPadding = 4 * scale;
      const verticalPadding = 4 * scale;
      
      let textX = innerX + innerWidth / 2;
      let textY = innerY + innerHeight / 2;
      let textAnchor = 'middle';
      let dominantBaseline = 'middle';

      if (layer.alignment === 'left') {
        textX = innerX + horizontalPadding;
        textAnchor = 'start';
      } else if (layer.alignment === 'right') {
        textX = innerX + innerWidth - horizontalPadding;
        textAnchor = 'end';
      }

      if (layer.verticalAlignment === 'top') {
        textY = innerY + verticalPadding;
        dominantBaseline = 'hanging';
      } else if (layer.verticalAlignment === 'bottom') {
        textY = innerY + innerHeight - verticalPadding;
        dominantBaseline = 'auto';
      }

      return (
        <g key={layer.id} transform={transform} clipPath={`url(#inner-area-clip-${keycap.id})`}>
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
      <div
        ref={ref}
        className={`
          absolute cursor-pointer transition-all duration-200 ease-out
          ${selected ? 'ring-2 ring-primary/50' : ''}
          ${
            previewSelected && !selected
              ? 'ring-2 ring-primary/40'
              : ''
          }
        `}
        style={{
          left: keycap.x * UNIT + KEY_SPACING / 2,
          top: keycap.y * UNIT + KEY_SPACING / 2,
          width,
          height,
          transform: 'translateZ(1px)',
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.stopPropagation();
          }
        }}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.stopPropagation();
          }
          onClick(e);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick();
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <defs>
            {/* Clipping path for inner area only */}
            <clipPath id={`inner-area-clip-${keycap.id}`}>
              <rect
                x={keycapShape.legendArea.x * scale}
                y={keycapShape.legendArea.y * scale}
                width={keycapShape.legendArea.width * scale}
                height={keycapShape.legendArea.height * scale}
                rx={3 * scale}
              />
            </clipPath>
          </defs>

          {/* Apply the keycap shape with direct colors */}
          <g dangerouslySetInnerHTML={{ __html: keycapShape.svgPath }} />

          {/* Border ring if selected - matching CSS ring */}
          {selected && (
            <rect
              x="-2"
              y="-2"
              width={width + 4}
              height={height + 4}
              rx="4"
              fill="none"
              stroke="hsl(199 89% 48%)"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
          )}

          {/* Content layers */}
          {keycap.layers?.map((layer, index) => renderLayer(layer, index))}
        </svg>
      </div>
    );
  }
);

SVGKeycapPreview.displayName = 'SVGKeycapPreview';

export default SVGKeycapPreview;
