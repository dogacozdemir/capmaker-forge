import React, { forwardRef } from 'react';
import { KeycapConfig, KeycapLayer } from '@/types/keyboard';

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
    const BORDER_RADIUS = 4 * scale;

    const width = keycap.width * UNIT;
    const height = keycap.height * UNIT;

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
          border border-keycap-border shadow-keycap
          hover:shadow-elevated hover:border-primary/50
          ${selected ? 'border-primary shadow-elevated ring-2 ring-primary/30' : ''}
          ${
            previewSelected && !selected
              ? 'border-primary/60 shadow-elevated ring-1 ring-primary/20 bg-primary/5'
              : ''
          }
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.1)]
          hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.15),inset_0_-1px_3px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.2)]
        `}
        style={{
          left: keycap.x * UNIT,
          top: keycap.y * UNIT,
          width,
          height,
          borderRadius: BORDER_RADIUS,
          background: keycap.color || '#2D3748',
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
        {keycap.layers?.map((layer) => renderLayer(layer))}

        {/* Highlight effects */}
        <div
          className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ borderRadius: BORDER_RADIUS }}
        />
        <div
          className="absolute inset-x-1 top-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ borderRadius: BORDER_RADIUS }}
        />
      </div>
    );
  }
);

KeycapPreview.displayName = 'KeycapPreview';

export default KeycapPreview;
