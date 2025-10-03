import React, { forwardRef, useState } from 'react';
import { KeycapConfig } from '@/types/keyboard';
import SVGKeycap from './SVGKeycap';

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
    const [hovered, setHovered] = useState(false);
    const UNIT = 48 * scale;
    const KEY_SPACING = 4 * scale;
    const width = keycap.width * UNIT - KEY_SPACING;
    const height = keycap.height * UNIT - KEY_SPACING;

    // Determine if this is an L-shaped keycap (ISO Enter)
    const keycapText = keycap.layers?.[0]?.content || '';
    const isLShape = keycapText === 'Enter' && keycap.height === 2;

    return (
      <div
        ref={ref}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          relative cursor-pointer transition-all duration-150
          ${selected ? 'z-10' : 'z-0'}
          ${previewSelected ? 'opacity-50' : 'opacity-100'}
        `}
        style={{
          width: width,
          height: height,
        }}
      >
        <SVGKeycap
          keycap={keycap}
          scale={scale}
          showBorder={selected}
          shape={isLShape ? 'l-shape' : 'rect'}
          selected={selected}
          hovered={hovered}
        />
      </div>
    );
  }
);

SVGKeycapPreview.displayName = 'SVGKeycapPreview';

export default SVGKeycapPreview;