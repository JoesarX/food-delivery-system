"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MobileCartIcon from "./MobileCartIcon";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBars,
   faXmark,
   faHouse,
   faUtensils,
   faPhone,
   faUser,
   faUserSlash,
   faWrench,
} from "@fortawesome/free-solid-svg-icons";

const links = [
   { id: 1, title: "Inicio", url: "/", icon: faHouse },
   { id: 2, title: "Menu", url: "/menu", icon: faUtensils },
   { id: 3, title: "Contactanos", url: "/contactanos", icon: faPhone },
];

const Menu = () => {
   const [isOpen, setIsOpen] = useState(false);
   const { data: session, status } = useSession();
   const isAdmin = session?.user.isAdmin;

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   const closeMenu = () => {
      setIsOpen(false);
   };

   useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
         const target = event.target as HTMLElement;
         if (isOpen && !target.closest(".menu-container")) {
            closeMenu();
         }
      };

      if (isOpen) {
         document.addEventListener("click", handleOutsideClick);
      }

      return () => {
         document.removeEventListener("click", handleOutsideClick);
      };
   }, [isOpen]);

   return (
      <div>
         <FontAwesomeIcon
            icon={isOpen ? faXmark : faBars}
            onClick={toggleMenu}
            className="cursor-pointer text-xl"
         />
         {isOpen && (
            <div
               className="fixed inset-y-0 left-0 z-50 w-72 bg-blue-800 text-white flex flex-col gap-8 pl-10 pt-10 items-left justify-start text-xl menu-container"
            >
               <div className="w-full flex justify-end pr-4">
                  <FontAwesomeIcon
                     icon={faXmark}
                     onClick={closeMenu}
                     className="cursor-pointer"
                  />
               </div>
               {links.map((item) => (
                  <Link href={item.url} key={item.id} onClick={closeMenu}>
                     <FontAwesomeIcon
                        icon={item.icon}
                        className="cursor-pointer pr-4 w-6"
                     />
                     {item.title}
                  </Link>
               ))}
               {/* USER IS LOGGED IN OR NOT LINKS */}
               {/*!ES SOLO POR AHORA PARA NO MOSTRAR ORDENES HASTA QUE SE IMPLEMENTE, UNA VEZ ESTE ORDENES REGRESAR A ESTA VERSION*/}
               {/* {status === "authenticated" ? (
            <Link href="/orders" onClick={closeMenu}>
              Ordenes
            </Link>
          ) : (
            <Link href="/login" onClick={closeMenu}>
              Iniciar Sesión
            </Link>
          )} */}
               {/*!ES SOLO POR AHORA PARA NO MOSTRAR ORDENES HASTA QUE SE IMPLEMENTE, UNA VEZ ESTE ORDENES QUITAR A ESTA VERSION*/}
               {status !== "authenticated" && (
                  <Link href="/login" onClick={closeMenu}>
                     <FontAwesomeIcon
                        icon={faUser}
                        className="cursor-pointer pr-4 w-6"
                     />
                     Iniciar Sesión
                  </Link>
               )}
               {/* Separate link so that it properly adds the links individually with proper spacing*/}
               {status === "authenticated" && (
                  <div className="cursor-pointer" onClick={() => signOut()}>
                     <FontAwesomeIcon
                        icon={faUserSlash}
                        className="cursor-pointer pr-4 w-6"
                     />
                     Cerrar Sesión
                  </div>
               )}
               <div>
                  {isAdmin ? (
                     <Link href={"/admin/products"} className="font-bold">
                        <FontAwesomeIcon
                           icon={faWrench}
                           className="cursor-pointer pr-4 w-6"
                        />
                        ADMIN
                     </Link>
                  ) : (
                     <Link href="/cart" onClick={closeMenu}>
                        <MobileCartIcon />
                     </Link>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default Menu;