import { MenuType, MenuTypeSimple } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const MenuPage = async () => {

    //const menu: MenuType = await categoryService.getAllCategories();
    const menu2: MenuTypeSimple = [
        {
            title: "Comida",
            description: "Comidas tradicionales deliciosas de todo tipo.",
            img: "/comidaPng.png",
            slug: "comida"
        },
        {
            title: "Bebida",
            description: "Todo tipo de refrescos Pepsi.",
            img: "/bebidaPng.png",
            slug: "bebida"
        },
        {
            title: "Otros",
            description: "Postres sarita heladitos y refrescantes.",
            img: "/otrosPng.png",
            slug: "otros"
        }
    ]

    return (
        <div className="p-6 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-14rem)] flex flex-col md:flex-row items-center">
            {menu2.map((category) => (
                <Link
                    href={`/menu/${category.slug}`}
                    key={category.title}
                    className="w-full h-1/3 bg-cover p-8 md:h-1/2"
                >
                    {category.img && (
                        <div className="relative h-[50%] bottom-5">
                            <Image src={category.img} alt="" fill className="object-contain" />
                        </div>
                    )}
                    <div className={`text-black w-full`}>
                        <h1 className="uppercase font-bold text-3xl text-center">{category.title}</h1>
                        <p className="text-base my-4 text-center">{category.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default MenuPage