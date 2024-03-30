import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL PRODUCTS
export const GET = async (req: NextRequest) => {
    try {
        const products = await prisma.$queryRaw`
            SELECT * 
            FROM "Product" 
            WHERE "Product"."isFeatured" = true AND "Product"."isVisible" = true 
            ORDER BY 
                CASE 
                    WHEN "Product"."catSlug" = 'Comida' THEN 1
                    WHEN "Product"."catSlug" = 'Bebida' THEN 2
                    WHEN "Product"."catSlug" = 'Otros' THEN 3
                    ELSE 4
                END,
                "Product"."title" ASC;

        `;
        const response = new NextResponse(JSON.stringify(products), { status: 200 });
        response.headers.set("Cache-Control", "no-store");
        return response;

    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Algo salio mal con el fetch de los productos!" }),
            { status: 500 }
        );
    }
};
