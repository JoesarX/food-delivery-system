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


const MobileCartIcon = () => {
    const { data: session, status } = useSession();

    const { totalItems } = useCartStore();

    useEffect(() => {
        useCartStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])
    return (
        <Link href="/cart">
            <div className="flex items-center md:gap-3">
                <div className="relative w-6 h-6 md:w-2 md:h-5 mb-[3px]">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <span>
                    <span className="hidden md:inline">Carrito ({totalItems})</span>
                    <span className="md:hidden">({totalItems})</span>
                </span>
            </div>
        </Link>
    );
};

export default MobileCartIcon;