"use client"
import React from 'react'
import Link from 'next/link'
import AdminMenu from './AdminMenu'
import Image from 'next/image'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";
import UserLinks from './UserLinks';
import CartIcon from './CartIcon';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
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
        <div className='h-16 uppercase text-white bg-blue-800 p-4 flex items-center justify-between border-b-2 border-b-blue-950  '>
            <div className='flex  w-full items-center justify-between'>
                {/* HAMBURGER MENU */}
                <div className='flex-1 ml-2 '>
                    <AdminMenu />
                </div>

                {/* LOGO */}
                <div className='text-xl font-bold flex-5 text-center'>
                    <Link href={"/"}>
                        Admin Toneles
                    </Link>
                </div>

                {/* CART ICON */}
                <div className='flex justify-end flex-1'>
                    <Link href={"/"} className='font-bold'>SALIR</Link>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar