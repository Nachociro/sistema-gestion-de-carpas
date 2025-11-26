import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API, j } from '@/lib/api'
import type { Tent } from '@/types/tent'

const mapOut = (t: any): Tent => ({
  ...t,
  lastInspected: new Date(t.lastInspected).toISOString().split('T')[0]
})

const computeStats = (tents: Tent[]) => ({
  total: tents.length,
  good: tents.filter(t => t.status === 'good').length,
  needsRepair: tents.filter(t => t.status === 'needs-repair').length,
  missingItems: tents.filter(t => t.status === 'missing-items').length
})

export function useTents() {
  return useQuery({
    queryKey: ['tents'],
    queryFn: async () => (await j<any[]>(`${API}/tents`)).map(mapOut),
    staleTime: 30_000
  })
}

export function useCreateTent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Tent, 'id'>) =>
      j<Tent>(`${API}/tents`, { method: 'POST', body: JSON.stringify(data) }),
    // OPTIMISTIC
    onMutate: async (newTent) => {
      await qc.cancelQueries({ queryKey: ['tents'] })
      const prev = qc.getQueryData<Tent[]>(['tents']) ?? []
      const optimistic: Tent = { ...newTent, id: `optimistic-${Date.now()}` }
      qc.setQueryData<Tent[]>(['tents'], [...prev, optimistic])
      qc.setQueryData(['stats'], computeStats([...prev, optimistic]))
      return { prev }
    },
    onSuccess: (created) => {
      const prev = qc.getQueryData<Tent[]>(['tents']) ?? []
      // Reemplazar la carpa optimista con la creada realmente
      const next = prev.map(t => 
        t.id.startsWith('optimistic-') ? created : t
      )
      qc.setQueryData<Tent[]>(['tents'], next)
      qc.setQueryData(['stats'], computeStats(next))
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData<Tent[]>(['tents'], ctx.prev)
        qc.setQueryData(['stats'], computeStats(ctx.prev))
      }
    },
  })
}

export function useUpdateTent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Tent) =>
      j<Tent>(`${API}/tents/${data.id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: ['tents'] })
      const prev = qc.getQueryData<Tent[]>(['tents']) ?? []
      const next = prev.map(t => t.id === patch.id ? { ...t, ...patch } : t)
      qc.setQueryData<Tent[]>(['tents'], next)
      qc.setQueryData(['stats'], computeStats(next))
      return { prev }
    },
    onSuccess: (updated) => {
      const prev = qc.getQueryData<Tent[]>(['tents']) ?? []
      const next = prev.map(t => t.id === updated.id ? updated : t)
      qc.setQueryData<Tent[]>(['tents'], next)
      qc.setQueryData(['stats'], computeStats(next))
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData<Tent[]>(['tents'], ctx.prev)
        qc.setQueryData(['stats'], computeStats(ctx.prev))
      }
    },
  })
}

export function useDeleteTent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`${API}/tents/${id}`, { method: 'DELETE' }).then(() => null),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['tents'] })
      const prev = qc.getQueryData<Tent[]>(['tents']) ?? []
      const next = prev.filter(t => t.id !== id)
      qc.setQueryData<Tent[]>(['tents'], next)
      qc.setQueryData(['stats'], computeStats(next))
      return { prev }
    },
    onSuccess: () => {
      // Nada extra que hacer - ya se actualizó en onMutate
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData<Tent[]>(['tents'], ctx.prev)
        qc.setQueryData(['stats'], computeStats(ctx.prev))
      }
    },
  })
}

export function useStats() {
  // Podés mantenerlo si el backend calcula cosas más pesadas, pero
  // con los optimistic updates ya lo estamos refrescando igual.
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => j<{ total: number; good: number; needsRepair: number; missingItems: number }>(`${API}/stats`),
    staleTime: 30_000
  })
}