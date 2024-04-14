import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL COMMENTS
export const GET = async (req: NextRequest) => {
    const session = await getAuthSession();

    if (session) {
        try {
            if (session.user.isAdmin) {
                const comment = await prisma.comment.findMany();
                return new NextResponse(JSON.stringify(comment), { status: 200 });
            }
            const comment = await prisma.comment.findMany();
            const response = new NextResponse(JSON.stringify(comment), { status: 200 });
            response.headers.set("Cache-Control", "no-store");
            return response;
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
            const comment = await prisma.comment.create({
                data: body,
            });
            return new NextResponse(JSON.stringify(comment), { status: 201 });
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