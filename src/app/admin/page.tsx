
"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Image from "next/image";
import { ProductType } from "@/types/types";
import { use } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenToSquare, faTrash, faEye, faEyeSlash, faStar, faMoon
} from "@fortawesome/free-solid-svg-icons";


const AdminHome = () => {
    //* Variables
    const { data: session, status } = useSession();
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
    const [isProductsChanging, setIsProductsChanging] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    //* Data Fetching from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/products`, {
                    cache: "no-store"
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data: ProductType[] = await res.json();
                setFeaturedProducts(data);
            } catch (error) {
                console.error(error);
                // Handle errors here, e.g., show an error message to the user.
            }
        };
        if (isProductsChanging) {
            fetchData(); // Trigger re-fetch when isProductsChanging is true
            setIsProductsChanging(false); // Reset the state
        }
    }, [apiUrl, isProductsChanging]);

    //* Loading and Authentication
    if (status == "loading") {
        return <p>Loading...</p>
    }

    if (status == "unauthenticated" || !session?.user.isAdmin) {
        return redirect("/");
    }

    //* Redirect Functions
    const handleAddProductRedirect = () => {
        router.push("/admin/add-product");
    };

    //* PUT Visibility and Featured
    const handleUpdateVisOrFeat = async (id: string, action: string, state: boolean) => {
        console.log(`${apiUrl}/products/${id}`);
        //depending on whether we want to change the visibility or featured state, we will send a different body
        const body = action === "visibility" ? { isVisible: state } : { isFeatured: state };
        console.log("body")
        console.log(body)
        console.log("url")
        console.log(`${apiUrl}/products/${id}`)
        const res = await fetch(`${apiUrl}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            toast.success("Producto cambiado con exito.")
            setIsProductsChanging(true);
        } else {
            const errorData = await res.json();
            toast.error("Hubo un fallo al cambiar el producto.");
            toast.error(errorData.error);
            return;
        }
    }

    const handleUpdateVisOrFeatModal = async (id: string, action: string, state: boolean) => {
        Swal.fire({
            title: 'Esta seguro que quiere cambiar el producto?',
            text: "Una vez borrado, no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#ababab',
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Elminiar'
        }).then((result) => {
            if (result.isConfirmed) {
                updateProductVisibility(id, state);
            }
        })
    }

    const updateProductVisibility = async (id: string, isVisible: boolean) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isVisible }),
        });

        if (res.ok) {
            toast.success("Product visibility updated successfully.");
            // You can also update your UI or state as needed here.
        } else {
            const data = await res.json();
            toast.error("Failed to update product visibility.");
            toast.error(data.message);
        }
    };


    //* Delete Product
    const handleProductDelete = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log(`${apiUrl}/products/${id}`);
        const res = await fetch(`${apiUrl}/products/${id}`, { method: "DELETE" })
        if (res.ok) {
            toast.success("Producto eleminado con exito.")
            setIsProductsChanging(true);
        } else {
            const data = await res.json()
            toast.error("Hubo un fallo al eliminar el producto.")
            toast.error(data.message)
        }
    }

    const handleProductDeleteModal = async (id: string) => {
        Swal.fire({
            title: 'Esta seguro que quiere eliminar el producto?',
            text: "Una vez borrado, no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#ababab',
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Eliminiar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleProductDelete(id);
            }
        })
    }


    return (
        <div className="w-full overflow-y-scroll  text-blue-600">
            {/* PRODUCT TABLE */}
            <button className="bg-gray-600 text-white p-2 rounded-md mr-2 w-30 inline-flex " onClick={handleAddProductRedirect} title='Hacer Producto Invisible'>
                <FontAwesomeIcon icon={faEyeSlash} className="m-1" />
                <h1>Agregar Producto</h1>
            </button>
            <div className="flex flex-row flex-wrap justify-around ">
                {/* SINGLE ITEM */}
                {featuredProducts.map((item) => (
                    <div
                        key={item.id}
                        className="w-80 h-100 p-4 m-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                        {/* IMAGE CONTAINER */}
                        {item.img && (
                            <div className="relative h-40">
                                <Image
                                    src={item.img}
                                    alt=""
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                            </div>
                        )}
                        {/* TEXT CONTAINER */}
                        <div className="py-4 flex-grow">
                            <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">
                                {item.title}
                            </h1>
                            <p className="py-2">{item.desc}</p>
                            <span className="flex flex-row justify-start overflow-x-scroll w-full">
                                {item.options?.length ? (
                                    item.options.map((option, index) => (
                                        <span
                                            key={option.title}
                                            className=" p-1 ring-1 ring-blue-400 bg-blue-700 mr-2 mb-2 text-white text-s text-center rounded-md whitespace-nowrap"
                                        >
                                            {option.title}-L{option.additionalPrice}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xl font-bold">L{item.price}</span>
                                )}
                            </span>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end mt-2">
                            {item.isVisible ? (
                                <span>
                                    <button className="bg-gray-600 text-white p-2 rounded-md mr-2 w-9" onClick={() => handleUpdateVisOrFeatModal(item.id, "visibility", !item.isVisible)} title='Hacer Producto Invisible'>
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    </button>
                                    {item.isFeatured ? (
                                        <button className="bg-slate-800 text-white p-2 rounded-md mr-2 w-9" title='Quitar Producto de Destacados'>
                                            <FontAwesomeIcon icon={faMoon} />
                                        </button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white p-2 rounded-md mr-2 w-9" title='Hacer Producto Destacado'>
                                            <FontAwesomeIcon icon={faStar} />
                                        </button>

                                    )}
                                </span>
                            ) : (
                                <button className="bg-gray-500 text-white p-2 rounded-md mr-2 w-9" title='Hacer Producto Visible'>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            )}


                            <button className="bg-blue-600 text-white p-2 rounded-md mr-2 w-9" title='Editar Producto'>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button className="bg-red-600 text-white p-2 rounded-md w-9" title='Eliminar Producto' onClick={() => handleProductDeleteModal(item.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default AdminHome;