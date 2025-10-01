import React from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronUp, ChevronDown, X, Plus, Type, Image } from 'lucide-react';
import { Separator } from './ui/separator';

interface LayerManagerProps {
  layers: KeycapLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete: (layerId: string) => void;
  onAddTextLayer: () => void;
  onAddImageLayer: () => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerReorder,
  onLayerDelete,
  onAddTextLayer,
  onAddImageLayer,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Components & Layers</h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onAddTextLayer}
            title="Add text layer"
          >
            <Type className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddImageLayer}
            title="Add image layer"
          >
            <Image className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Separator className="mb-3" />

      {layers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No layers yet. Click + to add one.
        </p>
      ) : (
        <div className="space-y-2">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`flex items-center gap-2 p-2 rounded border ${
                selectedLayerId === layer.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              } cursor-pointer transition-colors`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {layer.type === 'text' ? (
                  <Type className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Image className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm truncate">
                  {layer.type === 'text'
                    ? layer.content || 'Empty text'
                    : 'Image'}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerReorder(layer.id, 'up');
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerReorder(layer.id, 'down');
                  }}
                  disabled={index === layers.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerDelete(layer.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LayerManager;
