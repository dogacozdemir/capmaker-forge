import React from 'react';
import { KeyboardLayout } from '@/types/keyboard';
import KeycapPreview from './KeycapPreview';

interface KeyboardPreviewProps {
  layout: KeyboardLayout;
  selectedKeys: string[];
  onKeySelect: (keyId: string, event: React.MouseEvent) => void;
  onKeyDoubleClick: (keyId: string) => void;
  previewKeys?: string[];
  keyRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const KeyboardPreview: React.FC<KeyboardPreviewProps> = ({
  layout,
  selectedKeys,
  onKeySelect,
  onKeyDoubleClick,
  previewKeys = [],
  keyRefs,
}) => {
  const UNIT = 48;
  const PADDING = 32;
  
  const baseWidth = layout.width * UNIT + PADDING * 2;
  const baseHeight = layout.height * UNIT + PADDING * 2;
  
  return (
    <div className="flex-1 flex items-center justify-center min-h-0">
      <div
        className="relative bg-gradient-to-b from-background to-card rounded-lg border border-border/50"
        style={{
          width: Math.max(baseWidth, 400), // Minimum width of 400px
          height: baseHeight,
          padding: PADDING,
        }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => {
          // Only clear selection if clicking on the container background, not on keys
          if (e.target === e.currentTarget) {
            // This will be handled by the parent DragSelection component
          }
        }}
      >
      {layout.keys.map((keycap) => (
        <KeycapPreview
          key={keycap.id}
          ref={(el) => {
            if (keyRefs) {
              keyRefs.current[keycap.id] = el;
            }
          }}
          keycap={keycap}
          selected={selectedKeys.includes(keycap.id)}
          previewSelected={previewKeys.includes(keycap.id)}
          onClick={(event) => onKeySelect(keycap.id, event)}
          onDoubleClick={() => onKeyDoubleClick(keycap.id)}
        />
      ))}
      </div>
    </div>
  );
};

export default KeyboardPreview;