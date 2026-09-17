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

  // UI Drawer & Modal states
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isQuickViewOpen: boolean;
  activeQuickViewProduct: Product | null;
  soundEnabled: boolean;

  // Cart Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // UI Actions
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setQuickViewOpen: (open: boolean, product?: Product | null) => void;
  closeQuickView: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSoundEnabled: () => void;

  // Computed Helpers
  getSubtotal: () => number;
  getTotalItems: () => number;
  getFreeDeliveryRemaining: () => number;
  getFreeDeliveryProgress: () => number;
}

const FREE_DELIVERY_THRESHOLD_BDT = 2000;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD_BDT,

      isCartOpen: false,
      isSearchOpen: false,
      isQuickViewOpen: false,
      activeQuickViewProduct: null,
      soundEnabled: typeof window !== "undefined" ? !isSoundMuted() : true,

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return;

        playHapticPop(0.12);

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
            return { items: updatedItems, isCartOpen: true };
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
        set({ items: [] });
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

      closeQuickView: () => {
        playHapticClick(0.06);
        set({
          isQuickViewOpen: false,
          activeQuickViewProduct: null,
        });
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
      }),
    }
  )
);
