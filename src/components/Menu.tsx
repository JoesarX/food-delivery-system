"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';

import CartIcon from './CartIcon';

//https://www.js-craft.io/blog/using-font-awesome-icons-with-the-nextjs-app-folder/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faXmark,
    faCartShopping
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
    { id: 1, title: 'Inicio', url: '/' },
    { id: 2, title: 'Menu', url: '/menu' },
    { id: 3, title: 'Horas de Atención', url: '/' },
    { id: 4, title: 'Contacto', url: '/' }
];

const Menu = () => {
    const [open, setOpen] = useState(false)

    const user = false
    return (
        <div>
            {!open ? (
                <FontAwesomeIcon icon={faBars} width={20} height={20} onClick={() => setOpen(true)} />
            ) : (
                <FontAwesomeIcon icon={faXmark} width={20} height={20} onClick={() => setOpen(false)} />
            )}

            {open && (<div className='bg-blue-600 text-white absolute left-0 top-24 w-full h-[calc(100vh-6rem)] flex flex-col gap-8 items-center justify-center text-3xl z-10'>
                {menuItems.map(
                    item => (
                        <Link href={item.url} key={item.id} onClick={() => setOpen(false)}>{item.title} </Link>
                    )
                )}
                {!user ? <Link href={"/login"} onClick={() => setOpen(false)}>Login</Link> :
                    <Link href={"/orders"} onClick={() => setOpen(false)}>Ordenes</Link>}
                {/* <Link href="/cart" onClick={() => setOpen(false)}>
                    <CartIcon />
                </Link> */}
                <Link href={"/cart"} onClick={()=>setOpen(false)}><FontAwesomeIcon icon={faCartShopping}/> Carrito (3)</Link>
            </div>)}
        </div>
    )
}

export default Menu