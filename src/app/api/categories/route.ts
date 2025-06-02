import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        Subcategory: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Transform database data to match API format
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      sortOrder: category.sortOrder,
      subcategories: category.Subcategory.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        sortOrder: sub.sortOrder
      }))
    }))

    return NextResponse.json(transformedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 