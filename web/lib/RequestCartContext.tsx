"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface RequestCartItem {
  documentId: string;
  item_title: string;
  item_type: string;
  quantity: number;
}

interface RequestCartContextValue {
  items: RequestCartItem[];
  addItem: (item: Omit<RequestCartItem, "quantity">) => void;
  removeItem: (documentId: string) => void;
  updateQuantity: (documentId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (documentId: string) => boolean;
}

const STORAGE_KEY = "request_cart";

const RequestCartContext = createContext<RequestCartContextValue | null>(null);

export function RequestCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RequestCartItem[]>(() => {
    // Lazy initializer: читаем из localStorage только на клиенте
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // игнорируем ошибки парсинга
    }
    return [];
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // игнорируем ошибки записи
    }
  }, [items]);

  const addItem = useCallback((item: Omit<RequestCartItem, "quantity">) => {
    setItems((prev) => {
      // Если товар уже в корзине — не добавляем повторно и не увеличиваем количество
      const existing = prev.find((i) => i.documentId === item.documentId);
      if (existing) {
        return prev;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((documentId: string) => {
    setItems((prev) => prev.filter((i) => i.documentId !== documentId));
  }, []);

  const updateQuantity = useCallback(
    (documentId: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((i) =>
          i.documentId === documentId ? { ...i, quantity } : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (documentId: string) => {
      return items.some((i) => i.documentId === documentId);
    },
    [items]
  );

  return (
    <RequestCartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </RequestCartContext.Provider>
  );
}

export function useRequestCart() {
  const context = useContext(RequestCartContext);
  if (!context) {
    throw new Error(
      "useRequestCart must be used within a RequestCartProvider"
    );
  }
  return context;
}