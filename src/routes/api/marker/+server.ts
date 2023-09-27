import { prisma } from "$lib/prisma";

export async function GET({url}) {

    const placeParam = url.searchParams.get('placeId');
    const condition = placeParam ? +placeParam ? {placeId: +placeParam} : {} : {};

    console.log(condition);
    

    const locations = await prisma.location.findMany({
        select: {
            lat: true,
            lng: true,
            pinId: true,
            pin: true
        },
        where: condition,
    });
    return new Response(JSON.stringify({response: locations}));
}