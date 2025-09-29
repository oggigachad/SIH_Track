// Accessibility and touch interaction utilities

// ARIA label generators
export const ariaLabels = {
  button: (action: string, context?: string) => 
    context ? `${action} for ${context}` : action,
  
  input: (label: string, required: boolean = false, description?: string) => {
    let ariaLabel = label
    if (required) ariaLabel += ' (required)'
    if (description) ariaLabel += `. ${description}`
    return ariaLabel
  },
  
  status: (status: string, details?: string) =>
    details ? `Status: ${status}. ${details}` : `Status: ${status}`,
    
  notification: (type: string, title: string, message: string) =>
    `${type} notification: ${title}. ${message}`,
    
  progress: (current: number, total: number, label?: string) =>
    `${label || 'Progress'}: ${current} of ${total}`,
    
  table: (rows: number, columns: number, caption?: string) =>
    `${caption ? caption + '. ' : ''}Table with ${rows} rows and ${columns} columns`
}

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = []
  
  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()
    
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }
  
  static pushFocus(element: HTMLElement) {
    if (document.activeElement instanceof HTMLElement) {
      this.focusStack.push(document.activeElement)
    }
    element.focus()
  }
  
  static popFocus() {
    const previousElement = this.focusStack.pop()
    if (previousElement) {
      previousElement.focus()
    }
  }
  
  static moveFocus(direction: 'next' | 'previous' | 'first' | 'last', container?: HTMLElement) {
    const root = container || document
    const focusableElements = Array.from(root.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[]
    
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    
    let nextIndex: number
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % focusableElements.length
        break
      case 'previous':
        nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
        break
      case 'first':
        nextIndex = 0
        break
      case 'last':
        nextIndex = focusableElements.length - 1
        break
    }
    
    focusableElements[nextIndex]?.focus()
  }
}

// Keyboard navigation handlers
export const keyboardHandlers = {
  // Arrow key navigation for grid/list components
  arrowNavigation: (e: KeyboardEvent, options: {
    items: HTMLElement[]
    columns?: number
    wrap?: boolean
    onActivate?: (element: HTMLElement) => void
  }) => {
    const { items, columns = 1, wrap = true, onActivate } = options
    const currentIndex = items.indexOf(e.target as HTMLElement)
    
    if (currentIndex === -1) return
    
    let nextIndex: number
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = currentIndex - columns
        if (nextIndex < 0 && wrap) {
          nextIndex = Math.floor((items.length - 1) / columns) * columns + (currentIndex % columns)
          if (nextIndex >= items.length) nextIndex -= columns
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = currentIndex + columns
        if (nextIndex >= items.length && wrap) {
          nextIndex = currentIndex % columns
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = wrap ? (currentIndex - 1 + items.length) % items.length : currentIndex - 1
        break
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = wrap ? (currentIndex + 1) % items.length : currentIndex + 1
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = items.length - 1
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onActivate?.(items[currentIndex])
        return
      default:
        return
    }
    
    if (nextIndex >= 0 && nextIndex < items.length) {
      items[nextIndex].focus()
    }
  },
  
  // Escape key handler
  escape: (callback: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      callback()
    }
  },
  
  // Tab trap for modals
  tabTrap: (container: HTMLElement) => FocusManager.trapFocus(container)
}

// Touch interaction utilities
export class TouchInteractionManager {
  private static vibrationSupported = 'vibrate' in navigator
  
  static enhanceButtonForTouch(button: HTMLElement, options: {
    minSize?: number
    hapticFeedback?: boolean
    pressAnimation?: boolean
  } = {}) {
    const { minSize = 44, hapticFeedback = true, pressAnimation = true } = options
    
    // Ensure minimum touch target size
    const rect = button.getBoundingClientRect()
    if (rect.width < minSize || rect.height < minSize) {
      const padding = Math.max(0, (minSize - Math.max(rect.width, rect.height)) / 2)
      button.style.padding = `${padding}px`
      button.style.minWidth = `${minSize}px`
      button.style.minHeight = `${minSize}px`
    }
    
    // Add touch feedback
    button.addEventListener('touchstart', (e) => {
      if (hapticFeedback && this.vibrationSupported) {
        navigator.vibrate(10) // Short haptic feedback
      }
      
      if (pressAnimation) {
        button.style.transform = 'scale(0.95)'
        button.style.transition = 'transform 0.1s ease'
      }
    })
    
    button.addEventListener('touchend', () => {
      if (pressAnimation) {
        button.style.transform = 'scale(1)'
      }
    })
    
    button.addEventListener('touchcancel', () => {
      if (pressAnimation) {
        button.style.transform = 'scale(1)'
      }
    })
  }
  
  static addSwipeGesture(element: HTMLElement, options: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    threshold?: number
  }) {
    const { threshold = 50 } = options
    let startX = 0
    let startY = 0
    let startTime = 0
    
    element.addEventListener('touchstart', (e) => {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    })
    
    element.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 0) return
      
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()
      
      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime
      
      // Only consider it a swipe if it's fast enough
      if (deltaTime > 500) return
      
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)
      
      if (absDeltaX > threshold && absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          options.onSwipeRight?.()
        } else {
          options.onSwipeLeft?.()
        }
      } else if (absDeltaY > threshold && absDeltaY > absDeltaX) {
        // Vertical swipe
        if (deltaY > 0) {
          options.onSwipeDown?.()
        } else {
          options.onSwipeUp?.()
        }
      }
    })
  }
  
  static optimizeForMobile(element: HTMLElement) {
    // Prevent 300ms tap delay
    element.style.touchAction = 'manipulation'
    
    // Improve scrolling performance
    if (element.scrollHeight > element.clientHeight) {
      element.style.webkitOverflowScrolling = 'touch'
      element.style.overflowScrolling = 'touch'
    }
    
    // Enhance form inputs for mobile
    const inputs = element.querySelectorAll('input, textarea, select')
    inputs.forEach((input) => {
      if (input instanceof HTMLElement) {
        input.style.fontSize = '16px' // Prevent zoom on iOS
      }
    })
  }
}

// Screen reader utilities
export const screenReader = {
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    document.body.appendChild(announcement)
    announcement.textContent = message
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  hide: (element: HTMLElement) => {
    element.setAttribute('aria-hidden', 'true')
  },
  
  show: (element: HTMLElement) => {
    element.removeAttribute('aria-hidden')
  },
  
  describedBy: (element: HTMLElement, descriptionId: string) => {
    element.setAttribute('aria-describedby', descriptionId)
  }
}

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  relativeLuminance: (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  },
  
  // Calculate contrast ratio between two colors
  contrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const l1 = this.relativeLuminance(color1)
    const l2 = this.relativeLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  },
  
  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: [number, number, number], color2: [number, number, number], level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = this.contrastRatio(color1, color2)
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7
  },
  
  // Parse hex color to RGB
  hexToRgb: (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null
  }
}

// High contrast mode detection
export const highContrastMode = {
  isEnabled: (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(-ms-high-contrast: active)').matches
  },
  
  onChange: (callback: (enabled: boolean) => void) => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    const handler = (e: MediaQueryListEvent) => callback(e.matches)
    
    mediaQuery.addListener?.(handler) || mediaQuery.addEventListener('change', handler)
    
    return () => {
      mediaQuery.removeListener?.(handler) || mediaQuery.removeEventListener('change', handler)
    }
  }
}

// Reduced motion detection
export const reducedMotion = {
  isEnabled: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  onChange: (callback: (enabled: boolean) => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => callback(e.matches)
    
    mediaQuery.addListener?.(handler) || mediaQuery.addEventListener('change', handler)
    
    return () => {
      mediaQuery.removeListener?.(handler) || mediaQuery.removeEventListener('change', handler)
    }
  }
}