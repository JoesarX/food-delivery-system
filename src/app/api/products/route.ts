import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL PRODUCTS
export const GET = async (req: NextRequest) => {
    try {
        const products = await prisma.product.findMany();
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Algo salio mal con el fetch de los productos!" }),
            { status: 500 }
        );
    }
};
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const product = await prisma.product.create({
            data: body,
        });
        return new NextResponse(JSON.stringify(product), { status: 201 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};