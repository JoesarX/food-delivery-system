"use client"
import React from 'react'
import Link from 'next/link'
import Menu from './MobileMenu'
import Image from 'next/image'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";
import UserLinks from './UserLinks';
import CartIcon from './CartIcon';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NavBar = () => {
    const user = false;
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status == "loading") {
        return <p>Loading...</p>
    }

    // if(status == "unauthenticated" || !session?.user.isAdmin){
    //     return;
    // }
    const isAdmin = session?.user.isAdmin;

    return (
        <div className='h-16 text-blue-800 bg-white p-4 flex items-center justify-between border-b-2 border-b-blue-800 uppercase lg:h-20 lg:px-8'>
            {/* DESKTOP MENU */}
            <div className='hidden lg:flex w-full'>
                {/* LEFT LINKS */}
                <div className='flex gap-4 flex-1'>
                    <Link href={"/"}>Inicio</Link>
                    <Link href={"/menu"}>Menu</Link>
                    <Link href={"/contact-us"}>Contactanos</Link>
                </div>
                {/* LOGO */}
                <div className='text-xl font-bold flex-1 text-center'>
                    <Link href={"/"}>
                        Los Toneles
                    </Link>
                </div>

                {/* RIGHT LINKS */}
                <div className='flex gap-4 items-center justify-end flex-1'>
                    {/* <div className='md:absolute top-3 r-2 2xl:static flex items-center gap-2 cursor-pointer bg-blue-200 px-1 rounded-md'>
                    <Image src="/phone.png" width={20} height={20} alt="" />
                    <span>3344-1221</span>
                </div> */}

                    <span className='flex'><UserLinks /></span>
                    {isAdmin ? (
                        <Link href={"/admin/products"}>Administracion</Link>
                    ) : (
                        <CartIcon />
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            <div className='flex lg:hidden w-full items-center justify-between'>
                {/* HAMBURGER MENU */}
                <div className='flex-1 ml-2 '>
                    <Menu />
                </div>

                {/* LOGO */}
                <div className='text-xl font-bold flex-5 text-center'>
                    <Link href={"/"}>
                        Los Toneles
                    </Link>
                </div>

                {/* CART ICON */}
                <div className='flex justify-end flex-1'>
                    {isAdmin ? (
                        <Link href={"/admin/products"} className='font-bold'>ADMIN</Link>
                    ) : (
                        <CartIcon />
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar