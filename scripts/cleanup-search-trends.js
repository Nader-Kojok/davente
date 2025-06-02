const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupSearchTrends() {
  console.log('Starting search trends cleanup...');

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Reset daily counters for searches older than 1 day
    const resetDailyResult = await prisma.searchTrend.updateMany({
      where: {
        lastSearched: { lt: oneDayAgo },
        dailyCount: { gt: 0 },
      },
      data: { dailyCount: 0 },
    });
    console.log(`✅ Reset daily counters for ${resetDailyResult.count} searches`);

    // Reset weekly counters for searches older than 1 week
    const resetWeeklyResult = await prisma.searchTrend.updateMany({
      where: {
        lastSearched: { lt: oneWeekAgo },
        weeklyCount: { gt: 0 },
      },
      data: { weeklyCount: 0 },
    });
    console.log(`✅ Reset weekly counters for ${resetWeeklyResult.count} searches`);

    // Delete old searches with low counts
    const deleteResult = await prisma.searchTrend.deleteMany({
      where: {
        AND: [
          { lastSearched: { lt: thirtyDaysAgo } },
          { searchCount: { lt: 3 } },
        ],
      },
    });
    console.log(`✅ Deleted ${deleteResult.count} old low-count searches`);

    // Get current statistics
    const totalSearches = await prisma.searchTrend.count();
    const activeSearches = await prisma.searchTrend.count({
      where: {
        lastSearched: { gte: oneWeekAgo },
      },
    });

    console.log(`📊 Total searches: ${totalSearches}`);
    console.log(`📊 Active searches (last week): ${activeSearches}`);
    console.log('✅ Search trends cleanup completed!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    await cleanupSearchTrends();
  } catch (error) {
    console.error('Error in cleanup script:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run cleanup if script is executed directly
if (require.main === module) {
  main();
}

module.exports = { cleanupSearchTrends }; 