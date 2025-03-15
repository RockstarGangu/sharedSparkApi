import { z } from "zod";

const passwordRegex =
  /^(?=.*)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6}$/;

export const userSchema = z.object({
  firstName: z
    .string({ required_error: "First name must be a string" })
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string({ required_error: "Last name must be a string" })
    .min(3, { message: "Last name must be at least 3 characters" }),
  email: z
    .string({ required_error: "Email must be a string" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .refine((val) => passwordRegex.test(val), {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  contactNumber: z.coerce
    .number({ required_error: "Contact number must be a number" })
    // .refine((val) => /^[1-9][0-9]{10}$/.test(val), {
    //   message: "Invalid contact number",
    // })
    ,
  occupation: z
    .string({ required_error: "Occupation must be a string" })
    .min(3, { message: "Occupation must be at least 3 characters" }),
  location: z
    .object({
      coordinates: z
        .array(z.number())
        .length(2, { message: "Coordinates must be [longitude, latitude]" })
        .optional(),
    })
    .optional(),
  isVerified: z.boolean().default(false),
  refreshToken: z.string().optional(),
  campaignHosted: z
    .string()
    .array()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    })
    .optional(),
  donation: z
    .string()
    .array()

    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    })
    .optional(),
  avatar: z.string().url().optional(),
});


export const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email must be a string" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .refine((val) => passwordRegex.test(val), {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

export const updateUserSchema = z.object({
  firstName: z
    .string({ required_error: "First name must be a string" })
    .min(3, { message: "First name must be at least 3 characters" })
    .optional(),
  lastName: z
    .string({ required_error: "Last name must be a string" })
    .min(3, { message: "Last name must be at least 3 characters" })
    .optional(),
  email: z
    .string({ required_error: "Email must be a string" })
    .email({ message: "Invalid email address" })
    .optional(),
  contactNumber: z.coerce
    .number({ required_error: "Contact number must be a number" })
    // .refine((val) => /^[1-9][0-9]{10}$/.test(val), {
    //   message: "Invalid contact number",
    // })
    .optional(),
  occupation: z
    .string({ required_error: "Occupation must be a string" })
    .min(3, { message: "Occupation must be at least 3 characters" })
    .optional(),
  location: z
    .object({
      coordinates: z
        .array(z.number())
        .length(2, { message: "Coordinates must be [longitude, latitude]" })
        .optional(),
    })
    .optional(),
  avatar: z.string().url().optional(),
});