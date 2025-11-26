import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient, TentStatus } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())

// Mapeo: UI usa "needs-repair"/"missing-items" y DB usa "needs_repair"/"missing_items"
const toDbStatus = (s: string): TentStatus => {
  if (s === 'needs-repair') return 'needs_repair'
  if (s === 'missing-items') return 'missing_items'
  return 'good'
}
const toUiStatus = (s: TentStatus): string => {
  if (s === 'needs_repair') return 'needs-repair'
  if (s === 'missing_items') return 'missing-items'
  return 'good'
}

// LIST
app.get('/tents', async (_req, res) => {
  const rows = await prisma.tent.findMany({ orderBy: { createdAt: 'desc' } })
  const tents = rows.map(r => ({
    ...r,
    status: toUiStatus(r.status),
    lastInspected: r.lastInspected.toISOString().split('T')[0],
    missingItems: JSON.parse(r.missingItems),
    damagedItems: JSON.parse(r.damagedItems),
  }))
  res.json(tents)
})

// CREATE
app.post('/tents', async (req, res) => {
  const b = req.body
  const created = await prisma.tent.create({
    data: {
      name: b.name,
      model: b.model,
      capacity: Number(b.capacity),
      status: toDbStatus(b.status),
      condition: b.condition ?? '',
      lastInspected: new Date(b.lastInspected),
      missingItems: JSON.stringify(b.missingItems ?? []),
      damagedItems: JSON.stringify(b.damagedItems ?? []),
      location: b.location ?? ''
    }
  })
  res.status(201).json({
    ...created,
    status: toUiStatus(created.status),
    missingItems: JSON.parse(created.missingItems),
    damagedItems: JSON.parse(created.damagedItems),
  })
})

// UPDATE
app.patch('/tents/:id', async (req, res) => {
  const { id } = req.params
  const b = req.body
  const updated = await prisma.tent.update({
    where: { id },
    data: {
      name: b.name,
      model: b.model,
      capacity: Number(b.capacity),
      status: toDbStatus(b.status),
      condition: b.condition,
      lastInspected: new Date(b.lastInspected),
      missingItems: JSON.stringify(b.missingItems),
      damagedItems: JSON.stringify(b.damagedItems),
      location: b.location
    }
  })
  res.json({
    ...updated,
    status: toUiStatus(updated.status),
    missingItems: JSON.parse(updated.missingItems),
    damagedItems: JSON.parse(updated.damagedItems),
  })
})

// DELETE
app.delete('/tents/:id', async (req, res) => {
  const { id } = req.params
  await prisma.tent.delete({ where: { id } })
  res.status(204).end()
})

// STATS para tu dashboard
app.get('/stats', async (_req, res) => {
  const [total, good, needsRepair, missingItems] = await Promise.all([
    prisma.tent.count(),
    prisma.tent.count({ where: { status: 'good' } }),
    prisma.tent.count({ where: { status: 'needs_repair' } }),
    prisma.tent.count({ where: { status: 'missing_items' } })
  ])
  res.json({ total, good, needsRepair, missingItems })
})

const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
