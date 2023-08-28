import React from 'react'
import Link from 'next/link'
import Menu from './Menu'
import Image from 'next/image'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";
import UserLinks from './UserLinks';
import CartIcon from './CartIcon';

const NavBar = () => {
    const user = false;

    return (
        <div className='h-12 text-blue-600 p-4 flex items-center justify-between border-b-2 border-b-blue-600 uppercase md:h-24 lg:px-8'>
            {/* LEFT LINKS */}
            <div className='hidden md:flex gap-4 flex-1'>
                <Link href={"/"}>Inicio</Link>
                <Link href={"/menu"}>Menu</Link>
                <Link href={"/"}>Contacto</Link>
            </div>
            {/* LOGO */}
            <div className='text-xl md:font-bold flex-1 md:text-center'>
                <Link href={"/"}>
                    Los Toneles
                </Link>
            </div>
            {/* MOBILE MENU */}
            <div className='md:hidden'>
                <Menu/>
            </div>
            {/* RIGHT LINKS */}
            <div className='hidden md:flex gap-4 items-center justify-end flex-1'>
                <div className='md:absolute top-3 r-2 2xl:static flex items-center gap-2 cursor-pointer bg-blue-200 px-1 rounded-md'>
                    <Image src="/phone.png" width={20} height={20} alt="" />
                    <span>3344-1221</span>
                </div>
                <UserLinks/>
                {/* <Link href={"/cart"}><FontAwesomeIcon icon={faCartShopping}/> Carrito(3)</Link> */}
                <CartIcon/>
            </div>
        </div>
    )
}

export default NavBar