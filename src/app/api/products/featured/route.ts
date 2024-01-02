import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL PRODUCTS
export const GET = async (req: NextRequest) => {
    try {
        const products = await prisma.$queryRaw`
            SELECT * 
            FROM product 
            WHERE isFeatured = true AND isVisible = true 
            ORDER BY 
                CASE 
                    WHEN catSlug = 'Comida' THEN 1
                    WHEN catSlug = 'Bebida' THEN 2
                    WHEN catSlug = 'Otros' THEN 3
                    ELSE 4
                END,
                title ASC
        `;
        
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Algo salio mal con el fetch de los productos!" }),
            { status: 500 }
        );
    }
};
