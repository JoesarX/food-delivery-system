"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserLinks = () => {
    const { data: session, status } = useSession();
    return (
        <div>
            {status === "authenticated" ? (
                <div className="flex flex-row gap-4">
                    {/* UNCOMENT WHEN ORDER PAGE IS READY */}
                    {/* <Link href="/orders">Ordenes</Link> */}
                    <span className="cursor-pointer flex flex-row" onClick={() => signOut()}>
                        <span className="bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs mr-[3px] mt-[2px] text-white">
                            {(session?.user.email)?.charAt(0)}
                        </span>
                        Cerrar Sesión
                    </span>
                </div>
            ) : (
                <Link href="/login">Iniciar Sesión</Link>
            )}
        </div>
    );
};

export default UserLinks;