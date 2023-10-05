import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL PRODUCTS
export const GET = async (req: NextRequest) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                isVisible: true,
            },
            orderBy: [
            {
                catSlug: "asc",
            },
            {
                title: "asc",
            },
        ]
        });
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Algo salio mal con el fetch de los productos!" }),
            { status: 500 }
        );
    }
};
