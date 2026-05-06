// production-order.schema.ts
import {z} from "zod";

const optionalTrimmed = z.string().trim().nullable().optional();

export const productionOrderFormSchema = z.object({
  deliveryDateText: optionalTrimmed,
  observation: optionalTrimmed,
  color: optionalTrimmed,
});

export type ProductionOrderFormValues = z.infer<
  typeof productionOrderFormSchema
>;
