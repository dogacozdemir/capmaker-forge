import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Type,
  Bold,
  Italic,
  Underline,
  Pipette,
  ArrowUp,
  ArrowDown,
  Minus,
  Image,
  Upload,
  Move,
  Maximize2,
  MoveVertical,
  MoveHorizontal
} from 'lucide-react';
import { KeycapLayer } from '@/types/keyboard';

interface FloatingToolbarProps {
  selectedColor: string;
  selectedTextColor: string;
  onColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  selectedKeysCount: number;
  editingKey: any;
  selectedKeys: any[];
  selectedLayer: KeycapLayer | null;
  onLayerUpdate: (keyId: string, layerId: string, updates: Partial<KeycapLayer>) => void;
  onLegendChange: (keyId: string, layerId: string, content: string) => void;
  onMultiLayerUpdate: (keyIds: string[], layerId: string, updates: Partial<KeycapLayer>) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  selectedColor,
  selectedTextColor,
  onColorChange,
  onTextColorChange,
  selectedKeysCount,
  editingKey,
  selectedKeys,
  selectedLayer,
  onLayerUpdate,
  onLegendChange,
  onMultiLayerUpdate,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showXSlider, setShowXSlider] = useState(false);
  const [showYSlider, setShowYSlider] = useState(false);
  const [showRotSlider, setShowRotSlider] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  
  // Refs for click outside detection
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  // Local state for sliders to prevent re-renders during dragging
  const [localPositionX, setLocalPositionX] = useState([0]);
  const [localPositionY, setLocalPositionY] = useState([0]);
  const [localRotation, setLocalRotation] = useState([0]);
  const [localFontSize, setLocalFontSize] = useState([14]);

  // Sync local state with selectedLayer when it changes
  useEffect(() => {
    if (selectedLayer) {
      setLocalPositionX([selectedLayer.offsetX || 0]);
      setLocalPositionY([selectedLayer.offsetY || 0]);
      setLocalRotation([selectedLayer.rotation || 0]);
      setLocalFontSize([selectedLayer.fontSize || 14]);
    }
  }, [selectedLayer]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
        setShowTextInput(false);
        setShowImageUpload(false);
        setShowXSlider(false);
        setShowYSlider(false);
        setShowRotSlider(false);
        setShowSizeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact',
    'Lucida Console',
    'Tahoma'
  ];

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
  ];

  // Helper function to determine if we're in multiselect mode
  const isMultiselect = selectedKeysCount > 1;
  
  // Helper function to get the target keys for operations
  const getTargetKeys = () => {
    if (isMultiselect) {
      return selectedKeys;
    }
    return editingKey ? [editingKey] : [];
  };
  
  // Helper function to apply updates to multiple keys
  const applyToMultipleKeys = (updates: Partial<KeycapLayer>) => {
    const targetKeys = getTargetKeys();
    if (targetKeys.length === 0) return;
    
    if (isMultiselect) {
      // For multiselect, apply to the first layer of each key that has layers
      targetKeys.forEach(key => {
        const layers = key.layers || [];
        if (layers.length > 0) {
          // Use the first layer of each key for multiselect operations
          onMultiLayerUpdate([key.id], layers[0].id, updates);
        }
      });
    } else if (editingKey && selectedLayer) {
      onLayerUpdate(editingKey.id, selectedLayer.id, updates);
    }
  };


  // Debounced update to parent component
  useEffect(() => {
    if (editingKey && selectedLayer && onLayerUpdate) {
      const timeoutId = setTimeout(() => {
        const updates: Partial<KeycapLayer> = {
          offsetX: localPositionX[0],
          offsetY: localPositionY[0],
          rotation: localRotation[0],
        };
        
        // Only include font size if the layer already has a font size set or if it's been manually changed
        if (selectedLayer.fontSize !== undefined || localFontSize[0] !== 14) {
          updates.fontSize = localFontSize[0];
        }
        
        onLayerUpdate(editingKey.id, selectedLayer.id, updates);
      }, 10); // Small delay to prevent excessive updates
      return () => clearTimeout(timeoutId);
    }
  }, [localPositionX, localPositionY, localRotation, localFontSize, editingKey, selectedLayer, onLayerUpdate]);

  const startEyedropper = useCallback(async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        onColorChange(result.sRGBHex);
      } catch (err) {
        console.log('EyeDropper failed:', err);
      }
    }
  }, [onColorChange]);

  const handleAlignmentChange = useCallback((alignment: 'left' | 'center' | 'right') => {
    applyToMultipleKeys({ alignment });
  }, [applyToMultipleKeys]);

  const handleVerticalAlignmentChange = useCallback((alignment: 'top' | 'center' | 'bottom') => {
    applyToMultipleKeys({ verticalAlignment: alignment });
  }, [applyToMultipleKeys]);

  const handleMirrorChange = useCallback((axis: 'X' | 'Y', value: boolean) => {
    applyToMultipleKeys({ [`mirror${axis}`]: value });
  }, [applyToMultipleKeys]);

  const handleFontChange = useCallback((font: string) => {
    applyToMultipleKeys({ font });
  }, [applyToMultipleKeys]);

  const handlePositionXChange = useCallback((value: number[]) => {
    setLocalPositionX(value);
    applyToMultipleKeys({ offsetX: value[0] });
  }, [applyToMultipleKeys]);

  const handlePositionYChange = useCallback((value: number[]) => {
    setLocalPositionY(value);
    applyToMultipleKeys({ offsetY: value[0] });
  }, [applyToMultipleKeys]);

  const handleRotationChange = useCallback((value: number[]) => {
    setLocalRotation(value);
    applyToMultipleKeys({ rotation: value[0] });
  }, [applyToMultipleKeys]);

  const handleFontSizeChange = useCallback((value: number[]) => {
    setLocalFontSize(value);
  }, []);

  const handleTextStyleChange = useCallback((style: 'bold' | 'italic' | 'underline') => {
    const currentStyle = selectedLayer?.[style] || false;
    applyToMultipleKeys({ [style]: !currentStyle });
  }, [applyToMultipleKeys, selectedLayer]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updates = { 
            content: event.target.result as string,
            type: 'image' as const
          };
          applyToMultipleKeys(updates);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [applyToMultipleKeys]);

  // Show toolbar even when no key is selected (for layout changes, etc.)
  // if (selectedKeysCount === 0) return null;

  return (
    <div className="w-fit mx-auto" ref={toolbarRef}>
      <div className="bg-card border border-border rounded-lg shadow-elevated p-1.5 sm:p-2">
        {/* Main Toolbar Row - Responsive Layout */}
        <div className="flex items-center justify-start gap-1 flex-wrap sm:flex-nowrap">
          
          {/* Color Section */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <Label className="text-xs font-medium text-foreground hidden sm:block">Color</Label>
            <div className="flex items-center gap-1 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowXSlider(false);
                  setShowYSlider(false);
                  setShowRotSlider(false);
                  setShowSizeSlider(false);
                }}
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 border-border hover:bg-muted"
              >
                <Palette className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              {showColorPicker && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[220px]">
                  {/* Keycap Color */}
                  <div className="space-y-1 mb-3">
                    <Label className="text-xs font-medium text-foreground">Keycap Color</Label>
                    <div className="flex gap-1">
                      <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-10 h-6 p-1 border-border bg-background"
                      />
                      <Input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="flex-1 h-6 text-xs border-border bg-background text-foreground"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startEyedropper}
                        className="h-6 w-6 p-0 border-border hover:bg-muted"
                      >
                        <Pipette className="h-2.5 w-2.5 text-foreground" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-8 gap-0.5">
                      {presetColors.map((color) => (
                        <Button
                          key={color}
                          variant="outline"
                          size="sm"
                          className="w-5 h-5 p-0 border-border hover:bg-muted"
                          style={{ backgroundColor: color }}
                          onClick={() => onColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Text Color */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Text Color</Label>
                    <div className="flex gap-1">
                      <Input
                        type="color"
                        value={selectedTextColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="w-10 h-6 p-1 border-border bg-background"
                      />
                      <Input
                        type="text"
                        value={selectedTextColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="flex-1 h-6 text-xs border-border bg-background text-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-8 gap-0.5">
                      {presetColors.map((color) => (
                        <Button
                          key={color}
                          variant="outline"
                          size="sm"
                          className="w-5 h-5 p-0 border-border hover:bg-muted"
                          style={{ backgroundColor: color }}
                          onClick={() => onTextColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="h-4 w-px bg-border" />

          {/* Aligning, Positioning & Sizing Section */}
          <div className="flex flex-col items-center gap-1 relative flex-shrink-0">
            <Label className="text-xs font-medium text-foreground hidden sm:block">
              {isMultiselect ? `Multi-Select (${selectedKeysCount}) - First Layer` : 'Align & Position'}
            </Label>
            <div className="flex gap-0.5 flex-wrap sm:flex-nowrap">
              {/* Horizontal Alignment */}
              {(['left', 'center', 'right'] as const).map((align) => (
                <Button
                  key={align}
                  variant={selectedLayer?.alignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAlignmentChange(align)}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
                >
                  {align === 'left' && <AlignLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                  {align === 'center' && <AlignCenter className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                  {align === 'right' && <AlignRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                </Button>
              ))}
              
              {/* Vertical Alignment */}
              {(['top', 'center', 'bottom'] as const).map((align) => (
                <Button
                  key={align}
                  variant={selectedLayer?.verticalAlignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVerticalAlignmentChange(align)}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
                >
                  {align === 'top' && <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                  {align === 'center' && <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                  {align === 'bottom' && <ArrowDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />}
                </Button>
              ))}
              
              {/* Transform Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotationChange([(selectedLayer?.rotation || 0) + 90])}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <RotateCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              <Button
                variant={selectedLayer?.mirrorX ? "default" : "outline"}
                size="sm"
                onClick={() => handleMirrorChange('X', !selectedLayer?.mirrorX)}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <FlipHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              <Button
                variant={selectedLayer?.mirrorY ? "default" : "outline"}
                size="sm"
                onClick={() => handleMirrorChange('Y', !selectedLayer?.mirrorY)}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <FlipVertical className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              
              {/* Position Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowXSlider(!showXSlider);
                  setShowYSlider(false);
                  setShowRotSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <MoveHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowYSlider(!showYSlider);
                  setShowXSlider(false);
                  setShowRotSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <MoveVertical className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRotSlider(!showRotSlider);
                  setShowXSlider(false);
                  setShowYSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
              >
                <RotateCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </Button>
            </div>
            
            {/* Individual Slider Panels */}
            {showXSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">X Position: {localPositionX[0].toFixed(1)}</Label>
                  <Slider
                    value={localPositionX}
                    onValueChange={handlePositionXChange}
                    max={10}
                    min={-10}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            
            {showYSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">Y Position: {localPositionY[0].toFixed(1)}</Label>
                  <Slider
                    value={localPositionY}
                    onValueChange={handlePositionYChange}
                    max={10}
                    min={-10}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {showRotSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">Rotation: {localRotation[0].toFixed(0)}°</Label>
                  <Slider
                    value={localRotation}
                    onValueChange={handleRotationChange}
                    max={180}
                    min={-180}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="h-4 w-px bg-border" />

          {/* Text Section */}
            <div className="flex flex-col items-center gap-1 relative flex-shrink-0">
              <Label className="text-xs font-medium text-foreground hidden sm:block">Text</Label>
            <div className="flex flex-col gap-1">
              {/* Main Controls Row */}
              <div className="flex gap-0.5 items-center flex-wrap sm:flex-nowrap">
                {/* Font Selection */}
                <Select value={selectedLayer?.font || 'Arial'} onValueChange={handleFontChange}>
                  <SelectTrigger className="w-24 sm:w-28 h-6 text-xs border-border bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font} className="text-xs text-foreground">
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Text Style Buttons */}
                <Button
                  variant={selectedLayer?.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('bold')}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-xs font-bold border-border hover:bg-muted"
                >
                  B
                </Button>
                <Button
                  variant={selectedLayer?.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('italic')}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-xs italic border-border hover:bg-muted"
                >
                  I
                </Button>
                <Button
                  variant={selectedLayer?.underline ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('underline')}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-xs underline border-border hover:bg-muted"
                >
                  U
                </Button>
                
                {/* Size Control */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSizeSlider(!showSizeSlider);
                    setShowTextInput(false);
                    setShowImageUpload(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                  }}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
                >
                  <Maximize2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
                </Button>
                
                {/* Text Mode Button */}
                <Button
                  variant={selectedLayer?.type !== 'image' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    applyToMultipleKeys({ type: 'text' });
                    setShowTextInput(!showTextInput);
                    setShowImageUpload(false);
                    setShowSizeSlider(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                  }}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
                >
                  <Type className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
                </Button>
                
                {/* Image Mode Button */}
                <Button
                  variant={showImageUpload ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    // Don't change layer type immediately - only when image is uploaded
                    setShowImageUpload(!showImageUpload);
                    setShowTextInput(false);
                    setShowSizeSlider(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                  }}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 border-border hover:bg-muted"
                >
                  <Image className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
                </Button>
              </div>
              
              {/* Text Input Panel */}
              {showTextInput && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[250px]">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Text Input</Label>
                    <Input
                      value={selectedLayer?.content || ''}
                      onChange={(e) => {
                        const targetKeys = getTargetKeys();
                        if (targetKeys.length > 0) {
                          if (isMultiselect) {
                            // For multiselect, apply to first layer of each key
                            targetKeys.forEach(key => {
                              const layers = key.layers || [];
                              if (layers.length > 0) {
                                onLegendChange(key.id, layers[0].id, e.target.value);
                              }
                            });
                          } else if (editingKey && selectedLayer) {
                            onLegendChange(editingKey.id, selectedLayer.id, e.target.value);
                          }
                        }
                      }}
                      placeholder={isMultiselect ? "Enter text for all selected keys..." : "Enter key text..."}
                      className="h-6 text-xs border-border bg-background text-foreground"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              {/* Image Upload Panel */}
              {showImageUpload && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[250px]">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Image Upload</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-1 h-6 px-2 border border-border rounded-md bg-background hover:bg-muted text-xs text-foreground">
                      <Upload className="h-3 w-3" /> Upload Image
                    </Label>
                    {selectedLayer?.content && selectedLayer?.type === 'image' && selectedLayer.content.trim() !== '' && (
                      <div className="mt-1">
                        <img src={selectedLayer.content} alt="Preview" className="w-12 h-12 object-contain border border-border rounded" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Size Slider Panel */}
              {showSizeSlider && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground">Font Size: {localFontSize[0].toFixed(1)}px</Label>
                    <Slider
                      value={localFontSize}
                      onValueChange={handleFontSizeChange}
                      max={24}
                      min={8}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FloatingToolbar;