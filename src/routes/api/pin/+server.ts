import { prisma } from "$lib/prisma";

export async function GET() {

    try {
        const pins = await prisma.pin.findMany();
        return new Response(JSON.stringify({message: "success", response: pins}))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}