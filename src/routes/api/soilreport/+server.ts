import { prisma } from '$lib/prisma.js';
import { LatLngSchema, SoilReportSchema, type SoilData, PlaceSchema} from '$lib/validators/SoilData.js';
import type { Place } from '@prisma/client';


export async function POST(e) {

    try {

        const body = await e.request.json();

        if(!body.position) {
            throw new Error("Position required")
        }
        if(!body.report) {
            throw new Error("report required")
        }

        const positionParse = LatLngSchema.safeParse(body.position);
        if(!positionParse.success) {
            throw new Error("Invalid position format");
        }

        const placeParse = PlaceSchema.safeParse(body.place);
        if(!placeParse.success) {
            throw new Error("Invalid position format");
        }

        const reportParse = SoilReportSchema.safeParse(body.report);
        if(!(reportParse.success && reportParse.data.length)) {
            throw new Error("Invalid report format");
        }

        let {lat, lng, pinId} = positionParse.data;
        pinId = pinId !== undefined ? pinId : "0000ff"; // TO change to zero

        lat = roundNumber(lat, 6);
        lng = roundNumber(lng, 6);

        const {placeId, placeName} = placeParse.data;

        let place = await prisma.place.upsert({
            where: {
                placeName
            },
            create: {
                placeName
            },
            update: {
                placeName
            }
        });

        console.log(pinId);
        
        const postionSave = await prisma.location.upsert({
            where: {
                lat_lng: {
                    lat, lng
                }
            },
            create: {
                lat,lng,
                placeId: place.placeId,
                pinId: pinId
            },
            update: {
                pinId
            }
        })


        //let place:Place|null = placeParse.data;
        // if(place.placeId === 0) {
        //     const current = await prisma.place.findFirst({where : {placeName: place.placeName}});
        //     if(!current)
        //         place = await prisma.place.create({data: {placeName: place.placeName}})
        //     else
        //         place = current;
        // } else {
        //     place = await prisma.place.findFirst({where : {placeName: place.placeName}});
        //     if(!place)
        //         throw new Error("Place not found");
        // }
        //const {lat,lng,pinId} = positionParse.data;
        // const position = {lat: roundNumber(lat, 6), lng: roundNumber(lng, 6), placeId: place.placeId};        
        // let pos = await prisma.location.findFirst({where:position});
        // if(!pos) {
        //     pos = await prisma.location.create({
        //         data: {...position, pinId}
        //     })
        // }
        // const {locationId} = pos;

        const newData: SoilData[] = [];
        const rmData: SoilData[] = [];

        reportParse.data.forEach(val => {
            if(val.status == undefined) {
                newData.push(val);
                return;
            }
            if(val.status == false && val.locationId) {
                rmData.push(val);
            }
        })

        const rmCondition = rmData.map( ({locationId, depth}) => ({ locationId, depth }));

        if(rmCondition.length) {
         await prisma.soilType.deleteMany({
             where: {
                 AND: rmCondition
             } 
         })
        }

        const response = await prisma.soilType.createMany({
            data: newData.map( ({type, depth})=> ({type, depth, locationId: postionSave.locationId}) )
        });
        
        return new Response(JSON.stringify({message:"success"}));

    } catch (error:any) {
        console.log(error);
        return new Response(error.message);
    }
}

export async function GET(e) {

    const lat = e.url.searchParams.get('lat');
    const lng = e.url.searchParams.get('lng');

    if(!(lat && lng)) {
        throw new Error("positions required");
    }

    const location  = await prisma.location.findFirst({
        where: {
            lat, lng
        },
        include: {
            place: true,
            pin: true
        }
    })
    const report = await prisma.soilType.findMany({
        where: {
            location: {lat, lng}
        },
        orderBy: {
            depth: "asc"
        }
    });

    return new Response(JSON.stringify({message:"success", response: {location, report}}));
}

function roundNumber(num:number , dec: number) {
    return Math.round( num * Math.pow(10, dec))/ Math.pow(10, dec);
}