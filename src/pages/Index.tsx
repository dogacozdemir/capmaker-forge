import React, { useState } from 'react';
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig';
import { layoutOptions } from '@/data/layouts';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import KeyboardPreview from '@/components/KeyboardPreview';
import Keyboard3D from '@/components/Keyboard3D';
import DragSelection from '@/components/DragSelection';
import FloatingToolbar from '@/components/FloatingToolbar';
import LayerManager from '@/components/LayerManager';
import LayerEditor from '@/components/LayerEditor';
import { Box, Monitor, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [view3D, setView3D] = useState(false);
  
  const {
    config,
    editingKeyId,
    selectedLayerId,
    changeLayout,
    selectKey,
    selectKeys,
    clearSelection,
    updateKeycapColor,
    updateKeycapTextColor,
    startEditingKey,
    stopEditingKey,
    getSelectedKey,
    getSelectedKeys,
    saveGroup,
    loadGroup,
    deleteGroup,
    addLayer,
    deleteLayer,
    reorderLayer,
    updateLayer,
    getKeyLayers,
    selectLayer,
  } = useKeyboardConfig();

  const selectedKeys = getSelectedKeys();
  const editingKey = getSelectedKey();
  const currentKeyLayers = editingKeyId ? getKeyLayers(editingKeyId) : [];
  const selectedLayer = selectedLayerId 
    ? currentKeyLayers.find(l => l.id === selectedLayerId) 
    : null;

  const handleKeySelect = (keyId: string, event?: React.MouseEvent) => {
    const multiSelect = event?.ctrlKey || event?.metaKey;
    if (multiSelect) {
      selectKey(keyId, multiSelect);
    } else {
      // Single click - select and start editing
      selectKey(keyId, false);
      startEditingKey(keyId);
    }
  };

  const handleDragSelection = (keyIds: string[]) => {
    selectKeys(keyIds);
  };

  const handleKeyDoubleClick = (keyId: string) => {
    startEditingKey(keyId);
  };

  const handleColorChange = (color: string) => {
    if (config.selectedKeys.length > 0) {
      updateKeycapColor(config.selectedKeys, color);
    }
  };

  const handleTextColorChange = (textColor: string) => {
    if (config.selectedKeys.length > 0) {
      updateKeycapTextColor(config.selectedKeys, textColor);
    }
  };

  const getCurrentColor = () => {
    if (selectedKeys.length === 1) {
      return selectedKeys[0].color;
    }
    return '#2D3748'; // Default color
  };

  const getCurrentTextColor = () => {
    if (selectedKeys.length === 1) {
      return selectedKeys[0].textColor;
    }
    return '#FFFFFF'; // Default text color
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur h-16">
        <div className="w-full px-4 h-full">
          <div className="flex items-center justify-between h-full max-w-full">
            {/* Left side - Logo */}
            <div className="flex items-center gap-2 h-full">
              <img 
                src="/qeeboard.png" 
                alt="QeeBoard" 
                className="h-full w-auto object-contain"
              />
            </div>
            
            {/* Right side - View toggle, Cart and Profile icons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView3D(!view3D)}
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                title={view3D ? "Switch to 2D View" : "Switch to 3D View"}
              >
                {view3D ? <Monitor className="h-5 w-5" /> : <Box className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <div className="w-full flex-1 flex overflow-hidden">
        {/* Left Panel - Unified Sidebar */}
        <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-y-auto">
          <UnifiedSidebar
            layouts={layoutOptions}
            selectedLayout={config.layout.id as any}
            onLayoutChange={changeLayout}
            groups={config.groups}
            selectedKeys={config.selectedKeys}
            onSaveGroup={saveGroup}
            onLoadGroup={loadGroup}
            onDeleteGroup={deleteGroup}
            config={config}
          />
          
          {/* Layer Management - Show when a single key is selected */}
          {editingKeyId && config.selectedKeys.length === 1 && (
            <div className="p-4 space-y-4">
              <LayerManager
                layers={currentKeyLayers}
                selectedLayerId={selectedLayerId}
                onLayerSelect={selectLayer}
                onLayerReorder={(layerId, direction) => reorderLayer(editingKeyId, layerId, direction)}
                onLayerDelete={(layerId) => deleteLayer(editingKeyId, layerId)}
                onAddTextLayer={() => {
                  addLayer(editingKeyId, 'text');
                }}
                onAddImageLayer={() => {
                  addLayer(editingKeyId, 'image');
                }}
              />
              
              {selectedLayer && (
                <LayerEditor
                  layer={selectedLayer}
                  onLayerChange={(updates) => updateLayer(editingKeyId, selectedLayer.id, updates)}
                  onClose={() => selectLayer(null)}
                />
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 min-w-0 px-4 py-6 relative">
            <div className="space-y-4 h-full">

              {/* Floating Toolbar */}
              <FloatingToolbar
                selectedColor={getCurrentColor()}
                selectedTextColor={getCurrentTextColor()}
                onColorChange={handleColorChange}
                onTextColorChange={handleTextColorChange}
                selectedKeysCount={config.selectedKeys.length}
                editingKey={editingKey}
                onLegendSettingsChange={() => {}}
                onLegendChange={() => {}}
              />
              
              {/* Preview Area */}
              {view3D ? (
                <Keyboard3D
                  layout={config.layout}
                  selectedKeys={config.selectedKeys}
                  onKeySelect={(keyId) => handleKeySelect(keyId)}
                  onKeyDoubleClick={handleKeyDoubleClick}
                />
              ) : (
                <DragSelection
                  layout={config.layout}
                  selectedKeys={config.selectedKeys}
                  onKeysSelect={handleDragSelection}
                >
                  <KeyboardPreview
                    layout={config.layout}
                    selectedKeys={config.selectedKeys}
                    onKeySelect={handleKeySelect}
                    onKeyDoubleClick={handleKeyDoubleClick}
                  />
                </DragSelection>
              )}
              
              {/* Visual Layer Preview - Shows on top of selected key */}
              {editingKeyId && config.selectedKeys.length === 1 && currentKeyLayers.length > 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="bg-background/95 backdrop-blur border-2 border-primary rounded-lg shadow-2xl p-4 pointer-events-auto">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b">
                      <h4 className="text-sm font-semibold">Key Layers Preview</h4>
                      <span className="text-xs text-muted-foreground">{currentKeyLayers.length} layer{currentKeyLayers.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentKeyLayers.map((layer, index) => (
                        <div
                          key={layer.id}
                          className={`flex items-center gap-2 p-2 rounded border ${
                            selectedLayerId === layer.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card'
                          } cursor-pointer hover:bg-accent/50 transition-colors`}
                          onClick={() => selectLayer(layer.id)}
                        >
                          <div className="text-xs text-muted-foreground w-6">#{index + 1}</div>
                          <div className="flex-1">
                            {layer.type === 'image' && layer.content ? (
                              <img src={layer.content} alt="layer" className="h-8 w-auto max-w-[60px] object-contain" />
                            ) : (
                              <div className="text-sm truncate" style={{
                                fontFamily: layer.font,
                                fontSize: `${Math.min(layer.fontSize || 14, 16)}px`
                              }}>
                                {layer.content || 'Empty'}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {layer.type === 'image' ? '🖼️' : '📝'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur mt-auto">
          <div className="w-full px-4 py-3">
            <div className="text-center text-sm text-muted-foreground">
           Ⓒ2025 Qeeboard - Terms of Use | Privacy Policy | Contact | Support
            </div>
          </div>
      </footer>
    </div>
  );
};

export default Index;
