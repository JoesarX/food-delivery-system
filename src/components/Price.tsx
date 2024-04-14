"use client";

import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faMinus
} from "@fortawesome/free-solid-svg-icons";

const Price = ({ product }: { product: ProductType }) => {
    const [total, setTotal] = useState(product.price);
    const [quantity, setQuantity] = useState(1);
    const [selected, setSelected] = useState(0);

    const { addToCart } = useCartStore();

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])

    useEffect(() => {
        if (product.options?.length) {
            setTotal(
                product.options[selected].additionalPrice
            );
        }
    }, [quantity, selected, product]);

    const handleCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            img: product.img,
            price: (total),
            subtotal: (total * quantity),
            ...(product.options?.length && {
                optionTitle: product.options[selected].title,
            }),
            quantity: quantity,
        })
        toast.success("Producto agregado al carrito!")
    }

    return (
        <div className="flex flex-col gap-4 ">
            <h2 className="text-2xl font-bold">L. {total}</h2>
            {/* OPTIONS CONTAINER */}
            <div className="flex flex-wrap gap-2">
                {product.options?.length !== undefined &&
                    product.options?.length > 0 &&
                    product.options?.map((option, index) => (
                        <button
                            key={option.title}
                            className="min-w-[6rem] p-2 ring-1 ring-blue-800 rounded-md"
                            style={{
                                background: selected === index ? "rgb(30,64,175)" : "white",
                                color: selected === index ? "white" : "rgb(30,64,175)",
                            }}
                            onClick={() => setSelected(index)}
                        >
                            {option.title}
                        </button>
                    ))}
            </div>
            {/* QUANTITY AND ADD BUTTON CONTAINER */}
            <div className="flex justify-between items-center pb-3">
                {/* QUANTITY */}
                <div className="flex justify-between w-full p-3 ring-1 ring-blue-800">
                    <span>Cantidad</span>
                    <div className="flex gap-4 items-center">
                        <button onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}>
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className=" w-5 sm:w-6 text-center font-bold">{quantity}</span>
                        <button onClick={() => setQuantity((prev) => (prev < 99 ? prev + 1 : 99))}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                {/* CART BUTTON */}
                <button
                    className="uppercase w-56 bg-blue-800 text-white p-3 ring-1 ring-blue-800"
                    onClick={handleCart}
                >
                    Agregar
                </button>
            </div>
        </div>
    );
};

export default Price; 