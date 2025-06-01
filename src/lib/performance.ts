// Performance monitoring utilities for database queries
export class QueryPerformanceMonitor {
  private static instance: QueryPerformanceMonitor;
  private queryTimes: Map<string, number[]> = new Map();

  static getInstance(): QueryPerformanceMonitor {
    if (!QueryPerformanceMonitor.instance) {
      QueryPerformanceMonitor.instance = new QueryPerformanceMonitor();
    }
    return QueryPerformanceMonitor.instance;
  }

  startTimer(queryName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.queryTimes.has(queryName)) {
        this.queryTimes.set(queryName, []);
      }
      
      const times = this.queryTimes.get(queryName)!;
      times.push(duration);
      
      // Keep only last 100 measurements
      if (times.length > 100) {
        times.shift();
      }
      
      // Log slow queries (> 1000ms)
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ Query ${queryName}: ${duration.toFixed(2)}ms`);
      }
    };
  }

  getStats(queryName: string) {
    const times = this.queryTimes.get(queryName) || [];
    if (times.length === 0) return null;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

    return {
      count: times.length,
      avg: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      p95: Math.round(p95 * 100) / 100
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [queryName] of this.queryTimes) {
      stats[queryName] = this.getStats(queryName);
    }
    return stats;
  }
}

// Helper function to wrap database queries with performance monitoring
export function withPerformanceMonitoring<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const monitor = QueryPerformanceMonitor.getInstance();
  const endTimer = monitor.startTimer(queryName);
  
  return queryFn().finally(() => {
    endTimer();
  });
}

// Cache utilities for frequently accessed data
export class QueryCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttlMs: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  static get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  static clear() {
    this.cache.clear();
  }

  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Database query optimization helpers
export const QueryOptimizations = {
  // Generate cache key for search queries
  generateSearchCacheKey(params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result: any, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `search:${JSON.stringify(sortedParams)}`;
  },

  // Check if query should be cached
  shouldCache(params: any): boolean {
    // Cache simple queries without text search
    return !params.query || params.query.trim().length === 0;
  },

  // Get optimal page size based on query complexity
  getOptimalPageSize(params: any): number {
    // Reduce page size for complex queries
    if (params.query && params.query.trim().length > 0) {
      return 15; // Smaller page for text search
    }
    
    if (params.minPrice || params.maxPrice) {
      return 18; // Medium page for price filtering
    }
    
    return 20; // Default page size
  }
}; 