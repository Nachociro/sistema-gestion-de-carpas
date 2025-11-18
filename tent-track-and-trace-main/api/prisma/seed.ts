import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.tent.createMany({
    data: [
      {
        name: 'Carpa Coleman Domo',
        model: 'Sundome 4-Personas',
        capacity: 4,
        status: 'good',
        condition: 'Excelente condición, todos los componentes presentes',
        lastInspected: new Date('2024-06-15'),
        missingItems: [],
        damagedItems: [],
        location: 'Almacén A-1'
      },
      {
        name: 'REI Base Camp',
        model: 'Base Camp 6',
        capacity: 6,
        status: 'needs_repair',
        condition: 'La cremallera de la puerta principal necesita reemplazo',
        lastInspected: new Date('2024-06-10'),
        missingItems: ['Bolsa para sobretecho'],
        damagedItems: ['Cremallera puerta principal'],
        location: 'Almacén A-2'
      },
      {
        name: 'Big Agnes Copper',
        model: 'Copper Spur 2',
        capacity: 2,
        status: 'missing_items',
        condition: 'Buena condición general',
        lastInspected: new Date('2024-06-12'),
        missingItems: ['Estacas para carpa (4)', 'Juego de vientos'],
        damagedItems: [],
        location: 'Almacén B-1'
      }
    ]
  })
}
main().finally(() => prisma.$disconnect())
