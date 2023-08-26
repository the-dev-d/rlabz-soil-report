import { z } from "zod";

export const SoilReportSchema = z.object({
    depth: z.coerce.number(),
    type: z.coerce.number()
})

export type SoilReport = z.infer<typeof SoilReportSchema>;