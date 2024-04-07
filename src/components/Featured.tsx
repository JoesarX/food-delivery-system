"use client"
import { ProductType } from "@/types/types";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const Featured: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/featured`, {
          cache: "no-store"
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchData();
  }, [apiUrl]); 

  return (
    <div className="w-full overflow-x-scroll text-blue-800">
      {/* WRAPPER */}
      <div className="w-max flex">
        {/* SINGLE ITEM */}
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-sky-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[80vh]"
          >
            {/* IMAGE CONTAINER */}
            {item.img && (
              <div className="relative flex-1 w-full hover:rotate-[20deg] transition-all duration-500">
                <Image src={item.img} alt="food image" fill className="object-contain" />
              </div>
            )}
            {/* TEXT CONTAINER */}
            <div className=" flex-1 flex flex-col items-center justify-center text-center gap-4">
              <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.title}</h1>
              <p className="p-2 2xl:p-8">{item.desc}</p>
              <span className="text-xl font-bold">L. {item.price}</span>
              <button className="bg-blue-800 text-white py-3 px-6 rounded-md " onClick={() => router.push(`/product/${item.id}`)}>
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;