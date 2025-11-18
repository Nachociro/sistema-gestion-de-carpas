import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ItemListManagerProps {
  title: string;
  items: string[];
  placeholder: string;
  itemType: 'missing' | 'damaged';
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

const ItemListManager: React.FC<ItemListManagerProps> = ({
  title,
  items,
  placeholder,
  itemType,
  onAddItem,
  onRemoveItem,
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const bgColorClass = itemType === 'missing' ? 'bg-red-50' : 'bg-orange-50';
  const textColorClass = itemType === 'missing' ? 'text-red-800' : 'text-orange-800';
  const buttonColorClass = itemType === 'missing' ? 'text-red-600 hover:text-red-800' : 'text-orange-600 hover:text-orange-800';

  return (
    <div>
      <Label>{title}</Label>
      <div className="flex gap-2 mt-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={handleAddItem} size="sm">
          <Plus size={16} />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mt-2 space-y-1">
          {items.map((item, index) => (
            <div key={index} className={`flex items-center justify-between ${bgColorClass} px-3 py-2 rounded`}>
              <span className={`text-sm ${textColorClass}`}>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
                className={buttonColorClass}
              >
                <Minus size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemListManager;