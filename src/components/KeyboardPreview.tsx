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
  const SCALE = 1.1;
  
  // Keyboard case padding (like thockfactory - visible border around keycaps)
  const CASE_PADDING = 26;

  const keycapsWidth = layout.width * UNIT * SCALE;
  const keycapsHeight = layout.height * UNIT * SCALE;
  
  const caseWidth = keycapsWidth + (CASE_PADDING * 2);
  const caseHeight = keycapsHeight + (CASE_PADDING * 2);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Keyboard Case - dark background like real mechanical keyboard */}
      <div
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black"
        style={{
          width: caseWidth,
          height: caseHeight,
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: CASE_PADDING,
        }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            // background click
          }
        }}
      >
        {/* Keycaps container */}
        <div
          className="relative"
          style={{
            width: keycapsWidth,
            height: keycapsHeight,
          }}
        >
          {/* Keycaps */}
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
              scale={SCALE}
            />
          ))}

          {/* Layer Preview */}
          {editingKeyId &&
            currentKeyLayers.length > 0 &&
            onLayerSelect &&
            (() => {
              const selectedKey = layout.keys.find(
                (key) => key.id === editingKeyId
              );
              if (!selectedKey) return null;

              return (
                <KeyLayerPreview
                  layers={currentKeyLayers}
                  selectedLayerId={selectedLayerId || null}
                  onLayerSelect={onLayerSelect}
                  onClose={() => onLayerSelect && onLayerSelect('')}
                  keyPosition={{
                    x: selectedKey.x * UNIT * SCALE,
                    y: selectedKey.y * UNIT * SCALE,
                    width: selectedKey.width * UNIT * SCALE,
                    height: selectedKey.height * UNIT * SCALE,
                  }}
                  unit={UNIT * SCALE}
                  padding={CASE_PADDING}
                />
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default KeyboardPreview;