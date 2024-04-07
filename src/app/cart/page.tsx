"use client"
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useMediaQuery } from "@react-hook/media-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashCan,
    faPlus,
    faMinus
} from "@fortawesome/free-solid-svg-icons";

const CartPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { products, totalItems, totalPrice, removeFromCart, clearCart, minusOne, plusOne } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 639px)");

    const serviceFee = 0.035;

    useEffect(() => {
        useCartStore.persist.rehydrate();
    }, []);

    const handleAddComment = async () => {
        if (!session) {
            router.push("/login");
        } else {
            router.push("/feedback")
        }
    }

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
        <div className="flex flex-col lg:flex-row h-full text-blue-800">
            {/* PRODUCTS CONTAINER */}
            <div className="flex-grow overflow-x-auto overflow-y-auto h-[calc(100vh-24rem)] lg:h-[calc(100vh-8rem)] px-4 pt-4 mt-2 md:mt-4 pb-[90px] md:pb-4 sm:pt-8 md:pt-12 lg:pt-3 lg:px-10 xl:px-20 2xl:px-28">
                {/* SINGLE ITEM */}
                {products.map((item) => (
                    <div className="flex items-center justify-between mb-4 md:mb-8" key={`${item.id}${item.optionTitle ? `-${item.optionTitle}` : ''}`}>


                        {/* IMAGE */}
                        {item.img && (
                            <div className="flex-shrink-0 mr-4">
                                <Image src={item.img} alt="" width={isMobile ? 50 : 100} height={isMobile ? 50 : 100} />
                            </div>
                        )}

                        {/* TITLE */}
                        <div className="flex-grow">
                            <h1 className="uppercase text-sm md:text-xl font-bold ">
                                {item.title}
                            </h1>
                            <span>{item.optionTitle}</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-1 sm:gap-4 ">
                            {/* PRICE */}
                            <div className="flex-shrink-0 mr-4 w-full sm:w-auto text-right">
                                <span className="font-bold text-sm sm:text-lg">L. {Number(item.price).toFixed(2)}</span>
                            </div>

                            {/* QUANTITY */}
                            <div className="flex justify-between p-1 md:p-3 ring-1 ring-blue-800 w-fit">
                                <div className="flex gap-4 items-center">
                                    {item.quantity === 1 ? (
                                        <button onClick={() => removeFromCart(item)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    ) : (
                                        <button onClick={() => minusOne(item)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    )}
                                    <span className=" w-5 md:w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => plusOne(item)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                ))}
            </div>

            {/* PAYMENT CONTAINER */}
            <div className="bg-sky-50 flex flex-col justify-center p-4 lg:w-1/3 md:text-lg xl:text-xl h-[262px] lg:h-[calc(100vh-121px)]  lg:gap-4 lg:px-15 xl:px-30 2xl:w-2/5 2xl:gap-6 fixed bottom-0 left-0 right-0  lg:static">
                <div className="flex justify-between">
                    <span className="">Subtotal ({totalItems} items)</span>
                    <span className="">L. {Number(totalPrice).toFixed(2)}</span>
                </div>

                {/* TODO: COMMENTED OUT UNTIL THE FUNCTIONALITY IS IMPLEMENTED. UNCOMMENT WHEN READY */}
                {/* <div className="flex justify-between">
                    <span className="">Coste Servicio</span>
                    <span className="">L. {Number(totalPrice * serviceFee).toFixed(0)}</span>
                </div> */}


                {/* <div className="flex justify-between">
                    <span className="">Delivery Cost</span>
                    <span className="text-green-500">FREE!</span>
                </div> */}
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span className="">TOTAL(INCL. VAT)</span>
                    <span className="font-bold">L. {Number(totalPrice + (Number((totalPrice * serviceFee).toFixed(0)))).toFixed(2)}</span>
                </div>
                <p className="font-bold p-1 justify-center text-sm sm:text-base">¡Estamos trabajando en que puedas ordenar en linea! Por ahora, visítanos en el local para hacer tus pedidos. Accede a tu cuenta y dejanos saber que piensas de nuestra nueva pagina y nuestra comida.</p>
                {/* <button
                    onClick={handleCheckout}
                    //TODO: COMMENTED OUT UNTIL THE FUNCTIONALITY IS IMPLEMENTED. UNCOMMENT WHEN READY
                    //className={`bg-blue-800 text-white p-3 rounded-md w-1/2 lg:w-2/3 xl:w-1/2 self-end ${totalItems === 0 && 'opacity-40'} `}
                    //disabled={totalItems === 0}
                    //TODO: REMOVE THIS LINE WHEN THE FUNCTIONALITY IS IMPLEMENTED
                    className={`bg-blue-800 text-white p-3 rounded-md w-1/2 lg:w-2/3 xl:w-1/2 mx-auto self-end opacity-40 mt-3`}
                    disabled={true}
                >
                    ORDENAR
                </button> */}

                {/* COMMENT BUTTON WHEN ORDENES IS FINISHED */}
                <button
                    onClick={handleAddComment}
                    className={`bg-blue-800 text-white p-3 rounded-md w-2/3 lg:w-2/3 xl:w-1/2 mx-auto self-end mt-3`}
                >
                    DINOS QUE PIENSAS
                </button>



            </div>
        </div>
    );
};

export default CartPage;