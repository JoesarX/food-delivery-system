import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <div className="h-12 md:h-24 p-4 lg:px-20 xl:px-40 text-blue-800 flex items-center justify-between border-t-[1px] border-blue-900">
            <Link href="/" className='font-bold text-base sm:text-xl'>LOS TONELES</Link>
            <p className=' text-sm sm:text-base'>© Derechos Reservados</p>
        </div>
    )
}

export default Footer