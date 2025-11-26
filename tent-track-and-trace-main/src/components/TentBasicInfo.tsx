import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TentStatus } from '@/types/tent';

interface TentBasicInfoProps {
  formData: {
    name: string;
    model: string;
    capacity: number;
    status: TentStatus;
    condition: string;
    lastInspected: string;
    location: string;
  };
  onChange: (field: string, value: string | number | TentStatus) => void;
}

const TentBasicInfo: React.FC<TentBasicInfoProps> = ({ formData, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre de la Carpa</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="ej., Carpa Coleman Domo"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => onChange('model', e.target.value)}
            placeholder="ej., Sundome 4-Personas"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="capacity">Capacidad (personas)</Label>
          <Input
            id="capacity"
            type="number"
            step="any"
            min="0"
            value={formData.capacity}
            onChange={(e) => onChange('capacity', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select value={formData.status} onValueChange={(value: TentStatus) => onChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Buena Condición</SelectItem>
              <SelectItem value="needs-repair">Necesita Reparación</SelectItem>
              <SelectItem value="missing-items">Faltan Elementos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="lastInspected">Última Inspección</Label>
          <Input
            id="lastInspected"
            type="date"
            value={formData.lastInspected}
            onChange={(e) => onChange('lastInspected', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Ubicación de Almacenamiento</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="ej., Almacén A-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="condition">Notas de Condición</Label>
        <Textarea
          id="condition"
          value={formData.condition}
          onChange={(e) => onChange('condition', e.target.value)}
          placeholder="Describe la condición general, cualquier observación..."
          rows={3}
        />
      </div>
    </>
  );
};

export default TentBasicInfo;