import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupManagerProps {
  groups: Record<string, string[]>;
  selectedKeys: string[];
  onSaveGroup: (groupName: string, keyIds: string[]) => void;
  onLoadGroup: (groupName: string) => void;
  onDeleteGroup: (groupName: string) => void;
  className?: string;
}

const GroupManager: React.FC<GroupManagerProps> = ({
  groups,
  selectedKeys,
  onSaveGroup,
  onLoadGroup,
  onDeleteGroup,
  className,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSaveGroup = () => {
    if (newGroupName.trim() && selectedKeys.length > 0) {
      onSaveGroup(newGroupName.trim(), selectedKeys);
      setNewGroupName('');
      setShowSaveInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveGroup();
    }
    if (e.key === 'Escape') {
      setShowSaveInput(false);
      setNewGroupName('');
    }
  };

  const groupNames = Object.keys(groups);

  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Key Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Save current selection */}
        <div className="space-y-2">
          {!showSaveInput ? (
            <Button
              onClick={() => setShowSaveInput(true)}
              disabled={selectedKeys.length === 0}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="w-3 h-3 mr-1" />
              Save Selection ({selectedKeys.length} keys)
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Group name..."
                className="text-sm"
                autoFocus
              />
              <Button
                onClick={handleSaveGroup}
                disabled={!newGroupName.trim()}
                size="sm"
                variant="default"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Saved groups */}
        {groupNames.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">Saved Groups</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {groupNames.map((groupName) => (
                <div
                  key={groupName}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  <button
                    onClick={() => onLoadGroup(groupName)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{groupName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {groups[groupName].length}
                      </Badge>
                    </div>
                  </button>
                  <Button
                    onClick={() => onDeleteGroup(groupName)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupNames.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-4">
            No saved groups yet. Select keys and save them as a group.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupManager;