export type CartItem = {
  id: string,
  label: string,
  description: string,
  slug: string,
  objectiveReference: string
}
export function isCartItem (obj: unknown): obj is CartItem {
  if (obj == null || typeof obj !== 'object') return false
  return 'id' in obj && typeof obj.id === 'string' &&
    'label' in obj && typeof obj.label === 'string' &&
    'description' in obj && typeof obj.description === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'objectiveReference' in obj && typeof obj.objectiveReference === 'string'
}
export function isCartItems (obj: unknown): obj is CartItem[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCartItem)
}
export const emptyCartItem: CartItem = {
  id: '',
  label: '',
  description: '',
  slug: '',
  objectiveReference: ''
}
