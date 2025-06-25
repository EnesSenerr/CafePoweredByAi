import { cacheService, CACHE_KEYS } from '../services/cacheService';

// Cache invalidation utilities
export class CacheInvalidator {
  // Invalidate cache after mutations
  static async invalidateAfterProfileUpdate(): Promise<void> {
    await cacheService.invalidate(CACHE_KEYS.USER_PROFILE);
    console.log('Profile cache invalidated');
  }

  static async invalidateAfterOrderCreate(): Promise<void> {
    await Promise.all([
      cacheService.invalidate(CACHE_KEYS.ORDERS),
      cacheService.invalidate(CACHE_KEYS.STATISTICS),
      cacheService.invalidate(CACHE_KEYS.USER_PROFILE), // Points might change
    ]);
    console.log('Order-related cache invalidated');
  }

  static async invalidateAfterFavoriteUpdate(): Promise<void> {
    await cacheService.invalidate(CACHE_KEYS.FAVORITES);
    console.log('Favorites cache invalidated');
  }

  static async invalidateAfterMenuUpdate(): Promise<void> {
    await cacheService.invalidate(CACHE_KEYS.MENU_ITEMS);
    console.log('Menu cache invalidated');
  }

  static async invalidateAfterRewardRedeem(): Promise<void> {
    await Promise.all([
      cacheService.invalidate(CACHE_KEYS.REWARDS),
      cacheService.invalidate(CACHE_KEYS.USER_PROFILE), // Points change
      cacheService.invalidate(CACHE_KEYS.TRANSACTIONS),
    ]);
    console.log('Reward-related cache invalidated');
  }

  static async invalidateAfterPointsEarn(): Promise<void> {
    await Promise.all([
      cacheService.invalidate(CACHE_KEYS.USER_PROFILE),
      cacheService.invalidate(CACHE_KEYS.TRANSACTIONS),
    ]);
    console.log('Points-related cache invalidated');
  }

  // Full cache refresh scenarios
  static async invalidateAllUserData(): Promise<void> {
    await Promise.all([
      cacheService.invalidate(CACHE_KEYS.USER_PROFILE),
      cacheService.invalidate(CACHE_KEYS.FAVORITES),
      cacheService.invalidate(CACHE_KEYS.ORDERS),
      cacheService.invalidate(CACHE_KEYS.TRANSACTIONS),
      cacheService.invalidate(CACHE_KEYS.NOTIFICATIONS),
    ]);
    console.log('All user data cache invalidated');
  }

  static async invalidateAllAdminData(): Promise<void> {
    await Promise.all([
      cacheService.invalidate(CACHE_KEYS.STATISTICS),
      cacheService.invalidate(CACHE_KEYS.USERS),
      cacheService.invalidate(CACHE_KEYS.ORDERS),
    ]);
    console.log('All admin data cache invalidated');
  }

  // Scheduled cleanup
  static async performScheduledCleanup(): Promise<void> {
    try {
      await cacheService.cleanup();
      console.log('Scheduled cache cleanup completed');
    } catch (error) {
      console.error('Scheduled cache cleanup failed:', error);
    }
  }
}

// Background cache management
export class BackgroundCacheManager {
  private static cleanupInterval: NodeJS.Timeout | null = null;
  private static preloadTimeout: NodeJS.Timeout | null = null;

  // Start background cache management
  static start(): void {
    // Cleanup every 30 minutes
    this.cleanupInterval = setInterval(() => {
      CacheInvalidator.performScheduledCleanup();
    }, 30 * 60 * 1000);

    // Preload critical data after 2 seconds
    this.preloadTimeout = setTimeout(() => {
      this.preloadCriticalData();
    }, 2000);

    console.log('Background cache management started');
  }

  // Stop background cache management
  static stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.preloadTimeout) {
      clearTimeout(this.preloadTimeout);
      this.preloadTimeout = null;
    }

    console.log('Background cache management stopped');
  }

  // Preload critical data
  private static async preloadCriticalData(): Promise<void> {
    try {
      // Preload menu items (most commonly accessed)
      const { getMenuItems } = await import('../services/api');
      await getMenuItems();
      
      // Preload rewards
      const { getRewards } = await import('../services/api');
      await getRewards();
      
      console.log('Critical data preloaded successfully');
    } catch (error) {
      console.log('Critical data preload failed (normal if offline):', error);
    }
  }

  // Emergency cache clear
  static async emergencyClear(): Promise<void> {
    try {
      await cacheService.clearAll();
      console.log('Emergency cache clear completed');
    } catch (error) {
      console.error('Emergency cache clear failed:', error);
    }
  }

  // Cache health check
  static async healthCheck(): Promise<{
    isHealthy: boolean;
    stats: any;
    recommendations: string[];
  }> {
    try {
      const stats = await cacheService.getStats();
      const recommendations: string[] = [];
      let isHealthy = true;

      // Check memory usage
      if (stats.memorySize > 50) {
        recommendations.push('Memory cache size is high, consider cleanup');
        isHealthy = false;
      }

      // Check persistent storage
      if (stats.persistentSize > 100) {
        recommendations.push('Persistent cache size is high, consider cleanup');
        isHealthy = false;
      }

      return {
        isHealthy,
        stats,
        recommendations,
      };
    } catch (error) {
      console.error('Cache health check failed:', error);
      return {
        isHealthy: false,
        stats: null,
        recommendations: ['Cache health check failed'],
      };
    }
  }
}

export default {
  CacheInvalidator,
  BackgroundCacheManager,
}; 