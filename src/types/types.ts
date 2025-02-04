export type MenuType = {
    id: string;
    slug: string;
    title: string;
    description?: string;
    img?: string;
    color: string;
    createdAt: string;
}[];

export type MenuTypeSimple = {
    title: string;
    description?: string;
    img?: string;
    slug: string;
}[];

export type ProductType = {
    id: string;
    title: string;
    desc: string;
    img?: string;
    price: number;
    isFeatured: boolean;
    isVisible: boolean;
    catSlug: string;
    options?: { title: string; additionalPrice: number }[];
};

export type OrderType = {
    id: string;
    userEmail: string;
    price: number;
    products: CartItemType[];
    status: string;
    createdAt: Date;
    intent_id?: String;
};

export type CartItemType = {
    id: string;
    title: string;
    img?: string;
    price: number;
    subtotal: number;
    optionTitle?: string;
    quantity: number;
};

export type CartType = {
    products: CartItemType[];
    totalItems: number;
    totalPrice: number;
};

export type CommentType = {
    id: string;
    createdAt: Date;
    userEmail: string;
    title: string;
    comment: string;
    ratingWeb: number;
    ratingFood: number;
}

export type ActionTypes = {
    addToCart: (item: CartItemType) => void;
    removeFromCart: (item: CartItemType) => void;
    clearCart: () => void;
    plusOne: (item: CartItemType) => void;
    minusOne: (item: CartItemType) => void;
}