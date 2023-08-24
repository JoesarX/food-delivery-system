import { NextResponse } from "next/server"
import { prisma } from '@/utils/connect'

// FETCH ALL CATEGORIES
export const GET = async() =>{
    try {
        const categories = await prisma.category.findMany()
        return new NextResponse(JSON.stringify(categories),{status:200})
    } catch (error) {
        console.log("Error in Categories Fetch:",error) 
        return new NextResponse(JSON.stringify({message:"Something went wrong with Categories Fetch"}),{status:500})
    }
}