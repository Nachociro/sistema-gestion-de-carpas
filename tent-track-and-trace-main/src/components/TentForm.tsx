
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tent, TentStatus } from '@/types/tent';
import TentBasicInfo from './TentBasicInfo';
import ItemListManager from './ItemListManager';

interface TentFormProps {
  tent?: Tent | null;
  onSave: (tent: Tent | Omit<Tent, 'id'>) => void;
  onCancel: () => void;
}

const TentForm: React.FC<TentFormProps> = ({ tent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    capacity: 2,
    status: 'good' as TentStatus,
    condition: '',
    lastInspected: new Date().toISOString().split('T')[0],
    missingItems: [] as string[],
    damagedItems: [] as string[],
    location: ''
  });


  useEffect(() => {
    if (tent) {
      setFormData({
        name: tent.name,
        model: tent.model,
        capacity: tent.capacity,
        status: tent.status,
        condition: tent.condition,
        lastInspected: tent.lastInspected,
        missingItems: [...tent.missingItems],
        damagedItems: [...tent.damagedItems],
        location: tent.location
      });
    }
  }, [tent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tent) {
      onSave({ ...tent, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleFormChange = (field: string, value: string | number | TentStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMissingItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      missingItems: [...prev.missingItems, item]
    }));
  };

  const removeMissingItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      missingItems: prev.missingItems.filter((_, i) => i !== index)
    }));
  };

  const addDamagedItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      damagedItems: [...prev.damagedItems, item]
    }));
  };

  const removeDamagedItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      damagedItems: prev.damagedItems.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-green-900">
            {tent ? 'Editar Carpa' : 'Agregar Nueva Carpa'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TentBasicInfo formData={formData} onChange={handleFormChange} />

            <ItemListManager
              title="Elementos Faltantes"
              items={formData.missingItems}
              placeholder="ej., Estacas para carpa (4)"
              itemType="missing"
              onAddItem={addMissingItem}
              onRemoveItem={removeMissingItem}
            />

            <ItemListManager
              title="Elementos Dañados"
              items={formData.damagedItems}
              placeholder="ej., Cremallera puerta principal"
              itemType="damaged"
              onAddItem={addDamagedItem}
              onRemoveItem={removeDamagedItem}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                {tent ? 'Actualizar Carpa' : 'Agregar Carpa'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TentForm;
