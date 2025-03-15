import { z } from "zod";

export const donationSchema = z.object({
  campaignId: z.string().refine((val) => val.length === 24),
  amount: z.number(),
});

export const paymentSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .minValue(0),
  paymentMethod: z.string({
    required_error: "Payment method is required",
    invalid_type_error: "Payment method must be a string",
  }),
  transactionId: z.string({ required_error: "Transaction Id is required" }),
  status: z.string({ required_error: "Status is required" }),
  paymentId: z.string({ required_error: "Payment Id is required" }),
  orderId: z.string({ required_error: "Order Id is required" }),
});
