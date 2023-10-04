"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import React from 'react'


const AddProductPage = () => {

    const { data: session, status } = useSession();
    const router = useRouter();

    if (status == "loading") {
        return <p>Loading...</p>
    }

    if (status == "unauthenticated" || !session?.user.isAdmin) {
        return redirect("/");
    }

    return (
        <div>
            <form>
                <h1>Agregar Nuevo Producto</h1>
                <div>
                    <label>Titulo</label>
                    <input type="text" name="title" id="title" />
                </div>
                <div>
                    <label>Descripcion</label>
                    <textarea name="desc" id="desc" />
                </div>
                <div>
                    <label>Precio</label>
                    <input type="number" name="price" id="price" />
                </div>
                <div>
                    <label>Categoria</label>
                    <input type="text" name="category" id="category" />
                </div>
                <div>
                    <label>Opciones</label>
                    <div>
                        <input type='text' placeholder='Titulo' name='optionTitle' />
                        <input type='number' placeholder='Precio' name='optionPrice' />
                    </div>
                    <button>Agregar Opcion</button>
                </div>
                <div>
                    <div>
                        <span>Small</span>
                        <span>18.0</span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddProductPage