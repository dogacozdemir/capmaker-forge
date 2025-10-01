import { useState, useCallback } from 'react';
import { KeyboardConfig, LayoutType, KeycapConfig, KeycapLayer } from '@/types/keyboard';
import { keyboardLayouts } from '@/data/layouts';
import { useLayerManagement } from './useLayerManagement';

export const useKeyboardConfig = () => {
  const [config, setConfig] = useState<KeyboardConfig>({
    layout: keyboardLayouts['60%'],
    globalSettings: {
      theme: 'dark',
      font: 'Arial',
    },
    selectedKeys: [],
    groups: {},
    allLayouts: {
      '60%': keyboardLayouts['60%'],
      'TKL': keyboardLayouts['TKL'],
      'Full': keyboardLayouts['Full'],
    },
    currentLayoutType: '60%',
  });

  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const { addLayer: originalAddLayer, deleteLayer, reorderLayer, updateLayer } = useLayerManagement(config, setConfig);

  // Override addLayer to automatically select the new layer
  const addLayer = useCallback((keyId: string, type: 'text' | 'image') => {
    const newLayerId = originalAddLayer(keyId, type);
    setSelectedLayerId(newLayerId);
  }, [originalAddLayer]);

  const changeLayout = useCallback((layoutType: LayoutType) => {
    setConfig(prev => {
      const existing = prev.allLayouts[layoutType] || keyboardLayouts[layoutType];
      return {
        ...prev,
        layout: existing,
        currentLayoutType: layoutType,
        selectedKeys: [],
        allLayouts: {
          ...prev.allLayouts,
          [layoutType]: existing,
        },
      };
    });
  }, []);

  const selectKey = useCallback((keyId: string, multiSelect = false) => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: multiSelect
        ? prev.selectedKeys.includes(keyId)
          ? prev.selectedKeys.filter(id => id !== keyId)
          : [...prev.selectedKeys, keyId]
        : [keyId],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: [],
    }));
  }, []);

  const updateKeycapColor = useCallback((keyIds: string[], color: string) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, color } : key
      );
      const currentType = prev.currentLayoutType;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentType]: updatedLayout,
        },
      };
    });
  }, []);

  const updateKeycapTextColor = useCallback((keyIds: string[], textColor: string) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, textColor } : key
      );
      const currentType = prev.currentLayoutType;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentType]: updatedLayout,
        },
      };
    });
  }, []);

  const getKeyLayers = useCallback((keyId: string): KeycapLayer[] => {
    const key = config.layout.keys.find(k => k.id === keyId);
    return key?.layers || [];
  }, [config.layout.keys]);

  const selectLayer = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
  }, []);

  const startEditingKey = useCallback((keyId: string) => {
    setEditingKeyId(keyId);
  }, []);

  const stopEditingKey = useCallback(() => {
    setEditingKeyId(null);
  }, []);

  const getSelectedKey = useCallback(() => {
    if (editingKeyId) {
      return config.layout.keys.find(key => key.id === editingKeyId);
    }
    return null;
  }, [config.layout.keys, editingKeyId]);

  const getSelectedKeys = useCallback(() => {
    return config.layout.keys.filter(key => config.selectedKeys.includes(key.id));
  }, [config.layout.keys, config.selectedKeys]);

  const selectKeys = useCallback((keyIds: string[]) => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: keyIds,
    }));
  }, []);

  const saveGroup = useCallback((groupName: string, keyIds: string[]) => {
    setConfig(prev => ({
      ...prev,
      groups: {
        ...prev.groups,
        [groupName]: keyIds,
      },
    }));
  }, []);

  const loadGroup = useCallback((groupName: string) => {
    const groupKeys = config.groups[groupName];
    if (groupKeys) {
      selectKeys(groupKeys);
    }
  }, [config.groups, selectKeys]);

  const deleteGroup = useCallback((groupName: string) => {
    setConfig(prev => {
      const newGroups = { ...prev.groups };
      delete newGroups[groupName];
      return {
        ...prev,
        groups: newGroups,
      };
    });
  }, []);

  return {
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
    // Layer management
    addLayer,
    deleteLayer,
    reorderLayer,
    updateLayer,
    getKeyLayers,
    selectLayer,
  };
};