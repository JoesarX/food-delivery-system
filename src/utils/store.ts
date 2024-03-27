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
                                ...item,
                                quantity: item.quantity + product.quantity,
                                subtotal: item.subtotal + product.subtotal,
                            }
                            : product
                    );
                    set((state) => ({
                        products: updatedProducts,
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.subtotal,
                    }));
                } else {
                    set((state) => ({
                        products: [...state.products, item],
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.subtotal,
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
                                subtotal: product.subtotal + product.subtotal / product.quantity,
                            }
                            : product
                    ),
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + item.subtotal / item.quantity,
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
                                subtotal: product.subtotal - product.subtotal / product.quantity,
                            }
                            : product
                    );

                    return {
                        products: updatedProducts.filter((product) => product.quantity > 0),
                        totalItems: state.totalItems - 1,
                        totalPrice: state.totalPrice - item.subtotal / item.quantity,
                    };
                });
            },
            
        }),
        { name: "cart", skipHydration: true }
    )
);