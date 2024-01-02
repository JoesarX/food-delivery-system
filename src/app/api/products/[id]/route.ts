import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/types/types";

// GET SINGLE PRODUCT
export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }) => {
        
    const { id } = params;
    try {
        const product = await prisma.product.findUnique({
            where: {
                //I need to give the id as a number, not as a string
                id: Number(id),
            },
        });

        return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};

// PUT/UPDATE SINGLE PRODUCT
export const PUT = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;
    const session = await getAuthSession();

    if (session?.user.isAdmin) {
        try {
            const body = await req.json(); 
            const updatedProduct = await prisma.product.update({
                where: {id: Number(id) },
                data: { ...body }, 
            });

            return new NextResponse(
                JSON.stringify(updatedProduct),
                { status: 200 }
            );
        } catch (err) {
            console.error(err);
            return new NextResponse(
                JSON.stringify({ message: 'Something went wrong!' }),
                { status: 500 }
            );
        }
    }

    return new NextResponse(
        JSON.stringify({ message: 'You are not allowed!' }),
        { status: 403 }
    );
};



// DELETE SINGLE PRODUCT
export const DELETE = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;
    const session = await getAuthSession();

    if (session?.user.isAdmin) {
        try {
            await prisma.product.delete({
                where: {
                    id: Number(id),
                },
            });

            return new NextResponse(JSON.stringify("Product has been deleted!"), {
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong!" }),
                { status: 500 }
            );
        }
    }
    return new NextResponse(JSON.stringify({ message: "You are not allowed!" }), {
        status: 403,
    });
};