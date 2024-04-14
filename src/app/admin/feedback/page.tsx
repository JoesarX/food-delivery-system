"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

interface Comment {
    id: string;
    createdAt: string;
    userEmail: string;
    title: string;
    comment: string;
    ratingWeb: number;
    ratingFood: number;
}

const AdminComments = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const commentsPerPage = 10;
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [sortBy, setSortBy] = useState<"createdAt" | "ratingWeb" | "ratingFood">("createdAt");

    useEffect(() => {
        if (status === "unauthenticated" || !session?.user.isAdmin) {
            //redirect("/");
            console.log("saca")
        } else {
            fetchComments();
        }
    }, [status, session]);

    const fetchComments = async () => {
        try {
            const res = await fetch("/api/comments");
            const data = await res.json();
            setComments(data);
            setFilteredComments(sortComments(data));
            setTotalPages(Math.ceil(data.length / commentsPerPage));
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error al cargar los comentarios.");
        }
    };

    const sortComments = (comments: Comment[]) => {
        return comments.sort((a, b) => {
            let result = 0;
            if (sortBy === "createdAt") {
                result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === "ratingWeb") {
                result = a.ratingWeb - b.ratingWeb;
            } else if (sortBy === "ratingFood") {
                result = a.ratingFood - b.ratingFood;
            }
            return sortOrder === "asc" ? result : -result;
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = comments.filter(
            (comment) =>
                comment.title.toLowerCase().includes(value) ||
                comment.comment.toLowerCase().includes(value) ||
                comment.userEmail.toLowerCase().includes(value)
        );
        setFilteredComments(sortComments(filtered));
        setCurrentPage(1);
        setTotalPages(Math.ceil(filtered.length / commentsPerPage));
    };

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber === 0) {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(pageNumber);
        }
    };

    const handleSortChange = (sortBy: "createdAt" | "ratingWeb" | "ratingFood") => {
        setSortBy(sortBy);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        setFilteredComments(sortComments(filteredComments));
    };

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Administrar Comentarios</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por título, comentario o correo electrónico"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <span className="font-bold mr-2">Ordenar por:</span>
                    <button
                        className={`px-2 py-1 rounded-md ${sortBy === "createdAt" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            } mr-2`}
                        onClick={() => handleSortChange("createdAt")}
                    >
                        Fecha {sortBy === "createdAt" && sortOrder === "asc" ? "▲" : "▼"}
                    </button>
                    <button
                        className={`px-2 py-1 rounded-md ${sortBy === "ratingWeb" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            } mr-2`}
                        onClick={() => handleSortChange("ratingWeb")}
                    >
                        Calificación Web {sortBy === "ratingWeb" && sortOrder === "asc" ? "▲" : "▼"}
                    </button>
                    <button
                        className={`px-2 py-1 rounded-md ${sortBy === "ratingFood" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => handleSortChange("ratingFood")}
                    >
                        Calificación Comida {sortBy === "ratingFood" && sortOrder === "asc" ? "▲" : "▼"}
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                {currentComments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg shadow-md mb-4">
                        <div className="px-4 py-2 border-b">
                            <span className="font-bold mr-2">{comment.title}</span>
                            <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="px-4 py-2">
                            <p className="mb-2">{comment.comment}</p>
                            <div className="flex items-center">
                                <span className="font-bold mr-2">Calificación Web:</span>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span
                                        key={index}
                                        className={`inline-block h-4 w-4 rounded-full mx-1 ${comment.ratingWeb > index ? "bg-yellow-500" : "bg-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold mr-2">Calificación Comida:</span>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span
                                        key={index}
                                        className={`inline-block h-4 w-4 rounded-full mx-1 ${comment.ratingFood > index ? "bg-yellow-500" : "bg-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-500">Enviado por: {comment.userEmail}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 mb-10 flex justify-center">
                <nav aria-label="Pagination">
                    <ul className="flex space-x-2">
                        <li>
                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === 1
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            >
                                {"<<"}
                            </button>
                        </li>
                        <li>
                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === 1
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>
                        </li>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                            const pageNumber =
                                currentPage <= 3
                                    ? index + 1
                                    : totalPages - 4 <= currentPage
                                        ? totalPages - 4 + index
                                        : currentPage - 2 + index;
                            return (
                                <li key={index}>
                                    <button
                                        className={`px-3 py-2 rounded-md ${currentPage === pageNumber
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                </li>
                            );
                        })}
                        <li>
                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === totalPages
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {">"}
                            </button>
                        </li>
                        <li>
                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === totalPages
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                {">>"}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default AdminComments;