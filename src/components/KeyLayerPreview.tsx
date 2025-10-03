import React, { useEffect, useRef, useState } from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Plus, Type, Image } from 'lucide-react';

interface KeyLayerPreviewProps {
  layers: KeycapLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onClose?: () => void;
  onAddTextLayer?: () => void;
  onAddImageLayer?: () => void;
  keyPosition: { x: number; y: number; width: number; height: number };
  unit: number;
  padding: number;
}

const KeyLayerPreview: React.FC<KeyLayerPreviewProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onClose,
  onAddTextLayer,
  onAddImageLayer,
  keyPosition,
  unit,
  padding,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Click-outside effect to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        onClose?.();
        setShowAddMenu(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (layers.length === 0 || !selectedLayerId) return null;

  // Position relative to key center
  const keyCenterX = keyPosition.x + keyPosition.width / 2;
  const keyCenterY = keyPosition.y + keyPosition.height / 2;
  const previewY = keyCenterY - 52;

  return (
    <div
      ref={previewRef}
      className="absolute pointer-events-auto z-50"
      style={{
        left: keyCenterX,
        top: previewY,
        transform: 'translate(-50%, -50%)',
        transformOrigin: 'center center',
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
            {layer.type === 'image' && layer.content?.trim() !== '' ? (
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
        
        {/* Add Layer Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-7 h-7 rounded-full border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-sm"
          >
            <Plus className="w-3 h-3" />
          </button>
          
          {/* Add Layer Menu */}
          {showAddMenu && (
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-md shadow-elevated p-1 flex gap-1 z-50">
              <button
                onClick={() => {
                  onAddTextLayer?.();
                  setShowAddMenu(false);
                }}
                className="w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Add Text Layer"
              >
                <Type className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  onAddImageLayer?.();
                  setShowAddMenu(false);
                }}
                className="w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Add Image Layer"
              >
                <Image className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyLayerPreview;
