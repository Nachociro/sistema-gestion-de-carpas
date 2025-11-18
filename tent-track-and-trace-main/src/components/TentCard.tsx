
import React from 'react';
import { Edit, Trash2, MapPin, Users, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tent } from '@/types/tent';

interface TentCardProps {
  tent: Tent;
  onEdit: (tent: Tent) => void;
  onDelete: (id: string) => void;
}

const TentCard: React.FC<TentCardProps> = ({ tent, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-repair':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'missing-items':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'needs-repair':
        return <AlertTriangle size={16} className="text-orange-600" />;
      case 'missing-items':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Buena Condición';
      case 'needs-repair':
        return 'Necesita Reparación';
      case 'missing-items':
        return 'Faltan Elementos';
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white border-2 hover:border-green-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">{tent.name}</CardTitle>
            <p className="text-gray-600 text-sm">{tent.model}</p>
          </div>
          <div className="text-4xl">⛺</div>
        </div>
        <Badge className={`w-fit flex items-center gap-1 ${getStatusColor(tent.status)}`}>
          {getStatusIcon(tent.status)}
          {getStatusText(tent.status)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} />
            <span>{tent.capacity} persona{tent.capacity !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span>{tent.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Inspeccionada: {new Date(tent.lastInspected).toLocaleDateString('es-ES')}</span>
        </div>

        <div className="text-sm">
          <p className="text-gray-700 line-clamp-2">{tent.condition}</p>
        </div>

        {tent.missingItems.length > 0 && (
          <div className="text-sm">
            <p className="font-medium text-red-700 mb-1">Elementos Faltantes:</p>
            <ul className="text-red-600 text-xs space-y-1">
              {tent.missingItems.slice(0, 2).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
              {tent.missingItems.length > 2 && (
                <li className="text-red-500">+ {tent.missingItems.length - 2} más</li>
              )}
            </ul>
          </div>
        )}

        {tent.damagedItems.length > 0 && (
          <div className="text-sm">
            <p className="font-medium text-orange-700 mb-1">Elementos Dañados:</p>
            <ul className="text-orange-600 text-xs space-y-1">
              {tent.damagedItems.slice(0, 2).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
              {tent.damagedItems.length > 2 && (
                <li className="text-orange-500">+ {tent.damagedItems.length - 2} más</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onEdit(tent)}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-green-50 hover:border-green-300"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>
          <Button
            onClick={() => onDelete(tent.id)}
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TentCard;
