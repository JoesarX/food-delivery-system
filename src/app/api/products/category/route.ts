import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//* FETCH ALL PRODUCTS BY CATEGORY
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat") || "";


    try {
        const products = await prisma.product.findMany({
            where: {
                catSlug: cat,
                isVisible: true,
            },
            orderBy: [
                {
                    title: "asc",
                },
            ]
        });
        const response = new NextResponse(JSON.stringify(products), { status: 200 });
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};