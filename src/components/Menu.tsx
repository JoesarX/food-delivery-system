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
   faCircle,
   faClockRotateLeft,
   faX,
} from "@fortawesome/free-solid-svg-icons";

const links = [
   { id: 1, title: "Inicio", url: "/", icon: faHouse },
   {
      id: 2,
      title: "Menu",
      url: "/menu",
      icon: faUtensils,
      subOptions: [
         { id: 21, title: "Comida", url: "/menu/comida" },
         { id: 22, title: "Bebida", url: "/menu/bebida" },
         { id: 23, title: "Otros", url: "/menu/otros" },
      ],
   },
   // { id: 3, title: "Contactanos", url: "/contactanos", icon: faPhone },
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
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-blue-800 text-white flex flex-col gap-8 pl-6 pt-10 items-left justify-start text-xl menu-container">
               <div className="w-full flex justify-start pr-4 mt-8">
                  <FontAwesomeIcon icon={faX} onClick={closeMenu} className="cursor-pointer w-5" />
               </div>

               {/* MENU LINKS */}
               {links.map((item) => (
                  <div key={item.id}>
                     <Link href={item.url} onClick={closeMenu}>
                        <FontAwesomeIcon
                           icon={item.icon}
                           className="cursor-pointer pr-4 w-6"
                        />
                        {item.title}
                     </Link>

                     {/* SUBMENU OPTIONS */}
                     {item.subOptions && (
                        <div className="pl-8">
                           {item.subOptions.map((subOption) => (
                              <Link
                                 key={subOption.id}
                                 href={subOption.url}
                                 onClick={closeMenu}
                                 className="flex items-center gap-2 text-sm pt-3"
                              >
                                 <FontAwesomeIcon icon={faCircle} className="w-3" />
                                 {subOption.title}
                              </Link>
                           ))}
                        </div>
                     )}
                  </div>
               ))}

               {/* LINKS THAT DEPEND ON AUTHENTICATION STATUS */}

               {/* CART / ADMIN LINK */}
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

               {/* ORDERS LINK */}
               {status === "authenticated" && (
                  <Link href="/orders" onClick={closeMenu}>
                     <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="cursor-pointer pr-4 w-6"
                     />
                     Ordenes
                  </Link>
               )}

               {/*CONTACTANOS LINK */}
               <Link href={"/contactanos"} onClick={closeMenu}>
                  <FontAwesomeIcon
                     icon={faPhone}
                     className="cursor-pointer pr-4 w-6"
                  />
                  CONTACTANOS
               </Link>


               {/* INICIAR / CERRAR SESSION LINK */}
               {status !== "authenticated" ? (
                  <Link href="/login" onClick={closeMenu}>
                     <FontAwesomeIcon
                        icon={faUser}
                        className="cursor-pointer pr-4 w-6"
                     />
                     Iniciar Sesión
                  </Link>
               ) : (
                  <div className="cursor-pointer" onClick={() => signOut()}>
                     <FontAwesomeIcon
                        icon={faUserSlash}
                        className="cursor-pointer pr-4 w-6"
                     />
                     Cerrar Sesión
                  </div>
               )
               }
            </div>
         )}
      </div>
   );
};

export default Menu;