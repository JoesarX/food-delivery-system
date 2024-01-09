"use client"
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";


const CartIcon = () => {
    const { data: session, status } = useSession();

    const { totalItems } = useCartStore();

    useEffect(() => {
        useCartStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])
    return (
        <Link href={session?.user.isAdmin ? "/add" : "/cart"}>
            <div className="flex items-center gap-4">
                <div className="relative w-6 h-8 md:w-2 md:h-5">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                {session?.user.isAdmin ? (
                    <button className="p-1 bg-blue-800 text-white rounded-md">Agregar Producto</button>
                ) : (
                    <span>Carrito ({totalItems})</span>
                )}
            </div>
        </Link>
    );
};

export default CartIcon;