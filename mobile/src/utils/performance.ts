import React from 'react';
import { InteractionManager, Platform } from 'react-native';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTimes: Map<string, number> = new Map();
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing a specific operation
  startTiming(operation: string): void {
    this.startTimes.set(operation, Date.now());
  }

  // End timing and record the result
  endTiming(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) {
      console.warn(`No start time found for operation: ${operation}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.startTimes.delete(operation);

    // Record the metric
    const existing = this.metrics.get(operation) || [];
    existing.push(duration);
    this.metrics.set(operation, existing);

    console.log(`Performance: ${operation} took ${duration}ms`);
    return duration;
  }

  // Get average time for an operation
  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, { average: number; count: number; min: number; max: number }> {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((times, operation) => {
      result[operation] = {
        average: this.getAverageTime(operation),
        count: times.length,
        min: Math.min(...times),
        max: Math.max(...times),
      };
    });
    
    return result;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Memory management utilities
export class MemoryManager {
  private static cleanupTasks: (() => void)[] = [];

  // Register cleanup task
  static registerCleanup(task: () => void): void {
    this.cleanupTasks.push(task);
  }

  // Execute all cleanup tasks
  static cleanup(): void {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    });
    this.cleanupTasks = [];
  }

  // Memory usage monitoring (iOS only)
  static getMemoryUsage(): Promise<number> {
    if (Platform.OS === 'ios') {
      // On iOS, we can get memory info
      return Promise.resolve(0); // Placeholder
    }
    return Promise.resolve(0);
  }
}

// Image optimization utilities
export class ImageOptimizer {
  // Optimize image loading with caching
  static getOptimizedImageUri(uri: string, width?: number, height?: number): string {
    if (!uri) return '';
    
    // For local images, return as-is
    if (uri.startsWith('file://') || !uri.startsWith('http')) {
      return uri;
    }

    // For remote images, add optimization parameters if supported
    const url = new URL(uri);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('f', 'webp'); // Request WebP format
    url.searchParams.set('q', '80'); // Quality 80%
    
    return url.toString();
  }

  // Get responsive image size based on screen density
  static getResponsiveSize(baseSize: number): number {
    const { PixelRatio } = require('react-native');
    const density = PixelRatio.get();
    
    if (density >= 3) return baseSize * 2; // High density
    if (density >= 2) return baseSize * 1.5; // Medium density
    return baseSize; // Low density
  }
}

// Bundle optimization utilities
export class BundleOptimizer {
  // Lazy load component
  static lazyLoad<T>(importFn: () => Promise<{ default: T }>): () => Promise<T> {
    let component: T | null = null;
    
    return async (): Promise<T> => {
      if (!component) {
        const module = await importFn();
        component = module.default;
      }
      return component;
    };
  }

  // Defer non-critical code execution
  static deferExecution(fn: () => void, delay: number = 0): void {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(fn, delay);
    });
  }

  // Preload critical resources
  static preloadCriticalResources(): void {
    // Preload critical images, fonts, etc.
    console.log('Preloading critical resources...');
  }
}

// Performance decorator for functions
export function performanceTrack(operationName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      monitor.startTiming(operationName);
      
      const result = originalMethod.apply(this, args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          monitor.endTiming(operationName);
        });
      } else {
        monitor.endTiming(operationName);
        return result;
      }
    };
    
    return descriptor;
  };
}

// Network optimization utilities
export class NetworkOptimizer {
  private static requestCache = new Map<string, any>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache network requests
  static async cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttl: number = this.CACHE_TTL
  ): Promise<T> {
    const cached = this.requestCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log(`Cache hit for: ${key}`);
      return cached.data;
    }

    console.log(`Cache miss for: ${key}`);
    const data = await requestFn();
    
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
    });
    
    return data;
  }

  // Clear expired cache entries
  static clearExpiredCache(): void {
    const now = Date.now();
    
    for (const [key, value] of this.requestCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.requestCache.delete(key);
      }
    }
  }

  // Get cache stats
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.requestCache.size,
      keys: Array.from(this.requestCache.keys()),
    };
  }
}

// Performance hooks
export const usePerformanceTracking = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  React.useEffect(() => {
    monitor.startTiming(`${componentName}_mount`);
    
    return () => {
      monitor.endTiming(`${componentName}_mount`);
    };
  }, [componentName, monitor]);

  const trackAction = (actionName: string, action: () => void | Promise<void>) => {
    const fullActionName = `${componentName}_${actionName}`;
    monitor.startTiming(fullActionName);
    
    const result = action();
    
    if (result instanceof Promise) {
      result.finally(() => monitor.endTiming(fullActionName));
    } else {
      monitor.endTiming(fullActionName);
    }
    
    return result;
  };

  return { trackAction };
};

// Export all utilities
export default {
  PerformanceMonitor,
  MemoryManager,
  ImageOptimizer,
  BundleOptimizer,
  NetworkOptimizer,
  performanceTrack,
  usePerformanceTracking,
}; 