import React, { useState, useRef, useCallback, useEffect } from 'react';
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
      
      // Check if key intersects with the selection box (any overlap selects the key)
      if (keyRect.left < selectionRect.right && 
          keyRect.right > selectionRect.left && 
          keyRect.top < selectionRect.bottom && 
          keyRect.bottom > selectionRect.top) {
        intersectingKeys.push(key.id);
      }
    });
    
    return intersectingKeys;
  }, [layout.keys]);

  // Add global mouse event listeners for smooth dragging across UI elements
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
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
    };

    const handleGlobalMouseUp = () => {
      if (isSelecting && selectionBox) {
        // Use the preview keys as the final selection
        onKeysSelect(previewKeys);
      }
      
      setIsSelecting(false);
      setSelectionBox(null);
      setPreviewKeys([]);
    };

    if (isSelecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting, selectionBox, calculateIntersectingKeys, previewKeys, onKeysSelect]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Start selection on any mouse down, but only if not ctrl/cmd+click
    // Also check if the target is not an interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button, input, select, textarea, [role="button"], [role="menuitem"], [role="tab"]');
    
    if (!e.ctrlKey && !e.metaKey && !isInteractiveElement) {
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

  // Local mouse handlers are now handled by global listeners

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
      className="relative select-none h-full w-full"
      onMouseDown={handleMouseDown}
      onClick={handleContainerClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Static Background Layer */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, hsl(199 89% 48% / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(37 92% 50% / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsl(217 33% 8% / 0.3) 0%, transparent 50%),
            linear-gradient(135deg, hsl(217 33% 6%) 0%, hsl(217 33% 4%) 100%)
          `,
          zIndex: 1, // Above keycaps, below UI elements
        }}
      />
      
      {/* Static gradient orbs */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 30% 70%, hsl(199 89% 48% / 0.05) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, hsl(37 92% 50% / 0.05) 0%, transparent 40%)
          `,
          zIndex: 1,
        }}
      />

      {/* Content Layer - Higher z-index for UI elements */}
      <div className="relative z-10 h-full w-full">
        {React.cloneElement(children as React.ReactElement, {
          previewKeys: previewKeys,
          keyRefs: keyRefs
        })}
      </div>
      
      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="absolute border-2 border-primary bg-primary/10 pointer-events-none rounded-sm"
          style={{
            ...getSelectionBoxStyle(),
            zIndex: 20, // Above keyboard and UI elements for visibility
          }}
        />
      )}
    </div>
  );
};

export default DragSelection;