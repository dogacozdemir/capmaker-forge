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
  const UNIT = 47;
  const SCALE = 1.1;

  const baseWidth = layout.width * UNIT * SCALE;
  const baseHeight = layout.height * UNIT * SCALE;

  return (
    <div className="relative h-full w-full">
      <div
        className="relative bg-gradient-to-b from-background to-card border"
        style={{
          width: baseWidth,
          height: baseHeight,
          borderRadius: '32px',
          border: '0.25px solid rgba(255, 255, 255, 0.1)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            // background click
          }
        }}
      >
        <div
          className="relative"
          style={{
            width: baseWidth,
            height: baseHeight,
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
                    x: selectedKey.x * UNIT,
                    y: selectedKey.y * UNIT,
                    width: selectedKey.width * UNIT,
                    height: selectedKey.height * UNIT,
                  }}
                  unit={UNIT} padding={0}                />
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default KeyboardPreview;
