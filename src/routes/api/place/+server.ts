import { prisma } from '$lib/prisma.js';

export async function GET({url}) {

    try {
        
        const search = url.searchParams.get('search') || "";
        const response = await prisma.place.findMany({
            where: {
                OR: [
                    { placeName: { startsWith: search }}
                ]
            },
            orderBy: {
                placeName: "asc"
            }
        })

        return new Response(JSON.stringify({message: "success", response}))

    } catch (error) {
        
    }
}