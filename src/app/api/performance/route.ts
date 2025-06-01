import { NextResponse } from 'next/server';
import { QueryPerformanceMonitor, QueryCache } from '@/lib/performance';

export async function GET() {
  try {
    const monitor = QueryPerformanceMonitor.getInstance();
    
    const performanceStats = {
      queryStats: monitor.getAllStats(),
      cacheStats: QueryCache.getStats(),
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(monitor.getAllStats())
    };

    return NextResponse.json(performanceStats);
  } catch (error) {
    console.error('Error fetching performance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance stats' },
      { status: 500 }
    );
  }
}

function generateRecommendations(stats: Record<string, any>): string[] {
  const recommendations: string[] = [];

  Object.entries(stats).forEach(([queryName, stat]) => {
    if (!stat) return;

    if (stat.avg > 1000) {
      recommendations.push(`⚠️ ${queryName} is slow (avg: ${stat.avg}ms) - consider adding indexes`);
    }

    if (stat.p95 > 2000) {
      recommendations.push(`🚨 ${queryName} has high P95 latency (${stat.p95}ms) - needs optimization`);
    }

    if (stat.count > 100 && stat.avg > 500) {
      recommendations.push(`📈 ${queryName} is frequently called and slow - consider caching`);
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('✅ All queries are performing well!');
  }

  return recommendations;
}

// Clear cache endpoint
export async function DELETE() {
  try {
    QueryCache.clear();
    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 