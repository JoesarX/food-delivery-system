"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const NewComment = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [ratingWeb, setRatingWeb] = useState(0);
    const [ratingFood, setRatingFood] = useState(0);

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/cart");
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !comment || ratingWeb === 0 || ratingFood === 0) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    comment,
                    ratingWeb,
                    ratingFood,
                    userEmail: session?.user.email, 
                }),
            });

            if (res.ok) {
                toast.success("¡Tu comentario ha sido enviado!");
                //router.push(`/`);
                
            } else {
                const error = await res.json();
                toast.error(error.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al enviar el comentario.");
        }
    };

    return (
        <div className="w-full sm:max-w-lg px-10 py-5 sm:pd-0 mx-auto mt-8 flex flex-col h-auto lg:h-[calc(100vh-16rem)] overflow-scroll">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">Deja tu comentario</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="mb-4">
                    <label htmlFor="title" className="block font-bold mb-1">
                        Título:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block font-bold mb-1">
                        Comentario:
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 h-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Califica nuestra Pagina Web hasta ahora:</label>
                    <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={`h-8 w-9 text-2xl cursor-pointer ${ratingWeb > index ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                onClick={() => setRatingWeb(index + 1)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-1">Califica nuestra comida:</label>
                    <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={`h-8 w-9 text-2xl  cursor-pointer ${ratingFood > index ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                onClick={() => setRatingFood(index + 1)}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-blue-800"><b>Nos importa tu Privacidad:</b> Tus comentarios no serán publicados en ningun lado y seran utilizados para unicamente mejorar nuestro servicio.</p>
                <button
                    type="submit"
                    className="bg-blue-800 text-white px-4 py-2 mt-5 text-lg rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Enviar comentario
                </button>
            </form>
        </div>
    );
};

export default NewComment;