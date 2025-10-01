import React, { useState } from 'react';
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig';
import { layoutOptions } from '@/data/layouts';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import KeyboardPreview from '@/components/KeyboardPreview';
import Keyboard3D from '@/components/Keyboard3D';
import DragSelection from '@/components/DragSelection';
import FloatingToolbar from '@/components/FloatingToolbar';
import LayerManager from '@/components/LayerManager';
import ExportPanel from '@/components/ExportPanel';
import { Box, Monitor, ShoppingCart, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
      
      // Auto-select the first layer if the key has layers
      const keyLayers = getKeyLayers(keyId);
      if (keyLayers.length > 0) {
        selectLayer(keyLayers[0].id);
      } else {
        selectLayer(null);
      }
    }
  };

  const handleDragSelection = (keyIds: string[]) => {
    selectKeys(keyIds);
  };

  const handleKeyDoubleClick = (keyId: string) => {
    startEditingKey(keyId);
  };

  const handleLayerSelect = (layerId: string) => {
    if (layerId === '') {
      selectLayer(null); // Clear layer selection
    } else {
      selectLayer(layerId);
    }
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
        <header className="border-b border-border bg-card/50 backdrop-blur h-16 relative z-20">
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
            
            {/* Right side - Export, View toggle, Cart and Profile icons */}
            <div className="flex items-center gap-4">
              {/* Export Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Export Configuration"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <ExportPanel config={config} />
                </PopoverContent>
              </Popover>
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
        <div className="w-full flex-1 flex overflow-hidden relative z-10">
            {/* Left Panel - Unified Sidebar */}
            <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-y-auto relative z-20 bg-card/80 backdrop-blur-sm">
            <UnifiedSidebar
              layouts={layoutOptions}
              selectedLayout={config.layout.id as any}
              onLayoutChange={changeLayout}
              groups={config.groups}
              selectedKeys={config.selectedKeys}
              onSaveGroup={saveGroup}
              onLoadGroup={loadGroup}
              onDeleteGroup={deleteGroup}
              editingKeyId={editingKeyId}
              currentKeyLayers={currentKeyLayers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={selectLayer}
              onLayerReorder={(layerId, direction) => editingKeyId && reorderLayer(editingKeyId, layerId, direction)}
              onLayerDelete={(layerId) => editingKeyId && deleteLayer(editingKeyId, layerId)}
              onAddTextLayer={() => {
                editingKeyId && addLayer(editingKeyId, 'text');
              }}
              onAddImageLayer={() => {
                editingKeyId && addLayer(editingKeyId, 'image');
              }}
            />
          </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 min-w-0 px-4 py-6 relative z-10">
              {/* Floating Toolbar - Positioned absolutely to float over content */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                  <FloatingToolbar
                    selectedColor={getCurrentColor()}
                    selectedTextColor={getCurrentTextColor()}
                    onColorChange={handleColorChange}
                    onTextColorChange={handleTextColorChange}
                    selectedKeysCount={config.selectedKeys.length}
                    editingKey={editingKey}
                    selectedLayer={selectedLayer}
                    onLayerUpdate={updateLayer}
                    onLegendChange={(keyId, layerId, content) => {
                      updateLayer(keyId, layerId, { content });
                    }}
                  />
                </div>
              </div>
              
              <div className="h-full flex items-center justify-center">
                
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
                      editingKeyId={editingKeyId}
                      currentKeyLayers={currentKeyLayers}
                      selectedLayerId={selectedLayerId}
                      onLayerSelect={handleLayerSelect}
                    />
                  </DragSelection>
                )}
                
              </div>
            </div>
          </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 backdrop-blur mt-auto relative z-20">
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
