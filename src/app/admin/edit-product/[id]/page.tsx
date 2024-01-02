"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import test from "node:test";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ProductType } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus
} from "@fortawesome/free-solid-svg-icons";


type Inputs = {
    title: string | undefined;
    desc: string | undefined;
    price: number | undefined;
    isVisible?: boolean | undefined;
    isFeatured?: boolean | undefined;
};

type Option = {
    title: string;
    additionalPrice: number;
};

const EditProductPage = ({ params }: { params: { id: string } }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const id = params.id;

    const [inputs, setInputs] = useState<Inputs>({
        title: undefined,
        desc: undefined,
        price: undefined,
        isVisible: undefined,
        isFeatured: undefined,
    });

    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [option, setOption] = useState<Option>({
        title: "",
        additionalPrice: 0,
    });

    const [options, setOptions] = useState<Option[]>([]);
    const [file, setFile] = useState<File>();

    const categories = ['Comida', 'Bebida', 'Otros'];



    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                //* Fetch product details by ID
                const productRes = await fetch(`${apiUrl}/products/${id}`, {
                    cache: "no-store"
                });
                if (!productRes.ok) {
                    throw new Error("Failed to fetch product");
                }
                const productData: ProductType = await productRes.json();

                console.log(`productData: ${productData}`);
                console.log(productData);
                let visible = productData.isVisible;
                let featured = productData.isFeatured;

                if (productData.isVisible) {
                    visible= true;
                } else {
                    visible= false;
                }
                if (productData.isFeatured) {
                    featured= true;
                } else {
                    featured= false;
                }

                // Populate the inputs state with product details
                setInputs({
                    title: productData.title,
                    desc: productData.desc,
                    price: productData.price,
                    isVisible: visible,
                    isFeatured: featured,
                });

                console.log(`inputs:`)
                console.log(inputs);

                setSelectedCategory(productData.catSlug)

                // Populate the options state with product options
                setOptions(productData.options || []);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Hubo un error al cargar las categorias, porfavor intente de nuevo.");
                // Handle errors here, e.g., show an error message to the user.
            }
        };
        fetchData();
    }, [id]);


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
        setSelectedCategory(e.target.value);
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
        console.log(inputs);

        if (inputs.title === "" || inputs.title === undefined) {
            toast.error("Se requiere un Titulo.");
            return false;
        } else if (inputs.title.length < 3) {
            toast.warning("Le recomendamos que el Titulo sea mas largo.");
            return false;
        } else if (inputs.title.length > 30) {
            toast.warning("Le recomendamos que el Titulo sea mas corto.");
            return false;
        }
        if (inputs.desc === "" || inputs.desc === undefined) {
            toast.error("Se requiere una Descripcion.");
            return false;
        } else if (inputs.desc.length < 10) {
            toast.warning("Le recomendamos que la Descripcion sea mas larga.");
            return false;
        } else if (inputs.desc.length > 200) {
            toast.warning("Le recomendamos que la Descripcion sea mas corta.");
            return false;
        }
        const decimalRegex = /^\d*\.?\d*$/;
        if (inputs.price !== undefined && !decimalRegex.test(inputs.price.toString())) {
            toast.error("El precio debe ser un numero.");
            return false;
        } else if (options.length === 0) {
            if (inputs.price === undefined || inputs.price === 0 || inputs.price < 0 || inputs.price === undefined || inputs.price.toString() === '') {
                toast.error("Se requiere un Precio.");
                return false;
            } else if (inputs.price > 200) {
                toast.warning("Le recomendamos que el Precio sea mas corto.");
                return false;
            } else if (inputs.price < 3) {
                toast.warning("Le recomendamos que el Precio sea mas largo.");
                return false;
            }
        }

        if (selectedCategory === "" || selectedCategory === undefined || selectedCategory === undefined) {
            toast.error("Se requiere una categoria.");
            return false;
        }
        return true;
    };

    //*Image Functions
    const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const item = (target.files as FileList)[0];
        setFile(item);
    };

    const upload = async () => {
        console.log("uploading image");
        console.log(file);
        const data = new FormData();
        data.append("file", file!);
        data.append("upload_preset", "restaurant");

        const res = await fetch("https://api.cloudinary.com/v1_1/josuke/image/upload", {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: data,
        });

        const resData = await res.json();
        console.log(resData);
        return resData.url;
    };

    const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        try {

            //const url = await upload();

            //change the price in case of empty and having options just so its not 0
            if (options.length > 0) {
                if (inputs.price === undefined || inputs.price === 0 || inputs.price < 0 || inputs.price === null || inputs.price === undefined || inputs.price.toString() === '') {
                    inputs.price = 99;
                }
            }
            const res = await fetch(`${apiUrl}/products/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    img: '/temporary/p2.png',
                    ...inputs,
                    catSlug: selectedCategory,
                    options,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(`Hubo un error al agregar el producto: ${data.message}`);
            } else {
                router.push(`/admin`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Or replace with your own loading component
    }

    return (
        <div className="p-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 flex items-center justify-center text-blue-800">
            <form onSubmit={handleSubmitEdit} className="flex flex-wrap gap-6 ">
                <h1 className="text-4xl mb-2 text-indigo-900 font-bold">
                    Editar Producto
                </h1>
                {/* <div className="w-full flex flex-col gap-2 ">
                    <label
                        className="text-sm cursor-pointer flex gap-4 items-center"
                        htmlFor="file"
                    >
                        <Image src="/upload.png" alt="" width={30} height={20} />
                        <span>Upload Image</span>
                    </label>su
                    <input
                        type="file"
                        onChange={handleChangeImg}
                        id="file"
                        className="hidden"
                    />
                </div> */}
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Titulo</label>
                    <input
                        className="ring-1 ring-blue-700 p-4 rounded-sm bg-gray-50 placeholder:text-slate-300 outline-none"
                        type="text"
                        placeholder="Orden de Pastelitos"
                        name="title"
                        onChange={handleChange}
                        defaultValue={inputs.title}
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
                        defaultValue={inputs.desc}
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
                        defaultValue={inputs.price}
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
                        value={selectedCategory}
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
                <div className="flex justify-center items-center w-full">
                    <button
                        type="submit"
                        className="bg-blue-800 p-4 text-white rounded-md w-48 text-lg font-bold"
                    >
                        Editar Producto
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditProductPage;