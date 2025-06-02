const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    await prisma.$connect();
    
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        Subcategory: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    console.log('📊 Database Categories Analysis:');
    console.log('Total categories:', categories.length);
    console.log('\n📂 Categories in database:');
    
    categories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug}) - ${cat.Subcategory.length} subcategories`);
      cat.Subcategory.forEach(sub => {
        console.log(`  └─ ${sub.name} (slug: ${sub.slug})`);
      });
    });
    
    const totalSubcategories = await prisma.subcategory.count();
    console.log(`\n📈 Total subcategories: ${totalSubcategories}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories(); 