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
    faClipboardList,
    faUtensils,
    faUser,
    faCashRegister,
    faUsers,
    faComments,
    faCoins,
    faX,
} from "@fortawesome/free-solid-svg-icons";

const links = [
    //{ id: 1, title: "Resgistradora", url: "/admin/register", icon: faCashRegister, enabled: false },
    //{ id: 2, title: "Ordenes", url: "/admin/orders", icon: faClipboardList , enabled: false },
    { id: 3, title: "Productos", url: "/admin/products", icon: faUtensils, enabled: true  },
    //{ id: 4, title: "Usuarios", url: "/admin/users", icon: faUsers, enabled: false  },
    { id: 5, title: "Comentarios", url: "/admin/feedback", icon: faComments, enabled: true  },
    //{ id: 6, title: "Finanzas", url: "/admin/finance", icon: faCoins, enabled: false  },
];

const AdminMenu = () => {
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
                <div className="fixed capitalize inset-y-0 left-0 z-50 w-72 bg-blue-900 text-white flex flex-col gap-8 pl-6 pt-4 items-left justify-start text-xl menu-container">
                    <div className="">
                        <div className="w-full flex flex-row justify-between pb-[17px] pr-6">
                            <div className="" onClick={closeMenu}>
                                <FontAwesomeIcon icon={faX} className=" pr-2 cursor-pointer" />
                            </div>
                            {/* INICIAR / CERRAR SESSION LINK */}
                            {status !== "authenticated" ? (
                                <Link href="/login" className="flex flex-col justify-end text-sm pb-[3px]" onClick={closeMenu}>
                                    <div className="flex justify-end cursor-pointer ">
                                        <FontAwesomeIcon icon={faUser} className=" pt-[2px] w-6 text-sm" />
                                        Iniciar Sesión
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-col justify-end text-sm pb-[3px]">
                                    <div className="flex justify-end cursor-pointer" onClick={() => signOut()}>
                                        <div className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs mr-[6px] text-blue-800">
                                            {(session?.user.email)?.charAt(0)}
                                        </div>
                                        Cerrar Sesión
                                    </div>
                                </div>
                            )}
                        </div>
                        <hr className="w-60" />
                        <Link href={"/"} className="w-full pt-7" onClick={closeMenu}>
                            <div>
                                <FontAwesomeIcon icon={faHouse} className="cursor-pointer pr-4 w-6 pt-7" />
                                {"Inicio"}
                            </div>
                        </Link>
                    </div>

                    {/* MENU LINKS */}
                    {links.map((item) => (
                        <div key={item.id} className="w-full">
                            <Link href={item.url} onClick={closeMenu} className={`w-full`}  >
                                <div >
                                    <FontAwesomeIcon icon={item.icon} className="cursor-pointer pr-4 w-6" />
                                    {item.title}
                                </div>
                            </Link>

                            {/* SUBMENU OPTIONS */}
                            {/* ONLY ADD IF SUBMENU OPTIONS EXIST */}
                            {/* {item.subOptions && (
                        <div className="pl-8">
                           {item.subOptions.map((subOption) => (
                              <Link
                                 key={subOption.id}
                                 href={subOption.url}
                                 onClick={closeMenu}
                                 className="flex items-center gap-2 text-sm pt-4"
                              >
                                 <FontAwesomeIcon icon={faCircle} className="w-3" />
                                 {subOption.title}
                              </Link>
                           ))}
                        </div>
                     )} */}
                        </div>
                    ))}

                    {/* LINKS THAT DEPEND ON AUTHENTICATION STATUS */}

                
                </div>
            )}
        </div>
    );
};

export default AdminMenu;