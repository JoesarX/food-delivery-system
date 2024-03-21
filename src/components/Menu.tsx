"use client";

import React, { useState } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { signOut, useSession } from "next-auth/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBars, faXmark
} from "@fortawesome/free-solid-svg-icons";
import { stat } from "fs";

const links = [
   { id: 1, title: "Inicio", url: "/" },
   { id: 2, title: "Menu", url: "/menu" },
   { id: 3, title: "Contactanos", url: "/contactanos" },
];

const Menu = () => {
   const [open, setOpen] = useState(false);
   const { status } = useSession();

   return (
      <div>
         {/* CHANGING ICONS */}
         <FontAwesomeIcon
            icon={open ? faXmark : faBars}
            onClick={() => setOpen(!open)}
            className="cursor-pointer text-2xl"
         />

         {open && (
            <div className="bg-blue-800 text-white absolute left-0 top-24 w-full h-[calc(100vh-6rem)] flex flex-col gap-8 items-center justify-center text-3xl z-10">
               {links.map((item) => (
                  <Link href={item.url} key={item.id} onClick={() => setOpen(false)}>
                     {item.title}
                  </Link>
               ))}

               {/* USER IS LOGGED IN OR NOT LINKS */}
               
               {/*!ES SOLO POR AHORA PARA NO MOSTRAR ORDENES HASTA QUE SE IMPLEMENTE, UNA VEZ ESTE ORDENES REGRESAR A ESTA VERSION*/}
               {/* {status === "authenticated" ? (
                  <Link href="/orders" onClick={() => setOpen(false)}>
                     Ordenes
                  </Link>
               ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                     Iniciar Sesión
                  </Link>
               )} */}

               {/*!ES SOLO POR AHORA PARA NO MOSTRAR ORDENES HASTA QUE SE IMPLEMENTE, UNA VEZ ESTE ORDENES QUITAR A ESTA VERSION*/}
               {status !== "authenticated" && (
                  <Link href="/login" onClick={() => setOpen(false)}>
                     Iniciar Sesión
                  </Link>
               )
               }

               {/* Separate link so that it properly adds the links individually with proper spacing*/}
               {status === "authenticated" && (
                  <div className="ml-4 cursor-pointer" onClick={() => signOut()}>Cerrar Sesión</div>
               )}

               <Link href="/cart" onClick={() => setOpen(false)}>
                  <CartIcon />
               </Link>
            </div>
         )}
      </div>
   );
};

export default Menu;