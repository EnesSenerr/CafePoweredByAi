import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  private static instance: CacheService;
  private memoryCache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Generate cache key
  private generateKey(prefix: string, params?: Record<string, any>): string {
    if (!params) return prefix;
    
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    
    return `${prefix}?${sortedParams}`;
  }

  // Memory cache operations
  setMemoryCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };
    
    this.memoryCache.set(key, cacheItem);
  }

  getMemoryCache<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Persistent cache operations
  async setPersistentCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };
      
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Failed to set persistent cache:', error);
    }
  }

  async getPersistentCache<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(`cache_${key}`);
      
      if (!item) return null;
      
      const cacheItem: CacheItem<T> = JSON.parse(item);
      
      if (Date.now() > cacheItem.expiresAt) {
        await this.removePersistentCache(key);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('Failed to get persistent cache:', error);
      return null;
    }
  }

  async removePersistentCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Failed to remove persistent cache:', error);
    }
  }

  // Hybrid cache (memory first, then persistent)
  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memoryResult = this.getMemoryCache<T>(key);
    if (memoryResult !== null) {
      return memoryResult;
    }
    
    // Fallback to persistent cache
    const persistentResult = await this.getPersistentCache<T>(key);
    if (persistentResult !== null) {
      // Store in memory for faster access
      this.setMemoryCache(key, persistentResult);
      return persistentResult;
    }
    
    return null;
  }

  async set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    // Store in both memory and persistent cache
    this.setMemoryCache(key, data, ttl);
    await this.setPersistentCache(key, data, ttl);
  }

  // Cached API request wrapper
  async cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL,
    params?: Record<string, any>
  ): Promise<T> {
    const cacheKey = this.generateKey(key, params);
    
    // Check cache first
    const cached = await this.get<T>(cacheKey);
    if (cached !== null) {
      console.log(`Cache hit for: ${cacheKey}`);
      return cached;
    }
    
    // Make request if not cached
    console.log(`Cache miss for: ${cacheKey}`);
    try {
      const data = await requestFn();
      await this.set(cacheKey, data, ttl);
      return data;
    } catch (error) {
      console.error(`Request failed for: ${cacheKey}`, error);
      throw error;
    }
  }

  // Cache invalidation
  async invalidate(keyPattern: string): Promise<void> {
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(keyPattern)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Clear from persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => 
        key.startsWith('cache_') && key.includes(keyPattern)
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Failed to invalidate persistent cache:', error);
    }
  }

  // Clear all cache
  async clearAll(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();
    
    // Clear persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('cache_'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }

  // Cache statistics
  async getStats(): Promise<{
    memorySize: number;
    persistentSize: number;
    memoryKeys: string[];
    persistentKeys: string[];
  }> {
    const memoryKeys = Array.from(this.memoryCache.keys());
    
    let persistentKeys: string[] = [];
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      persistentKeys = allKeys.filter(key => key.startsWith('cache_'));
    } catch (error) {
      console.error('Failed to get cache stats:', error);
    }
    
    return {
      memorySize: this.memoryCache.size,
      persistentSize: persistentKeys.length,
      memoryKeys,
      persistentKeys: persistentKeys.map(key => key.replace('cache_', '')),
    };
  }

  // Cleanup expired cache entries
  async cleanup(): Promise<void> {
    const now = Date.now();
    
    // Cleanup memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now > item.expiresAt) {
        this.memoryCache.delete(key);
      }
    }
    
    // Cleanup persistent cache
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('cache_'));
      
      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const cacheItem: CacheItem<any> = JSON.parse(item);
          if (now > cacheItem.expiresAt) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup persistent cache:', error);
    }
  }
}

// Singleton instance
export const cacheService = CacheService.getInstance();

// Cache keys constants
export const CACHE_KEYS = {
  MENU_ITEMS: 'menu_items',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'favorites',
  ORDERS: 'orders',
  REWARDS: 'rewards',
  TRANSACTIONS: 'transactions',
  NOTIFICATIONS: 'notifications',
  STATISTICS: 'statistics',
  USERS: 'users',
} as const;

export default cacheService; 