import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TentCard from '@/components/TentCard'
import TentForm from '@/components/TentForm'
import { Tent } from '@/types/tent'
import { useTents, useCreateTent, useUpdateTent, useDeleteTent } from '@/hooks/useTents'

const Index = () => {
  // Datos desde la API (nada hardcodeado)
  const { data: tents = [], isLoading, isError, error } = useTents()

  // Mutations
  const createTent = useCreateTent()
  const updateTent = useUpdateTent()
  const deleteTent = useDeleteTent()

  // UI local
  const [showForm, setShowForm] = useState(false)
  const [editingTent, setEditingTent] = useState<Tent | null>(null)

  const handleAddTent = async (tent: Omit<Tent, 'id'>) => {
    await createTent.mutateAsync(tent)
    setShowForm(false)
  }

  const handleEditTent = async (tent: Tent) => {
    await updateTent.mutateAsync(tent)
    setEditingTent(null)
    setShowForm(false)
  }

  const handleDeleteTent = async (id: string) => {
    await deleteTent.mutateAsync(id)
  }

  const openEditForm = (tent: Tent) => {
    setEditingTent(tent)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTent(null)
  }

  // Stats en vivo derivados de 'tents'
  const total = tents.length
  const goodTents = tents.filter(t => t.status === 'good').length
  const needsRepair = tents.filter(t => t.status === 'needs-repair').length
  const missingItems = tents.filter(t => t.status === 'missing-items').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">⛺</span>
            </div>
            Sistema de Gestión de Carpas
          </h1>
          <p className="text-green-700 text-lg">Rastrea y gestiona tu inventario de carpas de camping</p>
        </div>

        {/* Loading / Error */}
        {isLoading && <div className="mb-6 text-green-700">Cargando inventario…</div>}
        {isError && (
          <div className="mb-6 text-red-700">
            Error al cargar: {(error as Error)?.message}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Total de Carpas</h3>
            <p className="text-3xl font-bold text-green-600">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700">Buena Condición</h3>
            <p className="text-3xl font-bold text-blue-600">{goodTents}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-gray-700">Necesita Reparación</h3>
            <p className="text-3xl font-bold text-orange-600">{needsRepair}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700">Faltan Elementos</h3>
            <p className="text-3xl font-bold text-red-600">{missingItems}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">Inventario de Carpas</h2>
          <Button
            onClick={() => { setEditingTent(null); setShowForm(true) }}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Nueva Carpa
          </Button>
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tents.map((tent) => (
            <TentCard
              key={tent.id}
              tent={tent}
              onEdit={openEditForm}
              onDelete={handleDeleteTent}
            />
          ))}
        </div>

        {tents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⛺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay carpas en el inventario</h3>
            <p className="text-gray-500 mb-4">Comienza agregando tu primera carpa al sistema</p>
            <Button
              onClick={() => { setEditingTent(null); setShowForm(true) }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Agregar Tu Primera Carpa
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <TentForm
          tent={editingTent}
          onSave={editingTent ? handleEditTent : handleAddTent}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

export default Index
