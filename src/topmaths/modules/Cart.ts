import { isCartItem, isCartItems, type CartItem } from '../types/cart'
import Storage from './Storage'

export default class Cart {
  private static _items: CartItem[] = []
  private static eventTarget = new EventTarget()

  static get items (): CartItem[] {
    return this._items
  }

  static set items (items: CartItem[]) {
    const newItems: CartItem[] = items.filter(isCartItem)
    Storage.set('cart', newItems)
    this._items = items
    this.eventTarget.dispatchEvent(new CustomEvent('itemsUpdated', { detail: newItems }))
  }

  static add (cartItem: CartItem): void {
    if (!this.includes(cartItem.exercise.id)) {
      const currentItems = this.items
      currentItems.push(cartItem)
      this.items = currentItems // instead of this.items.push(cartItem) to use the setter checks
    }
  }

  static updateFromStorage (): void {
    const newCart: unknown = Storage.get('cart')
    if (isCartItems(newCart)) {
      this.items = newCart
    }
  }

  static includes (id: string): boolean {
    return this.items.some(cartItem => cartItem.exercise.id === id)
  }

  private static isCustomEvent (event: Event): event is CustomEvent<CartItem[]> {
    return 'detail' in event && isCartItems(event.detail)
  }

  static subscribe (callback: (items: CartItem[]) => void): void {
    this.eventTarget.addEventListener('itemsUpdated', (event: Event) => {
      if (this.isCustomEvent(event)) {
        callback(event.detail)
      }
    })
  }

  static unsubscribe (callback: (items: CartItem[]) => void): void {
    this.eventTarget.removeEventListener('itemsUpdated', (event: Event) => {
      if (this.isCustomEvent(event)) {
        callback(event.detail)
      }
    })
  }
}
