"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { products, totalItems, totalPrice, removeFromCart, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        useCartStore.persist.rehydrate();
    }, []);

    const handleCheckout = async () => {
        if (!session) {
            router.push("/login");
        } else {
            if (totalItems === 0 && totalPrice === 0) {
                toast.error("No puede proceder a ordenar si no tiene productos en el carrito.");
                return;
            }
            try {
                const res = await fetch(`${apiUrl}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        price: totalPrice,
                        products,
                        status: "Not Paid!",
                        userEmail: session.user.email,
                    }),
                });
                const data = await res.json()
                if (!res.ok) {
                    console.log(`error in post: ${data.message}`)
                    toast.error(`Hubo un error al procesar su orden, por favor intente mas tarde.`);
                } else {
                    clearCart();
                    router.push(`/pay/${data.orderID}`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-blue-800 lg:flex-row">
            {/* PRODUCTS CONTAINER */}
            <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
                {/* SINGLE ITEM */}
                {products.map((item) => (
                    <div className="flex items-center justify-between mb-4" key={item.id}>
                        {item.img && (
                            <Image src={item.img} alt="" width={100} height={100} />
                        )}
                        <div className="">
                            <h1 className="uppercase text-xl font-bold">
                                {item.title} x{item.quantity}
                            </h1>
                            <span>{item.optionTitle}</span>
                        </div>
                        <h2 className="font-bold">L. {item.price/item.quantity}</h2>
                        <span
                            className="cursor-pointer"
                            onClick={() => removeFromCart(item)}
                        >
                            X
                        </span>
                    </div>
                ))}
            </div>
            {/* PAYMENT CONTAINER */}
            <div className="h-1/2 p-4 bg-sky-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-15 xl:px-30 2xl:text-xl 2xl:gap-6">
                <div className="flex justify-between">
                    <span className="">Subtotal ({totalItems} items)</span>
                    <span className="">${Number(totalPrice).toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between">
                    <span className="">Service Cost</span>
                    <span className="">${Number(totalPrice * 0.034).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="">Delivery Cost</span>
                    <span className="text-green-500">FREE!</span>
                </div> */}
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span className="">TOTAL(INCL. VAT)</span>
                    <span className="font-bold">${Number(totalPrice * 1.034).toFixed(2)}</span>
                </div>
                <p className="font-bold p-2">¡Estamos trabajando en que puedas ordenar en linea! Por ahora, visítanos en el local para hacer tus pedidos.</p>
                <button
                    onClick={handleCheckout}
                
                    //TODO: COMMENTED OUT UNTIL THE FUNCTIONALITY IS IMPLEMENTED. UNCOMMENT WHEN READY
                    //className={`bg-blue-800 text-white p-3 rounded-md w-1/2 lg:w-2/3 xl:w-1/2 self-end ${totalItems === 0 && 'opacity-40'} `}
                    //disabled={totalItems === 0}
                    
                    //TODO: REMOVE THIS LINE WHEN THE FUNCTIONALITY IS IMPLEMENTED
                    className={`bg-blue-800 text-white p-3 rounded-md w-1/2 lg:w-2/3 xl:w-1/2 self-end opacity-40 `}
                    disabled={true}
                >
                    ORDENAR
                </button>
                
            </div>
        </div>
    );
};

export default CartPage;