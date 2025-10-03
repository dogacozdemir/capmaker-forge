import React, { forwardRef } from 'react';
import { KeycapConfig, KeycapLayer } from '@/types/keyboard';

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

interface KeycapPreviewProps {
  keycap: KeycapConfig;
  selected: boolean;
  previewSelected?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onDoubleClick: () => void;
  scale?: number;
}

const KeycapPreview = forwardRef<HTMLDivElement, KeycapPreviewProps>(
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
    const KEY_SPACING = 4 * scale; // Keycap'ler arası mesafe
    const BORDER_RADIUS = 2 * scale; // Daha düz köşeler
    const INNER_RADIUS = 6 * scale; // İç kare için daha yumuşak köşeler

    const width = keycap.width * UNIT - KEY_SPACING;
    const height = keycap.height * UNIT - KEY_SPACING;

    const renderLayer = (layer: KeycapLayer) => {
      const baseTransform = `
        translate(${(layer.offsetX || 0) * scale}px, ${(layer.offsetY || 0) * scale}px)
        rotate(${layer.rotation || 0}deg)
        scaleX(${layer.mirrorX ? -1 : 1})
        scaleY(${layer.mirrorY ? -1 : 1})
      `;

      const containerStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems:
          layer.verticalAlignment === 'top'
            ? 'flex-start'
            : layer.verticalAlignment === 'bottom'
            ? 'flex-end'
            : 'center',
        justifyContent:
          layer.alignment === 'left'
            ? 'flex-start'
            : layer.alignment === 'right'
            ? 'flex-end'
            : 'center',
        padding: '4px',
        pointerEvents: 'none',
      };

      if (layer.type === 'image' && layer.content && layer.content.trim() !== '') {
        return (
          <div key={layer.id} style={containerStyle}>
            <img
              src={layer.content}
              alt="layer"
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                objectFit: 'contain',
                transform: baseTransform,
              }}
              draggable={false}
            />
          </div>
        );
      }

      return (
        <div key={layer.id} style={containerStyle}>
          <div
            style={{
              fontFamily: layer.font || 'inherit',
              fontSize: `${(layer.fontSize || 14) * scale}px`,
              fontWeight: layer.bold ? 'bold' : 'normal',
              fontStyle: layer.italic ? 'italic' : 'normal',
              textDecoration: layer.underline ? 'underline' : 'none',
              color: layer.color || keycap.textColor,
              transform: baseTransform,
              textAlign: layer.alignment || 'center',
              whiteSpace: 'pre-wrap',
            }}
          >
            {layer.content || ''}
          </div>
        </div>
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
          borderRadius: BORDER_RADIUS,
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
        {/* Keycap base - darker version of selected color */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: BORDER_RADIUS,
            background: adjustColor(keycap.color || '#ffffff', -20), // Seçilen rengin koyusu
            border: '1px solid rgba(0, 0, 0, 0.15)',
          }}
        />

        {/* Inner square - actual keycap color */}
        <div
          className="absolute"
          style={{
            top: 2 * scale,        // Yukarı: yakın
            left: 6 * scale,       // Sol: uzak
            right: 6 * scale,      // Sağ: uzak
            bottom: 10 * scale,     // Aşağı: çok uzak
            borderRadius: 3, // İç kare için daha yumuşak köşeler
            background: keycap.color || '#ffffff', // Asıl keycap rengi
          }}
        />

        {/* Content layer */}
        <div className="absolute inset-0" style={{ borderRadius: BORDER_RADIUS }}>
          {keycap.layers?.map((layer) => renderLayer(layer))}
        </div>
      </div>
    );
  }
);

KeycapPreview.displayName = 'KeycapPreview';

export default KeycapPreview;