import React, { useEffect, useRef } from 'react';
import { KeycapLayer } from '@/types/keyboard';

interface KeyLayerPreviewProps {
  layers: KeycapLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onClose?: () => void;
  keyPosition: { x: number; y: number; width: number; height: number };
  unit: number;
  padding: number;
}

const KeyLayerPreview: React.FC<KeyLayerPreviewProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onClose,
  keyPosition,
  unit,
  padding,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Click-outside effect to close layer preview
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the preview container
      if (previewRef.current && !previewRef.current.contains(target)) {
        // Call onClose if it exists
        if (onClose) {
          onClose();
        }
      }
    };

    // Add a small delay to prevent immediate closing when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Early return after all hooks
  if (layers.length === 0 || !selectedLayerId) return null;

  // Calculate position above the selected key with more space
  const keyCenterX = keyPosition.x + keyPosition.width / 2;
  const keyTopY = keyPosition.y;
  const previewY = keyTopY - 45; // 45px above the key to avoid blocking

  return (
    <div
      ref={previewRef}
      className="absolute pointer-events-auto z-50"
      style={{
        left: keyCenterX,
        top: previewY,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-card/25 backdrop-blur-sm border border-border rounded-lg shadow-elevated p-2 flex gap-1.5 items-center">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onLayerSelect(layer.id)}
            className={`
              w-7 h-7 rounded-full border border-border flex items-center justify-center
              transition-all duration-200 hover:scale-105 hover:shadow-sm
              ${selectedLayerId === layer.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-card-foreground hover:bg-muted hover:border-primary/50'
              }
            `}
          >
            {layer.type === 'image' && layer.content && layer.content.trim() !== '' ? (
              <img
                src={layer.content}
                alt="layer"
                className="w-5 h-5 object-contain rounded-full"
              />
            ) : (
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: layer.font,
                  fontSize: '10px',
                  fontWeight: layer.bold ? 'bold' : 'normal',
                  fontStyle: layer.italic ? 'italic' : 'normal',
                  textDecoration: layer.underline ? 'underline' : 'none',
                }}
              >
                {layer.content || '?'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeyLayerPreview;
