import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Save, X } from 'lucide-react';

interface LegendEditorProps {
  selectedKeyId: string | null;
  currentLegend: string;
  onLegendChange: (keyId: string, legend: string) => void;
  onClose: () => void;
}

const LegendEditor: React.FC<LegendEditorProps> = ({
  selectedKeyId,
  currentLegend,
  onLegendChange,
  onClose,
}) => {
  const [legend, setLegend] = useState(currentLegend);

  const handleSave = () => {
    if (selectedKeyId) {
      onLegendChange(selectedKeyId, legend);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!selectedKeyId) return null;

  return (
    <Card className="mb-6 border-primary/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Type className="h-5 w-5" />
          Edit Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="legend-input">Key Legend</Label>
          <Input
            id="legend-input"
            value={legend}
            onChange={(e) => setLegend(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter key text..."
            className="bg-background"
            autoFocus
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={onClose} variant="outline" size="sm" className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Press Enter to save, Escape to cancel
        </p>
      </CardContent>
    </Card>
  );
};

export default LegendEditor;