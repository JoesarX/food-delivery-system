"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import test from "node:test";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { PutBlobResult } from '@vercel/blob';
import imageCompression from 'browser-image-compression';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage
} from "@fortawesome/free-solid-svg-icons";


type Inputs = {
    title: string;
    desc: string;
    price: number;
    catSlug: string;
    isFeatured: boolean;
    isVisible: boolean;
};


type Option = {
    title: string;
    additionalPrice: number;
};

const AddProductPage = () => {
    const { data: session, status } = useSession();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [inputs, setInputs] = useState<Inputs>({
        title: "",
        desc: "",
        price: 0,
        catSlug: "",
        isFeatured: false,
        isVisible: true,
    });

    const [option, setOption] = useState<Option>({
        title: "",
        additionalPrice: 0,
    });

    const categories = ['Comida', 'Bebida', 'Otros'];

    const [options, setOptions] = useState<Option[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);

    const router = useRouter();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated" || !session?.user.isAdmin) {
        router.push("/");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    // Function to check for duplicate option names
    const isValidOption = (title: string, additionalPrice: number) => {
        if (title.trim() === "") {
            toast.error("La opcion debe tener un nombre.");
            return false;
        }
        if (isNaN(additionalPrice) || additionalPrice < 3) {
            toast.error("La opcion debe tener un valor valido de costo.");
            return false;
        }
        if (options.some((opt) => opt.title === title)) {
            toast.error("Ya existe una opcion con ese nombre.");
            return false;
        }

        return true;
    };

    const handleAddOption = () => {
        if (isValidOption(option.title, option.additionalPrice)) {
            setOptions((prev) => [...prev, option]);
            //limpio los inputs
            setOption({
                title: "",
                additionalPrice: 0,
            });
        }
    };

    // Event handler for option input changes
    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOption((prevOption) => ({
            ...prevOption,
            [name]: name === "additionalPrice" ? parseFloat(value) : value,
        }));
    };

    //*Validation
    const validate = () => {
        if (file === null) {
            toast.error("Se requiere una Imagen.");
            return false;
        }
        console.log(inputs);
        if (inputs.title === "") {
            toast.error("Se requiere un Titulo.");
            return false;
        } else if (inputs.title.length < 3) {
            toast.warning("Le recomendamos que el Titulo sea mas largo.");
            return false;
        } else if (inputs.title.length > 30) {
            toast.warning("Le recomendamos que el Titulo sea mas corto.");
            return false;
        }
        if (inputs.desc === "") {
            toast.error("Se requiere una Descripcion.");
            return false;
        } else if (inputs.desc.length < 10) {
            toast.warning("Le recomendamos que la Descripcion sea mas larga.");
            return false;
        } else if (inputs.desc.length > 300) {
            toast.warning("Le recomendamos que la Descripcion sea mas corta.");
            return false;
        }
        const decimalRegex = /^\d*\.?\d*$/;
        if (!decimalRegex.test(inputs.price.toString())) {
            toast.error("El precio debe ser un numero.");
            return false;
        } else if (options.length === 0) {
            if (inputs.price === 0 || inputs.price < 0 || inputs.price === null || inputs.price === undefined || inputs.price.toString() === '') {
                toast.error("Se requiere un Precio.");
                return false;
            } else if (inputs.price > 200) {
                toast.warning("Le recomendamos que el Precio sea mas bajo para un solo producto.");
                return false;
            } else if (inputs.price < 3) {
                toast.warning("Le recomendamos que el Precio sea mas alto.");
                return false;
            }
        }

        if (inputs.catSlug === "" || inputs.catSlug === undefined || inputs.catSlug === null) {
            toast.error("Se requiere una categoria.");
            return false;
        }
        return true;
    };

    //*Image Functions
    const handleChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
    
            if (allowedImageTypes.includes(file.type)) {
                if (file.size > maxSizeInBytes) {
                    try {
                        const compressedFile = await imageCompression(file, {
                            maxSizeMB: 4.9, // Compress to slightly less than 5MB
                            maxWidthOrHeight: 1920, // Set a maximum width and height for the compressed image
                        });
                        setFile(compressedFile);
                        setImagePreview(URL.createObjectURL(compressedFile));
                    } catch (error) {
                        console.error('Error compressing image:', error);
                        toast.error('Error compressing image. Please try again.');
                    }
                } else {
                    setFile(file);
                    setImagePreview(URL.createObjectURL(file));
                }
            } else {
                toast.error('Please select a valid image file (JPEG, PNG, or GIF).');
                e.target.value = ''; // Clear the file input
            }
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            let imageUrl = '/temporary/p2.png';

            if (file) {
                const response = await fetch(`/api/images?filename=${file.name}`, {
                    method: 'POST',
                    body: file,
                });
                const newBlob = (await response.json()) as PutBlobResult;
                setBlob(newBlob);
                imageUrl = newBlob.url;
            }

            if (options.length > 0) {
                if (inputs.price === 0 || inputs.price < 0 || inputs.price === null || inputs.price === undefined || inputs.price.toString() === '') {
                    inputs.price = 99;
                }
            }

            const res = await fetch(`${apiUrl}/products/admin`, {
                method: "POST",
                body: JSON.stringify({
                    img: imageUrl,
                    ...inputs,
                    options,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.log(`error in post: ${data.message}`)
                toast.error(`Hubo un error al agregar el producto: ${data.message}`);
            } else {
                router.push(`/admin/products`);
            }

        } catch (err) {
            console.log(err);
        }
    };
    return (

        <div className="p-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex items-center justify-center text-blue-800">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 ">
                <h1 className="text-4xl mb-2 text-indigo-900 font-bold">
                    Agregar Nuevo Producto
                </h1>
                <div className="w-full flex gap-2 items-center">
                    <label
                        htmlFor="file"
                        className="bg-blue-800 p-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faImage} className=" inline-block mr-2" />
                        Subir Imagen
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleChangeImg}
                        className="hidden"
                    />
                    {file && (
                        <div className="flex items-center bg-slate-100 pr-3 rounded-md">
                            {imagePreview && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '8px', borderRadius: '8px'}}
                                />
                            )}
                            <span>{file.name}</span>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Titulo</label>
                    <input
                        className="ring-1 ring-blue-700 p-4 rounded-sm bg-gray-50 placeholder:text-slate-300 outline-none"
                        type="text"
                        placeholder="Orden de Pastelitos"
                        name="title"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-base">Descripcion</label>
                    <textarea
                        rows={3}
                        className="ring-1 ring-blue-700 p-4 rounded-sm bg-gray-50 placeholder:text-slate-300 outline-none"
                        placeholder='Orden de 10 pastelitos de perro. Preparados a base de maíz, 
                                rellenos de carne molida con papa o arroz y acompañados con repollo, salsa y queso.'
                        name="desc"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Precio</label>
                    <input
                        className={`ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-slate-300 outline-none ${options.length > 0 ? 'bg-gray-200 text-gray-700' : 'bg-gray-50'
                            }`}
                        type="text"
                        placeholder="29"
                        name="price"
                        onChange={handleChange}
                    //disabled={options.length > 0}
                    />
                    {options.length > 0 && (
                        <p className="text-gray-600 text-sm">
                            Si el producto tiene opciones, se mostrarán solo las opciones, no el precio base.
                        </p>
                    )}
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-base">Categoria</label>
                    <select
                        className="ring-1 ring-blue-700 p-4 rounded-sm outline-none bg-gray-50"
                        name="catSlug"
                        onChange={handleCategorySelectChange}
                    >
                        <option value="">Seleccione una Categoria de Producto</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="w-full flex flex-col gap-2">
                    <label className="text-base">Opciones</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-slate-300 outline-none"
                            type="text"
                            placeholder="Nombre de la Opcion"
                            name="title"
                            value={option.title}
                            onChange={handleOptionChange}
                        />
                        <input
                            className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-slate-300 outline-none"
                            type="number"
                            placeholder="Additional Price"
                            name="additionalPrice"
                            value={option.additionalPrice}
                            onChange={handleOptionChange}
                        />
                        <button
                            type="button"
                            className="bg-gray-500 p-2 text-white self-start sm:self-center rounded-md"
                            onClick={handleAddOption}
                        >
                            Agregar Opcion
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {options.map((opt) => (
                            <div
                                key={opt.title}
                                className="p-2  rounded-md cursor-pointer bg-gray-100 text-gray-700"
                                onClick={() =>
                                    setOptions((prev) =>
                                        prev.filter((item) => item.title !== opt.title)
                                    )
                                }
                                style={{ fontFamily: 'Arial' }}
                            >
                                <span>{opt.title}</span>
                                <span className="text-xs"> ( Lmp. {opt.additionalPrice} )</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center w-full pb-8">
                    <button
                        type="submit"
                        className="bg-blue-800 p-4 hover:bg-blue-700 text-white rounded-md w-48 text-lg font-bold"
                    >
                        Crear Producto
                    </button>
                </div>

            </form>
        </div>
    );

};

export default AddProductPage;