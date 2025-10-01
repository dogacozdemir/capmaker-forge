import React, { useState, useRef, useCallback } from 'react';
import { KeyboardLayout } from '@/types/keyboard';

interface DragSelectionProps {
  layout: KeyboardLayout;
  selectedKeys: string[];
  onKeysSelect: (keyIds: string[]) => void;
  children: React.ReactNode;
}

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const DragSelection: React.FC<DragSelectionProps> = ({
  layout,
  selectedKeys,
  onKeysSelect,
  children,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [previewKeys, setPreviewKeys] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Start selection on any mouse down, but only if not ctrl/cmd+click
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setIsSelecting(true);
      const rect = containerRef.current!.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      
      setSelectionBox({
        startX,
        startY,
        endX: startX,
        endY: startY,
      });
    }
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Clear selection when clicking on empty space (not on keys) and not during drag
    if (e.target === containerRef.current && !isSelecting) {
      onKeysSelect([]);
    }
  }, [onKeysSelect, isSelecting]);

  const calculateIntersectingKeys = useCallback((box: SelectionBox) => {
    if (!containerRef.current) return [];
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Convert selection box to global coordinates
    const globalStartX = box.startX + containerRect.left;
    const globalEndX = box.endX + containerRect.left;
    const globalStartY = box.startY + containerRect.top;
    const globalEndY = box.endY + containerRect.top;
    
    const selectionRect = {
      left: Math.min(globalStartX, globalEndX),
      right: Math.max(globalStartX, globalEndX),
      top: Math.min(globalStartY, globalEndY),
      bottom: Math.max(globalStartY, globalEndY),
    };
    
    const intersectingKeys: string[] = [];
    
    layout.keys.forEach(key => {
      const keyElement = keyRefs.current[key.id];
      if (!keyElement) return;
      
      const keyRect = keyElement.getBoundingClientRect();
      
      // Check if key is inside the selection box area
      if (keyRect.left >= selectionRect.left && 
          keyRect.right <= selectionRect.right && 
          keyRect.top >= selectionRect.top && 
          keyRect.bottom <= selectionRect.bottom) {
        intersectingKeys.push(key.id);
      }
    });
    
    return intersectingKeys;
  }, [layout.keys]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting && selectionBox && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      const newSelectionBox = {
        ...selectionBox,
        endX,
        endY,
      };
      
      setSelectionBox(newSelectionBox);
      
      // Calculate and update preview keys in real-time
      const intersectingKeys = calculateIntersectingKeys(newSelectionBox);
      setPreviewKeys(intersectingKeys);
    }
  }, [isSelecting, selectionBox, calculateIntersectingKeys]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectionBox) {
      // Use the preview keys as the final selection
      onKeysSelect(previewKeys);
    }
    
    setIsSelecting(false);
    setSelectionBox(null);
    setPreviewKeys([]);
  }, [isSelecting, selectionBox, previewKeys, onKeysSelect]);

  const getSelectionBoxStyle = () => {
    if (!selectionBox) return {};
    
    const minX = Math.min(selectionBox.startX, selectionBox.endX);
    const maxX = Math.max(selectionBox.startX, selectionBox.endX);
    const minY = Math.min(selectionBox.startY, selectionBox.endY);
    const maxY = Math.max(selectionBox.startY, selectionBox.endY);
    
    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleContainerClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {React.cloneElement(children as React.ReactElement, {
        previewKeys: previewKeys,
        keyRefs: keyRefs
      })}
      
      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="absolute border-2 border-primary bg-primary/10 pointer-events-none rounded-sm"
          style={getSelectionBoxStyle()}
        />
      )}
    </div>
  );
};

export default DragSelection;