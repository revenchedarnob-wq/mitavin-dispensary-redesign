import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";
import {
  playHapticClick,
  playHapticPop,
  playHapticGlass,
  setSoundMuted,
  isSoundMuted,
} from "@/lib/sound";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreState {
  // Cart state
  items: CartItem[];
  freeDeliveryThreshold: number;
  promoCode: string | null;
  discountBDT: number;

  // UI Drawer & Modal states
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isQuickViewOpen: boolean;
  isCheckoutOpen: boolean;
  activeQuickViewProduct: Product | null;
  soundEnabled: boolean;
  lastAddedItemId: string | null;

  // Cart Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // UI Actions
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setQuickViewOpen: (open: boolean, product?: Product | null) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setCheckoutOpen: (open: boolean) => void;
  toggleCheckout: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSoundEnabled: () => void;

  // Computed Helpers
  getSubtotal: () => number;
  getTotalItems: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: (deliveryFee?: number) => number;
  getFreeDeliveryRemaining: () => number;
  getFreeDeliveryProgress: () => number;
}

const FREE_DELIVERY_THRESHOLD_BDT = 2000;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD_BDT,
      promoCode: null,
      discountBDT: 0,

      isCartOpen: false,
      isSearchOpen: false,
      isQuickViewOpen: false,
      isCheckoutOpen: false,
      activeQuickViewProduct: null,
      soundEnabled: typeof window !== "undefined" ? !isSoundMuted() : true,
      lastAddedItemId: null,

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return;

        playHapticPop(0.14);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const nextQty = Math.min(
              currentItem.quantity + quantity,
              product.stockCount || 99
            );
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: nextQty,
            };
            return {
              items: updatedItems,
              isCartOpen: true,
              lastAddedItemId: product.id,
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stockCount || 99),
              },
            ],
            isCartOpen: true,
            lastAddedItemId: product.id,
          };
        });
      },

      removeItem: (productId: string) => {
        playHapticClick(0.08);

        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, delta: number) => {
        const state = get();
        const existing = state.items.find((i) => i.product.id === productId);
        if (!existing) return;

        const newQty = existing.quantity + delta;

        if (newQty <= 0) {
          get().removeItem(productId);
          return;
        }

        if (newQty > (existing.product.stockCount || 99)) {
          playHapticClick(0.05);
          return;
        }

        if (delta > 0) {
          playHapticPop(0.09);
        } else {
          playHapticClick(0.07);
        }

        set((s) => ({
          items: s.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQty }
              : item
          ),
        }));
      },

      setQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        playHapticClick(0.07);

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.stockCount || 99),
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        playHapticClick(0.08);
        set({ items: [], promoCode: null, discountBDT: 0 });
      },

      applyPromoCode: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === "MITAVIN10") {
          playHapticPop(0.12);
          const subtotal = get().getSubtotal();
          const discount = Math.round(subtotal * 0.1);
          set({ promoCode: "MITAVIN10", discountBDT: discount });
          return true;
        }
        playHapticClick(0.06);
        return false;
      },

      removePromoCode: () => {
        playHapticClick(0.06);
        set({ promoCode: null, discountBDT: 0 });
      },

      setCartOpen: (open: boolean) => {
        if (open) {
          playHapticGlass(0.06);
        } else {
          playHapticClick(0.06);
        }
        set({ isCartOpen: open });
      },

      toggleCart: () => {
        const next = !get().isCartOpen;
        get().setCartOpen(next);
      },

      setSearchOpen: (open: boolean) => {
        if (open) {
          playHapticGlass(0.06);
        } else {
          playHapticClick(0.06);
        }
        set({ isSearchOpen: open });
      },

      toggleSearch: () => {
        const next = !get().isSearchOpen;
        get().setSearchOpen(next);
      },

      setQuickViewOpen: (open: boolean, product: Product | null = null) => {
        if (open) {
          playHapticGlass(0.07);
        } else {
          playHapticClick(0.06);
        }
        set({
          isQuickViewOpen: open,
          activeQuickViewProduct: product,
        });
      },

      openQuickView: (product: Product) => {
        get().setQuickViewOpen(true, product);
      },

      closeQuickView: () => {
        playHapticClick(0.06);
        set({
          isQuickViewOpen: false,
          activeQuickViewProduct: null,
        });
      },

      setCheckoutOpen: (open: boolean) => {
        if (open) {
          playHapticGlass(0.08);
        } else {
          playHapticClick(0.06);
        }
        set({ isCheckoutOpen: open });
      },

      toggleCheckout: () => {
        const next = !get().isCheckoutOpen;
        get().setCheckoutOpen(next);
      },

      setSoundEnabled: (enabled: boolean) => {
        setSoundMuted(!enabled);
        set({ soundEnabled: enabled });
        if (enabled) {
          playHapticPop(0.1);
        }
      },

      toggleSoundEnabled: () => {
        const current = get().soundEnabled;
        const next = !current;
        get().setSoundEnabled(next);
      },

      getSubtotal: () => {
        const items = get().items;
        return items.reduce(
          (sum, item) => sum + item.product.priceBDT * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        if (get().promoCode === "MITAVIN10") {
          return Math.round(subtotal * 0.1);
        }
        return get().discountBDT;
      },

      getFinalTotal: (deliveryFee = 60) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const effectiveDelivery = subtotal >= FREE_DELIVERY_THRESHOLD_BDT ? 0 : deliveryFee;
        return Math.max(0, subtotal - discount + effectiveDelivery);
      },

      getFreeDeliveryRemaining: () => {
        const subtotal = get().getSubtotal();
        const threshold = get().freeDeliveryThreshold;
        return Math.max(0, threshold - subtotal);
      },

      getFreeDeliveryProgress: () => {
        const subtotal = get().getSubtotal();
        const threshold = get().freeDeliveryThreshold;
        if (threshold <= 0) return 100;
        return Math.min(100, Math.round((subtotal / threshold) * 100));
      },
    }),
    {
      name: "mitavin_store_persistence",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        soundEnabled: state.soundEnabled,
        promoCode: state.promoCode,
      }),
    }
  )
);
