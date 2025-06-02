const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSearchTrends() {
  console.log('Seeding search trends...');

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const searchTrends = [
    {
      query: 'iphone',
      searchCount: 120,
      dailyCount: 35,
      weeklyCount: 80,
      lastSearched: oneDayAgo,
    },
    {
      query: 'samsung galaxy',
      searchCount: 95,
      dailyCount: 28,
      weeklyCount: 65,
      lastSearched: now,
    },
    {
      query: 'voiture',
      searchCount: 150,
      dailyCount: 45,
      weeklyCount: 100,
      lastSearched: oneDayAgo,
    },
    {
      query: 'appartement',
      searchCount: 200,
      dailyCount: 60,
      weeklyCount: 140,
      lastSearched: now,
    },
    {
      query: 'macbook',
      searchCount: 80,
      dailyCount: 25,
      weeklyCount: 55,
      lastSearched: twoDaysAgo,
    },
    {
      query: 'playstation',
      searchCount: 110,
      dailyCount: 32,
      weeklyCount: 75,
      lastSearched: oneDayAgo,
    },
    {
      query: 'meuble',
      searchCount: 65,
      dailyCount: 18,
      weeklyCount: 45,
      lastSearched: oneWeekAgo,
    },
    {
      query: 'ordinateur',
      searchCount: 90,
      dailyCount: 25,
      weeklyCount: 60,
      lastSearched: now,
    },
    {
      query: 'moto',
      searchCount: 75,
      dailyCount: 20,
      weeklyCount: 50,
      lastSearched: oneDayAgo,
    },
    {
      query: 'télévision',
      searchCount: 55,
      dailyCount: 15,
      weeklyCount: 35,
      lastSearched: twoDaysAgo,
    },
  ];

  for (const trend of searchTrends) {
    try {
      await prisma.searchTrend.upsert({
        where: { query: trend.query },
        update: trend,
        create: trend,
      });
      console.log(`✅ Seeded search trend: ${trend.query}`);
    } catch (error) {
      console.error(`❌ Error seeding ${trend.query}:`, error);
    }
  }

  console.log('✅ Search trends seeding completed!');
}

async function main() {
  try {
    await seedSearchTrends();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 