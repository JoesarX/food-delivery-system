import { put } from '@vercel/blob';
import { del } from '@vercel/blob';
import { head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getAuthSession } from "@/utils/auth";

export async function GET(request: Request) {
    const session = await getAuthSession();
    if (session?.user.isAdmin) {
        try {
            const { searchParams } = new URL(request.url);
            const blobUrl = searchParams.get('url');
            let blobDetails;
            if (blobUrl) {
                blobDetails = await head(blobUrl);
            }
            return Response.json(blobDetails);
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong getting your image metadata!" }),
                { status: 500 }
            );
        }
    }
    return new NextResponse(
        JSON.stringify({ message: 'You are not allowed!' }),
        { status: 403 }
    );
}

export async function POST(request: Request): Promise<NextResponse> {
    const session = await getAuthSession();
    if (session?.user.isAdmin) {
        try {
            const { searchParams } = new URL(request.url);
            const filename = searchParams.get('filename');

            let blob;
            if (filename && request.body) {
                blob = await put(filename, request.body, {
                    access: 'public',
                });
            }
            return NextResponse.json(blob);
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong posting your image!" }),
                { status: 500 }
            );
        }
    }
    return new NextResponse(
        JSON.stringify({ message: 'You are not allowed!' }),
        { status: 403 }
    );
}

// this function the url blob and uploads a new one and returns the new blob
export async function PUT(request: Request): Promise<NextResponse> {
    const session = await getAuthSession();
    if (session?.user.isAdmin) {
        try {
            const { searchParams } = new URL(request.url);
            const urlToReplace = searchParams.get('url') as string;
            const filename = searchParams.get('filename');
            let blob;
            if (filename && request.body) {
                blob = await put(filename, request.body, {
                    access: 'public',
                });
            }
            await del(urlToReplace);
            return NextResponse.json(blob);
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong getting your image metadata!" }),
                { status: 500 }
            );
        }
    }
    return new NextResponse(
        JSON.stringify({ message: 'You are not allowed!' }),
        { status: 403 }
    );
}


export async function DELETE(request: Request) {
    const session = await getAuthSession();
    if (session?.user.isAdmin) {
        try {
            const { searchParams } = new URL(request.url);
            const urlToDelete = searchParams.get('url') as string;
            await del(urlToDelete);

            return new Response();
        } catch (err) {
            console.log(err);
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong getting your image metadata!" }),
                { status: 500 }
            );
        }
    }
    return new NextResponse(
        JSON.stringify({ message: 'You are not allowed!' }),
        { status: 403 }
    );
}