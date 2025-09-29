import { z } from 'zod'

// Common validation schemas
export const qrCodeSchema = z.object({
  vendor: z.string()
    .min(3, 'Vendor ID must be at least 3 characters')
    .max(4, 'Vendor ID must be at most 4 characters')
    .regex(/^[A-Z]+$/, 'Vendor ID must contain only uppercase letters')
    .transform(val => val.toUpperCase()),
  fitting: z.string()
    .min(3, 'Fitting type must be at least 3 characters')
    .max(4, 'Fitting type must be at most 4 characters')
    .regex(/^[A-Z]+$/, 'Fitting type must contain only uppercase letters')
    .transform(val => val.toUpperCase()),
  serial: z.string()
    .length(10, 'Serial number must be exactly 10 digits')
    .regex(/^\d+$/, 'Serial number must contain only digits')
})

export const batchDataSchema = z.object({
  batchId: z.string()
    .min(1, 'Batch ID is required')
    .max(50, 'Batch ID must be at most 50 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Batch ID can only contain uppercase letters, numbers, and hyphens'),
  batchNumber: z.string()
    .min(1, 'Batch number is required')
    .max(50, 'Batch number must be at most 50 characters')
    .regex(/^[A-Z0-9\-]+$/, 'Batch number can only contain uppercase letters, numbers, and hyphens'),
  productName: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be at most 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'Product name contains invalid characters'),
  vendorId: z.string()
    .max(20, 'Vendor ID must be at most 20 characters')
    .regex(/^[A-Z0-9]*$/, 'Vendor ID can only contain uppercase letters and numbers')
    .optional(),
  manufacturingDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Manufacturing date must be in YYYY-MM-DD format')
    .optional(),
  quantity: z.string()
    .regex(/^\d+$/, 'Quantity must be a number')
    .transform(val => parseInt(val, 10))
    .optional()
})

export const userDataSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  role: z.enum(['vendor', 'depot', 'field', 'inspector', 'recycling', 'analytics']),
  id: z.string()
    .min(1, 'User ID is required')
    .max(20, 'User ID must be at most 20 characters')
    .regex(/^[A-Z0-9]+$/, 'User ID can only contain uppercase letters and numbers')
})

export const searchQuerySchema = z.object({
  query: z.string()
    .max(200, 'Search query must be at most 200 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]*$/, 'Search query contains invalid characters'),
  filters: z.record(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// Sanitization functions
export function sanitizeString(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  return sanitized
}

export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '')
  
  // Remove invalid file name characters
  sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '')
  
  // Limit length
  sanitized = sanitized.substring(0, 255)
  
  return sanitized
}

export function sanitizeQRData(data: string): string {
  // Limit QR data length for security
  if (data.length > 1000) {
    throw new Error('QR data is too long')
  }
  
  // Basic sanitization
  let sanitized = data.trim()
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  
  return sanitized
}

// IP address validation
export function isValidIPAddress(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Form validation hooks
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown) => {
      try {
        const result = schema.parse(data)
        return { success: true, data: result, errors: null }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            data: null,
            errors: error.errors.reduce((acc, err) => {
              const path = err.path.join('.')
              acc[path] = err.message
              return acc
            }, {} as Record<string, string>)
          }
        }
        return {
          success: false,
          data: null,
          errors: { general: 'Validation failed' }
        }
      }
    },
    
    validateField: (field: keyof T, value: unknown) => {
      try {
        const fieldSchema = schema.shape[field as string]
        if (fieldSchema) {
          fieldSchema.parse(value)
          return { success: true, error: null }
        }
        return { success: true, error: null }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.errors[0]?.message || 'Invalid value' }
        }
        return { success: false, error: 'Validation failed' }
      }
    }
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Filter out old requests
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }
  
  getRemainingRequests(key: string): number {
    const requests = this.requests.get(key) || []
    const now = Date.now()
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }
}

// Security utilities
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken || token.length !== expectedToken.length) {
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }
  
  return result === 0
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password must be at least 8 characters long')
  }
  
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain lowercase letters')
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain uppercase letters')
  }
  
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain numbers')
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password must contain special characters')
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

// Export type definitions
export type QRCodeData = z.infer<typeof qrCodeSchema>
export type BatchData = z.infer<typeof batchDataSchema>
export type UserData = z.infer<typeof userDataSchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>