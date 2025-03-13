import { z } from "zod";

const adressType = ["Campaign", "Donor"];

export const adressSchema = z.object({
  street: z
    .string({ required_error: "Street must be a string" })
    .min(3, { message: "Street must be at least 3 characters" }),
  city: z
    .string({ required_error: "City must be a string" })
    .min(3, { message: "City must be at least 3 characters" }),
  state: z
    .string({ required_error: "State must be a string" })
    .min(3, { message: "State must be at least 3 characters" }),
  pinCode: z.coerce.number({ required_error: "Pin Code must be a number" }),
  // .refine((val) => /^[1-9][0-9]{6}$/.test(val), {
  //   message: "Invalid pincode",
  // })
  country: z
    .string({ required_error: "Country must be a string" })
    .min(3, { message: "Country must be at least 3 characters" }),
  adressType: z.enum(adressType, {
    required_error: "Adress type must be from the list",
  }),
});
