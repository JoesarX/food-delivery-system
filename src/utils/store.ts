import { ActionTypes, CartItemType, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
    products: [],
    totalItems: 0,
    totalPrice: 0,
};

export const useCartStore = create(
    persist<CartType & ActionTypes>(
        (set, get) => ({
            products: INITIAL_STATE.products,
            totalItems: INITIAL_STATE.totalItems,
            totalPrice: INITIAL_STATE.totalPrice,
            addToCart(item) {
                const products = get().products;
                const uniqueIdentifier = item.optionTitle
                    ? `${item.id}-${item.optionTitle}`
                    : item.id;
            
                const productInState = products.find(
                    (product) => uniqueIdentifier === (product.optionTitle
                        ? `${product.id}-${product.optionTitle}`
                        : product.id)
                );
            
                if (productInState) {
                    const updatedProducts = products.map((product) =>
                        uniqueIdentifier === (product.optionTitle
                            ? `${product.id}-${product.optionTitle}`
                            : product.id)
                            ? {
                                ...product,
                                quantity: item.quantity + product.quantity,
                                subtotal: item.price * (item.quantity + product.quantity),
                            }
                            : product
                    );
                    set((state) => ({
                        products: updatedProducts,
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price * item.quantity,
                    }));
                } else {
                    set((state) => ({
                        products: [...state.products, { ...item, subtotal: item.price * item.quantity }],
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price * item.quantity,
                    }));
                }
            },
            clearCart: () => set({ ...INITIAL_STATE }),
            removeFromCart(item) {
                const uniqueIdentifier = item.optionTitle
                    ? `${item.id}-${item.optionTitle}`
                    : item.id;
            
                set((state) => ({
                    products: state.products.filter((product) =>
                        uniqueIdentifier !== (product.optionTitle
                            ? `${product.id}-${product.optionTitle}`
                            : product.id)
                    ),
                    totalItems: state.totalItems - item.quantity,
                    totalPrice: state.totalPrice - item.subtotal,
                }));
            },
            plusOne(item) {
                const uniqueIdentifier = item.optionTitle
                    ? `${item.id}-${item.optionTitle}`
                    : item.id;
            
                set((state) => ({
                    products: state.products.map((product) =>
                        uniqueIdentifier === (product.optionTitle
                            ? `${product.id}-${product.optionTitle}`
                            : product.id)
                            ? {
                                ...product,
                                quantity: product.quantity + 1,
                                subtotal: product.subtotal + item.subtotal/item.quantity,
                            }
                            : product
                    ),
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + item.subtotal/item.quantity,
                }));
            },
            
            minusOne(item) {
                const uniqueIdentifier = item.optionTitle
                    ? `${item.id}-${item.optionTitle}`
                    : item.id;

                set((state) => {
                    const updatedProducts = state.products.map((product) =>
                        uniqueIdentifier === (product.optionTitle
                            ? `${product.id}-${product.optionTitle}`
                            : product.id)
                            ? {
                                ...product,
                                quantity: product.quantity - 1,
                                subtotal: product.subtotal - item.price,
                            }
                            : product
                    );

                    return {
                        products: updatedProducts.filter((product) => product.quantity > 0),
                        totalItems: state.totalItems - 1,
                        totalPrice: state.totalPrice - item.price,
                    };
                });
            },
        }),
        { name: "cart", skipHydration: true }
    )
);
