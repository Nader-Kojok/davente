import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`📊 Found ${userCount} users in database`)
    
    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@') : 'Not set'
      }
    }
  } finally {
    await prisma.$disconnect()
  }
} 