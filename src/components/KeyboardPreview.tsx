import React from 'react';
import { KeyboardLayout, KeycapLayer } from '@/types/keyboard';
import KeycapPreview from './KeycapPreview';
import KeyLayerPreview from './KeyLayerPreview';

interface KeyboardPreviewProps {
  layout: KeyboardLayout;
  selectedKeys: string[];
  onKeySelect: (keyId: string, event: React.MouseEvent) => void;
  onKeyDoubleClick: (keyId: string) => void;
  previewKeys?: string[];
  keyRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  // Layer preview props
  editingKeyId?: string | null;
  currentKeyLayers?: KeycapLayer[];
  selectedLayerId?: string | null;
  onLayerSelect?: (layerId: string) => void;
}

const KeyboardPreview: React.FC<KeyboardPreviewProps> = ({
  layout,
  selectedKeys,
  onKeySelect,
  onKeyDoubleClick,
  previewKeys = [],
  keyRefs,
  editingKeyId,
  currentKeyLayers = [],
  selectedLayerId,
  onLayerSelect,
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
        
        {/* Layer Preview - Show above the selected key */}
        {editingKeyId && currentKeyLayers.length > 0 && onLayerSelect && (
          (() => {
            const selectedKey = layout.keys.find(key => key.id === editingKeyId);
            if (!selectedKey) return null;
            
            return (
              <KeyLayerPreview
                layers={currentKeyLayers}
                selectedLayerId={selectedLayerId || null}
                onLayerSelect={onLayerSelect}
                onClose={() => onLayerSelect && onLayerSelect('')} // Close by clearing layer selection
                keyPosition={{
                  x: selectedKey.x * UNIT,
                  y: selectedKey.y * UNIT,
                  width: selectedKey.width * UNIT,
                  height: selectedKey.height * UNIT,
                }}
                unit={UNIT}
                padding={PADDING}
              />
            );
          })()
        )}
      </div>
    </div>
  );
};

export default KeyboardPreview;