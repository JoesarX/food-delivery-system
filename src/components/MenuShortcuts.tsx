import Link from 'next/link';

const MenuShortcuts = () => {
    return (
        <div className='bg-gray-300 border-b-[1px] uppercase font-semibold flex justify-center'>
            <div className="flex w-full md:w-[700px]">
                <Link
                    href="/menu/comida"
                    className="flex-[4] md:flex-1 hover:bg-blue-800 hover:text-white transition-colors"
                >
                    <div className="h-full flex items-center justify-center px-4 py-2">
                        Comida
                    </div>
                </Link>
                <Link
                    href="/menu/bebida"
                    className="flex-[4] md:flex-1 border-l-[2px] border-r-[2px] border-gray-100 hover:bg-blue-800 hover:text-white transition-colors"
                >
                    <div className="h-full flex items-center justify-center px-4 py-2">
                        Bebida
                    </div>
                </Link>
                <Link
                    href="/menu/otros"
                    className="flex-[2] md:flex-1 hover:bg-blue-800 hover:text-white transition-colors"
                >
                    <div className="h-full flex items-center justify-center px-4 py-2">
                        Otros
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MenuShortcuts;