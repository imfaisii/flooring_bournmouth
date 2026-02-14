// =====================================================
// Anonymous ID Utilities
// =====================================================

/**
 * Generate a unique anonymous ID for support chat
 * Format: anon_{timestamp}_{random}
 *
 * @returns Anonymous ID string
 *
 * @example
 * generateAnonymousId() // => "anon_1739520000000_x7k9m2p"
 */
export function generateAnonymousId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `anon_${timestamp}_${random}`
}

/**
 * Validate anonymous ID format
 *
 * @param id - Anonymous ID to validate
 * @returns True if valid format
 *
 * @example
 * validateAnonymousId("anon_1739520000000_x7k9m2p") // => true
 * validateAnonymousId("invalid") // => false
 */
export function validateAnonymousId(id: string): boolean {
  // Format: anon_{digits}_{alphanumeric}
  const pattern = /^anon_\d+_[a-z0-9]+$/
  return pattern.test(id)
}

/**
 * Get or create anonymous ID from localStorage
 *
 * @param storageKey - localStorage key (default: 'support_anonymous_id')
 * @returns Anonymous ID
 *
 * @example
 * const anonymousId = getOrCreateAnonymousId()
 */
export function getOrCreateAnonymousId(
  storageKey: string = 'support_anonymous_id'
): string {
  if (typeof window === 'undefined') {
    // Server-side: cannot access localStorage
    throw new Error('getOrCreateAnonymousId can only be called on the client')
  }

  let id = localStorage.getItem(storageKey)

  if (!id || !validateAnonymousId(id)) {
    // Generate new ID if not found or invalid
    id = generateAnonymousId()
    localStorage.setItem(storageKey, id)
  }

  return id
}

/**
 * Clear anonymous ID from localStorage (for testing/debugging)
 *
 * @param storageKey - localStorage key (default: 'support_anonymous_id')
 */
export function clearAnonymousId(
  storageKey: string = 'support_anonymous_id'
): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(storageKey)
  }
}
