import React from 'react';
import { LayoutType, LayoutOption } from '@/types/keyboard';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Keyboard } from 'lucide-react';

interface CompactLayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const CompactLayoutSelector: React.FC<CompactLayoutSelectorProps> = ({
  layouts,
  selectedLayout,
  onLayoutChange,
}) => {
  const selectedLayoutData = layouts.find(layout => layout.id === selectedLayout);

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevated p-4">
      <div className="flex flex-col items-center gap-3">
        <Label className="text-sm font-medium text-foreground">Layout</Label>
        <div className="flex items-center gap-2 w-full">
          <Keyboard className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLayout} onValueChange={onLayoutChange}>
            <SelectTrigger className="w-full h-8 text-sm border-border bg-background text-foreground">
              <SelectValue>
                {selectedLayoutData ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{selectedLayoutData.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {selectedLayoutData.keyCount} keys
                    </span>
                  </div>
                ) : (
                  'Select Layout'
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {layouts.map((layout) => (
                <SelectItem key={layout.id} value={layout.id} className="text-foreground">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{layout.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {layout.description}
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded ml-2">
                      {layout.keyCount} keys
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CompactLayoutSelector;
