import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async (req: NextRequest) => {
    const session = await getAuthSession();

    if (session) {
        try {
            if (session.user.isAdmin) {
                const orders = await prisma.orders.findMany();
                return new NextResponse(JSON.stringify(orders), { status: 200 });
            }
            const orders = await prisma.orders.findMany({
                where: {
                    userEmail : session.user.email! as string,
                },
            });
            return new NextResponse(JSON.stringify(orders), { status: 200 });
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong!" }),
                { status: 500 }
            );
        }
    } else {
        return new NextResponse(
            JSON.stringify({ message: "You are not authenticated!" }),
            { status: 401 }
        );
    }
};

// CREATE ORDER
export const POST = async (req: NextRequest) => {
    const session = await getAuthSession();

    if (session) {
        try {
            const body = await req.json();
            const orders = await prisma.orders.create({
                data: body,
            });
            return new NextResponse(JSON.stringify(orders), { status: 201 });
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong!" }),
                { status: 500 }
            );
        }
    } else {
        return new NextResponse(
            JSON.stringify({ message: "You are not authenticated!" }),
            { status: 401 }
        );
    }
};