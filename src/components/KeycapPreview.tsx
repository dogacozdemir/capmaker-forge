import React, { forwardRef } from 'react';
import { KeycapConfig } from '@/types/keyboard';

interface KeycapPreviewProps {
  keycap: KeycapConfig;
  selected: boolean;
  previewSelected?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onDoubleClick: () => void;
  scale?: number;
}

const KeycapPreview = forwardRef<HTMLDivElement, KeycapPreviewProps>(({
  keycap,
  selected,
  previewSelected = false,
  onClick,
  onDoubleClick,
  scale = 1,
}, ref) => {
  const UNIT = 48 * scale;
  const BORDER_RADIUS = 6 * scale;
  
  const width = keycap.width * UNIT;
  const height = keycap.height * UNIT;
  
  return (
    <div
      ref={ref}
      className={`
        absolute cursor-pointer transition-all duration-200 ease-out
        border border-keycap-border shadow-keycap
        hover:shadow-elevated hover:border-primary/50
        ${selected ? 'border-primary shadow-elevated ring-2 ring-primary/30' : ''}
        ${previewSelected && !selected ? 'border-primary/60 shadow-elevated ring-1 ring-primary/20 bg-primary/5' : ''}
      `}
      style={{
        left: keycap.x * UNIT,
        top: keycap.y * UNIT,
        width,
        height,
        borderRadius: BORDER_RADIUS,
        background: keycap.color || '#2D3748',
      }}
      onMouseDown={(e) => {
        // Only stop propagation for ctrl/cmd+click (multi-select)
        if (e.ctrlKey || e.metaKey) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        // Only stop propagation for ctrl/cmd+click (multi-select)
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
      <div
        className="absolute inset-0 flex"
        style={{
          alignItems: keycap.legendVerticalAlignment === 'top' ? 'flex-start' : 
                     keycap.legendVerticalAlignment === 'bottom' ? 'flex-end' : 'center',
          justifyContent: keycap.legendAlignment === 'left' ? 'flex-start' : 
                         keycap.legendAlignment === 'right' ? 'flex-end' : 'center',
          transform: `translate(${(keycap.legendOffsetX ?? 0) * scale}px, ${(keycap.legendOffsetY ?? 0) * scale}px)`
        }}
      >
        {keycap.legendMode === 'image' && keycap.legendImage ? (
          <img
            src={keycap.legendImage}
            alt="Key legend image"
            className="pointer-events-none select-none"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              transform: `
                scale(${(keycap.legendFontSize ?? 14) / 14})
                rotate(${keycap.legendRotation ?? 0}deg)
                scaleX(${keycap.legendMirrorX ? -1 : 1})
                scaleY(${keycap.legendMirrorY ? -1 : 1})
              `,
            }}
          />
        ) : (
          <span
            className="text-xs font-medium pointer-events-none select-none"
            style={{
              color: keycap.textColor,
              fontSize: (keycap.legendFontSize ?? Math.max(8 * scale, 10)),
              fontFamily: keycap.legendFont ?? undefined,
              fontWeight: keycap.legendBold ? 'bold' : 'normal',
              fontStyle: keycap.legendItalic ? 'italic' : 'normal',
              textDecoration: keycap.legendUnderline ? 'underline' : 'none',
              transform: `
                rotate(${keycap.legendRotation ?? 0}deg)
                scaleX(${keycap.legendMirrorX ? -1 : 1})
                scaleY(${keycap.legendMirrorY ? -1 : 1})
              `,
            }}
          >
            {keycap.legend}
          </span>
        )}
      </div>
      
      {/* Keycap highlight effect */}
      <div
        className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ borderRadius: BORDER_RADIUS }}
      />
    </div>
  );
});

KeycapPreview.displayName = 'KeycapPreview';

export default KeycapPreview;