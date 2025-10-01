import React from 'react';
import CompactLayoutSelector from '@/components/CompactLayoutSelector';
import GroupManager from '@/components/GroupManager';
import ExportPanel from '@/components/ExportPanel';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { KeyboardLayout, LayoutType } from '@/types/keyboard';

interface UnifiedSidebarProps {
  // Layout selector props
  layouts: Array<{
    id: LayoutType;
    name: string;
    description: string;
    keyCount: number;
  }>;
  selectedLayout: LayoutType;
  onLayoutChange: (layoutType: LayoutType) => void;

  // Group manager props
  groups: Record<string, string[]>;
  selectedKeys: string[];
  onSaveGroup: (groupName: string, keyIds: string[]) => void;
  onLoadGroup: (groupName: string) => void;
  onDeleteGroup: (groupName: string) => void;

  // Export panel props
  config: {
    layout: KeyboardLayout;
    globalSettings: {
      theme: string;
      font: string;
    };
    selectedKeys: string[];
    groups: Record<string, string[]>;
    allLayouts: Record<LayoutType, KeyboardLayout>;
    currentLayoutType: LayoutType;
  };
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  layouts,
  selectedLayout,
  onLayoutChange,
  groups,
  selectedKeys,
  onSaveGroup,
  onLoadGroup,
  onDeleteGroup,
  config,
}) => {
  return (
    <Card className="w-full h-full bg-card/80 backdrop-blur-sm border-border/50 border-r border-b-0 border-l-0 border-t-0 rounded-none">
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Layout Selection Section */}
        <div className="space-y-3">
          <CompactLayoutSelector
            layouts={layouts}
            selectedLayout={selectedLayout}
            onLayoutChange={onLayoutChange}
          />
        </div>

        <Separator className="bg-border/60" />

        {/* Group Management Section */}
        <div className="space-y-3">
          <GroupManager
            groups={groups}
            selectedKeys={selectedKeys}
            onSaveGroup={onSaveGroup}
            onLoadGroup={onLoadGroup}
            onDeleteGroup={onDeleteGroup}
          />
        </div>

        <Separator className="bg-border/60" />

        {/* Export Section */}
        <div className="space-y-3">
          <ExportPanel config={config} />
        </div>
      </div>
    </Card>
  );
};

export default UnifiedSidebar;
