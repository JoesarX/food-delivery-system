"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Inputs = {
    title: string;
    desc: string;
    price: number;
    catSlug: string;
};

type Option = {
    title: string;
    additionalPrice: number;
};

const AddPage = () => {
    const { data: session, status } = useSession();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [inputs, setInputs] = useState<Inputs>({
        title: "",
        desc: "",
        price: 0,
        catSlug: "",
    });

    const [option, setOption] = useState<Option>({
        title: "",
        additionalPrice: 0,
    });

    const [options, setOptions] = useState<Option[]>([]);
    const [file, setFile] = useState<File>();

    const router = useRouter();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated" || !session?.user.isAdmin) {
        router.push("/");
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOption((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const item = (target.files as FileList)[0];
        setFile(item);
    };

    const upload = async () => {
        const data = new FormData();
        data.append("file", file!);
        data.append("upload_preset", "Los Toneles");

        const res = await fetch("https://api.cloudinary.com/v1_1/josuke/image", {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: data,
        });

        const resData = await res.json();
        console.log(resData);
        return resData.url;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = await upload();
            const res = await fetch(`${apiUrl}/products/adminView`, {
                method: "POST",
                body: JSON.stringify({
                    img: url,
                    ...inputs,
                    options,
                }),
            });

            const data = await res.json();

            router.push(`/admin`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4 lg:px-20 xl:px-40 flex items-center justify-center text-blue-800">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
                <h1 className="text-4xl mb-2 text-indigo-900 font-bold">
                    Agregar Nuevo Producto
                </h1>
                <div className="w-full flex flex-col gap-2 ">
                    <label
                        className="text-sm cursor-pointer flex gap-4 items-center"
                        htmlFor="file"
                    >
                        <Image src="/upload.png" alt="" width={30} height={20} />
                        <span>Upload Image</span>
                    </label>
                    <input
                        type="file"
                        onChange={handleChangeImg}
                        id="file"
                        className="hidden"
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Title</label>
                    <input
                        className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                        type="text"
                        placeholder="Orden de Pastelitos"
                        name="title"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-base">Description</label>
                    <textarea
                        rows={3}
                        className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                        placeholder="Orden de 10 pastelitos de perro. Preparados a base de maíz, rellenos de carne molida con papa o arroz y acompañados con repollo, salsa y queso."
                        name="desc"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Price</label>
                    <input
                        className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                        type="number"
                        placeholder="29"
                        name="price"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-base">Category</label>
                    <input
                        className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                        type="text"
                        placeholder="pizzas"
                        name="catSlug"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-base">Options</label>
                    <div className="flex">
                        <input
                            className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                            type="text"
                            placeholder="Title"
                            name="title"
                            onChange={changeOption}
                        />
                        <input
                            className="ring-1 ring-blue-700 p-4 rounded-sm placeholder:text-blue-200 outline-none"
                            type="number"
                            placeholder="Additional Price"
                            name="additionalPrice"
                            onChange={changeOption}
                        />
                        <button
                            className="bg-gray-500 p-2 text-white"
                            onClick={() => setOptions((prev) => [...prev, option])}
                        >
                            Add Option
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {options.map((opt) => (
                            <div
                                key={opt.title}
                                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                                onClick={() =>
                                    setOptions((prev) =>
                                        prev.filter((item) => item.title !== opt.title)
                                    )
                                }
                            >
                                <span>{opt.title}</span>
                                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddPage;