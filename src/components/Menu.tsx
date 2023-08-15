"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';


const menuItems = [
    { id: 1, title: 'Inicio', url: '/' },
    { id: 2, title: 'Menu', url: '/menu' },
    { id: 3, title: 'Horas de Atención', url: '/'},
    { id: 4, title: 'Contacto', url: '/' }
];

const Menu = () => {
    const [open, setOpen] = useState(false)

    const user = false
    return (
        <div>
            {!open ? (
                <Image src="/openMenu.png" alt="" width={20} height={20} onClick={() => setOpen(true)}/>
            ) : (
                <Image src="/closeMenu.png" alt="" width={20} height={20} onClick={() => setOpen(false)}/>
            )}
            <div className='bg-blue-600 text-white absolute left-0 top-24 w-full h-[calc(100vh-6rem)] flex flex-col gap-8 items-center justify-center text-3xl z-10'>
                {menuItems.map(
                    item=>(
                    <Link href={item.url} key={item.id}>{item.title}</Link>
                    )
                )}
                {!user ? <Link href={"/login"}>Login</Link> : 
                    <Link href={"/orders"}>Ordenes</Link>}
                <Link href={"/cart"}>Carrito</Link>
            </div>
        </div>
    )
}

export default Menu