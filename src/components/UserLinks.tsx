"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserLinks = () => {
    const { status } = useSession();
    return (
        <div>
            {status === "authenticated" ? (
                <div>
                    {/* <Link href="/orders">Ordenes</Link> */}
                    <span className="ml-4 cursor-pointer" onClick={() => signOut()}>Cerrar Sesión</span>
                </div>
            ) : (
                <Link href="/login">Iniciar Sesión</Link>
            )}
        </div>
    );
};

export default UserLinks;