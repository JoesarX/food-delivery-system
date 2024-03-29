"use client"

import {useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { use } from "react";
import { toast } from "react-toastify";

//! DEPRECATED DELETE BUTTON
//! It was replaced by the DeleteButton component in the admin folder

const DeleteButton = ({id}: {id: number}) => {
    const {data:session,status} = useSession();
    const router = useRouter();
    
    if(status == "loading"){
        return <p>Loading...</p>
    }

    if(status == "unauthenticated" || !session?.user.isAdmin){
        return;
    }

    const handleDeleteProduct = async() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}products/${id}`,{method:"DELETE"})
        if(res.ok){
            router.push("/menu")
            toast.success("Producto eliminado exitosamente!")
        }else{
            const data = await res.json()
            toast.error("Hubo un error al eliminar el producto. Por favor intente mas tarde.")
            toast.error(data.message)
        }
    }


    return (
        <button className="bg-blue-500 p-2 rounded-full absolute top-4 right-4 "  onClick={handleDeleteProduct}><FontAwesomeIcon icon={faTrash} size="lg" style={{color: "#ffffff",}} /></button>
        //<Image src="/delete.png" alt="" width={20} height={20}/>
    );
}

export default DeleteButton;