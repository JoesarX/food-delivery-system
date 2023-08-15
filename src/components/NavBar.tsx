import React from 'react'
import Link from 'next/link'
import Menu from './Menu'

const NavBar = () => {
    return (
        <div className='h-12 text-blue-600 p-4 flex items-center justify-between border-b-2 border-b-blue-600 uppercase'>
            <div className='hidden md:flex gap-4'>
                <Link href={"/"}>Inicio</Link>
                <Link href={"/menu"}>Menu</Link>
                <Link href={"/"}>Contacto</Link>
            </div>
            {/* LOGO */}
            <div className='text-xl'>
                <Link href={"/"}>
                    Los Toneles
                </Link>
            </div>
            {/* MOBILE MENU */}
            <div className='md:hidden'>
                <Menu/>
            </div>
        </div>
    )
}

export default NavBar