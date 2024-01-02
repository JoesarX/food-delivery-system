
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
import { MdOutlineAddCircle } from 'react-icons/md';

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
                const res = await fetch(`${apiUrl}/products/admin`, {
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

    //* Add Product Redirect
    const handleAddProductRedirect = () => {
        router.push("/admin/add-product");
    };

    //* Edit Product Redirect
    const handleEditProductRedirect = (id:number) => {
        router.push(`/admin/edit-product/${id}`);
    };

    //* PUT Visibility and Featured
    const handleUpdateVisOrFeat = async (id: number, action: string, state: boolean) => {
        console.log(`${apiUrl}/products/${id}`);
        const body = action === "visibility" ? { isVisible: state } : { isFeatured: state };
        console.log(`${apiUrl}/products/${id}`)
        const res = await fetch(`${apiUrl}/products/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...body,
            }),
        });

        const data2 = await res.json();
        if (res.ok) {
            if (action === "visibility" && state === true) {
                toast.success("Producto hecho visible con exito.");
            } else if (action === "visibility" && state === false) {
                toast.success("Producto hecho invisible con exito.");
            } else if (action === "featured" && state === true) {
                toast.success("Producto hecho destacado con exito.");
            } else if (action === "featured" && state === false) {
                toast.success("Producto quitado de destacados con exito.");
            }
            setIsProductsChanging(true);
        } else {
            const errorData = await res.json();
            toast.error("Hubo un fallo al cambiar el producto.");
            toast.error(errorData.error);
            return;
        }
    }

    const handleUpdateVisOrFeatModal = async (id: number, action: string, state: boolean) => {
        let titleText = "";
        let textText = "";
        if (action === "visibility" && state === false) {
            titleText = "Esta seguro que quiere hacer el producto invisible?";
            textText = "Al hacerlo invisible, sus clientes no podran ver ni comprar el producto, pero la informacion del producto se mantendra y podra hacerlo visible en cualquier momento.";
        } else if (action === "visibility" && state === true) {
            titleText = "Esta seguro que quiere hacer el producto visible?";
            textText = "Al hacerlo visible, sus clientes podran ver y comprar el producto.";
        } else if (action === "featured" && state === false) {
            titleText = "Esta seguro que quiere quitar el producto de destacados?";
            textText = "Al quitarlo de destacados, sus clientes no podran ver el producto en la pagina principal, pero siempre podran acceder a el desde el menu.";
        } else if (action === "featured" && state === true) {
            titleText = "Esta seguro que quiere hacer el producto destacado?";
            textText = "Al hacerlo destacado, sus clientes podran ver el producto en la pagina principal.";
        }

        Swal
            .fire({
                title: titleText,
                text: textText,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#ababab',
                reverseButtons: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Cambiar'
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUpdateVisOrFeat(id, action, state);
                }
            })
    }


    //* Delete Product
    const handleProductDelete = async (id: number) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

    const handleProductDeleteModal = async (id: number) => {
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
            <div className="flex justify-end">
                <button className="bg-blue-800 text-white p-2 rounded-md w-30 inline-flex items-center justify-center m-3 mx-6" onClick={handleAddProductRedirect} title='Hacer Producto Invisible'>
                    <h1>Agregar Producto</h1>
                    <MdOutlineAddCircle className="ml-1" style={{ fontSize: '24px' }}/> {/* Adjust margin as needed */}
                </button>
            </div>  
            <div className="flex flex-row flex-wrap justify-around ">
                {/* SINGLE ITEM */}
                {featuredProducts.map((item) => (
                    <div
                        key={item.id}
                        className="w-80 h-100 p-4 m-2 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
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
                            <p className="py-1.5 overflow-hidden line-clamp-2">{item.desc}</p>
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
                                    {item.isFeatured ? (
                                        <button className="bg-slate-800 text-white p-2 rounded-md mr-2 w-9" onClick={() => handleUpdateVisOrFeatModal(item.id, "featured", !item.isFeatured)} title='Quitar Producto de Destacados'>
                                            <FontAwesomeIcon icon={faMoon} />
                                        </button>
                                    ) : (
                                        <button className="bg-yellow-500 text-white p-2 rounded-md mr-2 w-9" onClick={() => handleUpdateVisOrFeatModal(item.id, "featured", !item.isFeatured)} title='Hacer Producto Destacado'>
                                            <FontAwesomeIcon icon={faStar} />
                                        </button>

                                    )}
                                    <button className="bg-gray-600 text-white p-2 rounded-md mr-2 w-9" onClick={() => handleUpdateVisOrFeatModal(item.id, "visibility", !item.isVisible)} title='Hacer Producto Invisible'>
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    </button>
                                </span>
                            ) : (
                                <button className="bg-gray-500 text-white p-2 rounded-md mr-2 w-9" onClick={() => handleUpdateVisOrFeatModal(item.id, "visibility", !item.isVisible)} title='Hacer Producto Visible'>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            )}


                            <button className="bg-blue-600 text-white p-2 rounded-md mr-2 w-9" title='Editar Producto'  onClick={() => handleEditProductRedirect(item.id)}>
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