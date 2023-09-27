import { z } from "zod";

export const PlaceSchema = z.object({
    placeId: z.coerce.number().default(0),
    placeName: z.coerce.string(),
    pin: z.any().optional()
})

export const SoilDataSchema = z.object({
    locationId: z.number().optional(),
    depth: z.coerce.number(),
    type: z.coerce.number(),
    status: z.boolean().optional()
})

export type Pins = {
    colorCode: string,
    mark: string,
    pin: string
}

export type SoilData = z.infer<typeof SoilDataSchema>;
export type Place = z.infer<typeof PlaceSchema>;

export const LatLngSchema = z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    pinId: z.coerce.string()
})

export type LatLng = z.infer<typeof LatLngSchema>;

export const SoilReportSchema = z.array(SoilDataSchema);
