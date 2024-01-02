"use client";

import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data: session, status } = useSession();
    const userEmail = session?.user.email as string;
    const [orders, setOrders] = React.useState<OrderType[]>([]);

    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            const fetchData = async () => {
                try {
                    const userEmail = session?.user.email as string;

                    const response = await fetch(`${apiUrl}/orders`, {
                        cache: "no-store"
                    });
                    if (!response.ok) {
                        throw new Error("Failed to fetch product");
                    }

                    const data: OrderType[] = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [status, router, session]);



    if (status === "loading") return "Loading...";

    return (
        <div className="p-4 lg:px-20 xl:px-40">
            <table className="w-full border-separate border-spacing-3">
                <thead>
                    <tr className="text-left">
                        <th className="hidden md:block">Order ID</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th className="hidden md:block">Products</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((item: OrderType) => (
                        <tr className={`${item.status !== "delivered" && "bg-blue-50"}`} key={item.id}>
                            <td className="hidden md:block py-6 px-1">{item.id}</td>
                            <td className="py-6 px-1">
                                {item.createdAt.toString().slice(0, 10)}
                            </td>
                            <td className="py-6 px-1">{item.price}</td>
                            <td className="hidden md:block py-6 px-1">
                                {item.products[0].title}
                            </td>
                            <td className="py-6 px-1">{item.status}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;