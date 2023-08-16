"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const data =  [
    {
        id: 1,
        title: "la mejor comida tipica de todo Tegucigalpa",
        image: "/tonelesSlider1.jpeg",
    },
    {
        id: 2,
        title: "con el mismo sabor y calidad de siempre",
        image: "/tonelesSlider2.jpg",
    },
    {
        id: 3,
        title: "mas de 50 años de historia alimentando familias",
        image: "/tonelesSlider3.jpeg",
    },
];

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () =>
                setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1)),
            4000
        );
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-sky-50">
            {/* IMAGE CONTAINER */}
            <div className='flex-1 h-1/2 flex items-center justify-center flex-col gap-8 text-blue-600 font-bold'>
                <h1 className='text-5xl text-center uppercase p-4 mdLp-10 md:text-6xl xl:text-7xl'>
                    {data[currentSlide].title}
                </h1>
                <button className=''>Order Now</button>
            </div>
            {/* IMAGE CONTAINER */}
            <div className='flex-1 w-full h-1/2 relative '>
                <Image src={data[currentSlide].image} alt="" fill className='object-cover' />
            </div>
        </div>
    )
}

export default Slider