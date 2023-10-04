import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//! DEPRECATED: Old way of fetching products by category or featured
//! Was before at /api/products/route.ts, however it was replaced by an unfiltered fetch and a filtered for featured

// FETCH ALL PRODUCTS
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");

    try {
        const products = await prisma.product.findMany({
            where: {
                ...(cat ? { catSlug: cat } : { isFeatured: true }),
            },
        });
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};