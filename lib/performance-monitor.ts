// Performance Monitor and Optimization Utilities

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  type: 'render' | 'api' | 'user-interaction' | 'navigation'
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []
  private isMonitoring = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  private initializeMonitoring() {
    // Monitor Long Tasks (tasks that block the main thread for > 50ms)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`, entry)
              this.logMetric('long-task', entry.duration, 'render')
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)
      } catch (e) {
        console.warn('Long task monitoring not supported')
      }

      // Monitor Layout Shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.value > 0.1) {
              console.warn(`Significant layout shift: ${entry.value}`, entry)
              this.logMetric('layout-shift', entry.value, 'render')
            }
          })
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(layoutShiftObserver)
      } catch (e) {
        console.warn('Layout shift monitoring not supported')
      }

      // Monitor First Contentful Paint, Largest Contentful Paint
      try {
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.logMetric(entry.name, entry.startTime, 'render')
          })
        })
        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
        this.observers.push(paintObserver)
      } catch (e) {
        console.warn('Paint monitoring not supported')
      }
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected', memory)
        }
      }, 30000) // Check every 30 seconds
    }

    this.isMonitoring = true
  }

  logMetric(name: string, duration: number, type: PerformanceMetric['type']) {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      type
    })

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  // Measure function execution time
  measure<T>(name: string, fn: () => T, type: PerformanceMetric['type'] = 'user-interaction'): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start
      this.logMetric(name, duration, type)
      
      if (duration > 100) {
        console.warn(`Slow ${type}: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.logMetric(`${name}-error`, duration, type)
      throw error
    }
  }

  // Measure async function execution time
  async measureAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    type: PerformanceMetric['type'] = 'api'
  ): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.logMetric(name, duration, type)
      
      if (duration > 1000) {
        console.warn(`Slow ${type}: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.logMetric(`${name}-error`, duration, type)
      throw error
    }
  }

  // Get performance summary
  getSummary() {
    const now = Date.now()
    const recent = this.metrics.filter(m => now - m.timestamp < 60000) // Last minute

    return {
      total: this.metrics.length,
      recent: recent.length,
      averageDuration: recent.reduce((sum, m) => sum + m.duration, 0) / recent.length || 0,
      slowestRecent: recent.reduce((max, m) => m.duration > max.duration ? m : max, recent[0]),
      byType: recent.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.isMonitoring = false
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Debounce function to prevent excessive function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle function to limit function execution frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utility for components
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn)
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  )
}

// Memory usage checker
export function checkMemoryUsage(): { isHigh: boolean; usage?: any } {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return { isHigh: false }
  }

  const memory = (performance as any).memory
  const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
  
  return {
    isHigh: usageRatio > 0.85,
    usage: {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      ratio: Math.round(usageRatio * 100) // Percentage
    }
  }
}

// Request idle callback wrapper
export function runWhenIdle(callback: () => void, timeout: number = 5000): void {
  if (typeof window === 'undefined') {
    return
  }

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 0)
  }
}

// Preload critical resources
export function preloadResource(url: string, type: 'script' | 'style' | 'font' | 'image') {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  
  switch (type) {
    case 'script':
      link.as = 'script'
      break
    case 'style':
      link.as = 'style'
      break
    case 'font':
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      break
    case 'image':
      link.as = 'image'
      break
  }
  
  document.head.appendChild(link)
}

// Critical CSS inlining utility
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  React.useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      const summary = performanceMonitor.getSummary()
      if (summary.slowestRecent?.duration > 1000) {
        console.warn('Component had slow operations:', summary)
      }
    }
  }, [])

  return {
    measure: performanceMonitor.measure.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    getSummary: performanceMonitor.getSummary.bind(performanceMonitor)
  }
}

// Add React import
import React from 'react'

export default performanceMonitor