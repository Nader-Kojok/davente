import { prisma } from '@/lib/prisma';

export interface TrendingSearchData {
  query: string;
  count: number;
  dailyCount: number;
  weeklyCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastSearched: Date;
}

export interface TrendingCategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  href: string;
  searchCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const TREND_THRESHOLD_UP = 15; // 15% increase is considered "up"
const TREND_THRESHOLD_DOWN = -10; // 10% decrease is considered "down"

/**
 * Track a search query in the database
 */
export async function trackSearch(query: string): Promise<void> {
  if (!query || query.trim().length < 2) return;
  
  const normalizedQuery = query.trim().toLowerCase();
  
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Upsert search trend record
    await prisma.searchTrend.upsert({
      where: { query: normalizedQuery },
      update: {
        searchCount: { increment: 1 },
        dailyCount: { increment: 1 },
        weeklyCount: { increment: 1 },
        lastSearched: now,
      },
      create: {
        query: normalizedQuery,
        searchCount: 1,
        dailyCount: 1,
        weeklyCount: 1,
        lastSearched: now,
      },
    });
    
    // Reset daily/weekly counters periodically (cleanup job)
    await resetOldCounters();
    
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}

/**
 * Get trending searches from database with calculated trends
 */
export async function getTrendingSearches(limit: number = 10): Promise<TrendingSearchData[]> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
    // Get top searches from the last 30 days, ordered by total count
    const searchTrends = await prisma.searchTrend.findMany({
      where: {
        lastSearched: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: [
        { searchCount: 'desc' },
        { lastSearched: 'desc' }
      ],
      take: limit * 2, // Get more to calculate trends
    });
    
    // Calculate trends by comparing recent activity
    const trendsWithCalculations = await Promise.all(
      searchTrends.map(async (trend) => {
        // Get historical data for trend calculation
        const yesterdayCount = await getSearchCountForPeriod(
          trend.query,
          twoDaysAgo,
          oneDayAgo
        );
        
        const todayCount = await getSearchCountForPeriod(
          trend.query,
          oneDayAgo,
          new Date()
        );
        
        // Calculate trend percentage
        let trendPercentage = 0;
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        
        if (yesterdayCount > 0) {
          const change = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
          trendPercentage = Math.abs(change);
          
          if (change >= TREND_THRESHOLD_UP) {
            trendDirection = 'up';
          } else if (change <= TREND_THRESHOLD_DOWN) {
            trendDirection = 'down';
          }
        } else if (todayCount > 0) {
          // New trending search
          trendDirection = 'up';
          trendPercentage = 100;
        }
        
        return {
          query: trend.query,
          count: trend.searchCount,
          dailyCount: trend.dailyCount,
          weeklyCount: trend.weeklyCount,
          trend: trendDirection,
          trendPercentage: Math.round(trendPercentage),
          lastSearched: trend.lastSearched,
        } as TrendingSearchData;
      })
    );
    
    // Sort by combination of count and recent activity
    return trendsWithCalculations
      .sort((a, b) => {
        // Prioritize recent activity and high counts
        const aScore = a.count + (a.dailyCount * 2);
        const bScore = b.count + (b.dailyCount * 2);
        return bScore - aScore;
      })
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error fetching trending searches:', error);
    return [];
  }
}

/**
 * Get trending categories based on search patterns
 */
export async function getTrendingCategories(limit: number = 6): Promise<TrendingCategoryData[]> {
  try {
    // Get categories from database
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: {
          select: {
            Annonce: {
              where: {
                status: 'active',
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
                },
              },
            },
          },
        },
      },
      orderBy: {
        Annonce: {
          _count: 'desc',
        },
      },
      take: limit,
    });
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    
    // Calculate trends based on listing activity
    const categoriesWithTrends = await Promise.all(
      categories.map(async (category) => {
        const thisWeekCount = await prisma.annonce.count({
          where: {
            categoryId: category.id,
            status: 'active',
            createdAt: { gte: oneWeekAgo },
          },
        });
        
        const lastWeekCount = await prisma.annonce.count({
          where: {
            categoryId: category.id,
            status: 'active',
            createdAt: {
              gte: twoWeeksAgo,
              lt: oneWeekAgo,
            },
          },
        });
        
        // Calculate trend
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        let trendPercentage = 0;
        
        if (lastWeekCount > 0) {
          const change = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
          trendPercentage = Math.abs(change);
          
          if (change >= TREND_THRESHOLD_UP) {
            trendDirection = 'up';
          } else if (change <= TREND_THRESHOLD_DOWN) {
            trendDirection = 'down';
          }
        } else if (thisWeekCount > 0) {
          trendDirection = 'up';
          trendPercentage = 100;
        }
        
        return {
          id: category.id.toString(),
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          href: `/categories/${category.slug}`,
          searchCount: category._count.Annonce,
          trend: trendDirection,
          trendPercentage: Math.round(trendPercentage),
        } as TrendingCategoryData;
      })
    );
    
    return categoriesWithTrends;
    
  } catch (error) {
    console.error('Error fetching trending categories:', error);
    return [];
  }
}

/**
 * Reset daily and weekly counters for old records
 */
async function resetOldCounters(): Promise<void> {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Reset daily counters for searches older than 1 day
    await prisma.searchTrend.updateMany({
      where: {
        lastSearched: { lt: oneDayAgo },
        dailyCount: { gt: 0 },
      },
      data: { dailyCount: 0 },
    });
    
    // Reset weekly counters for searches older than 1 week
    await prisma.searchTrend.updateMany({
      where: {
        lastSearched: { lt: oneWeekAgo },
        weeklyCount: { gt: 0 },
      },
      data: { weeklyCount: 0 },
    });
    
  } catch (error) {
    console.error('Error resetting counters:', error);
  }
}

/**
 * Get search count for a specific time period
 */
async function getSearchCountForPeriod(
  query: string, 
  startDate: Date, 
  endDate: Date
): Promise<number> {
  try {
    // This is a simplified calculation
    // In a production environment, you might want to store daily snapshots
    const trend = await prisma.searchTrend.findUnique({
      where: { query },
      select: { dailyCount: true, lastSearched: true },
    });
    
    if (!trend) return 0;
    
    // If the last search was within the period, return daily count
    if (trend.lastSearched >= startDate && trend.lastSearched <= endDate) {
      return trend.dailyCount;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting search count for period:', error);
    return 0;
  }
}

/**
 * Clean up old search trends (optional cleanup function)
 */
export async function cleanupOldTrends(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Delete search trends that haven't been searched in 30 days and have low counts
    await prisma.searchTrend.deleteMany({
      where: {
        AND: [
          { lastSearched: { lt: thirtyDaysAgo } },
          { searchCount: { lt: 3 } }, // Keep only searches with 3+ occurrences
        ],
      },
    });
    
  } catch (error) {
    console.error('Error cleaning up old trends:', error);
  }
} 