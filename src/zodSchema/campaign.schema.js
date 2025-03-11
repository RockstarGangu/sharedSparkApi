import { z } from "zod";

const STATUS_OPTIONS = ["Active", "Inactive", "Completed"];
const FLAGS_OPTIONS = ["Approved", "Rejected", "Reviewing"];
const CATEGORY_OPTIONS = [
  "Social",
  "Environment",
  "Education",
  "Health",
  "Animal",
  "Sports",
  "Entertainment",
  "Other",
];
const adressType = ["Campaign", "Donor"];
const validationProofTypeOptions = [
  "AdharCard",
  "Passport",
  "PanNumber",
  "NGOCertificationNumber",
  "SEBICertificationNumber",
  "Other",
];

const adressSchema = z.object({
  street: z
    .string({ required_error: "Street must be a string" })
    .min(3, { message: "Street must be at least 3 characters" }),
  city: z
    .string({ required_error: "City must be a string" })
    .min(3, { message: "City must be at least 3 characters" }),
  state: z
    .string({ required_error: "State must be a string" })
    .min(3, { message: "State must be at least 3 characters" }),
  pinCode: z
    .number({ required_error: "Pin Code must be a number" })
    .refine((val) => /^[1-9][0-9]{5}$/.test(val), {
      message: "Invalid pincode",
    }),
  country: z
    .string({ required_error: "Country must be a string" })
    .min(3, { message: "Country must be at least 3 characters" }),
  adressType: z.enum(adressType, {
    required_error: "Adress type must be from the list",
  }),
});

export const campaignSchema = z.object({
  title: z
    .string({ required_error: "Title must be a string" })
    .min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string({ required_error: "Description must be a string" })
    .min(3, { message: "Description must be at least 3 characters" }),
  startDate: z.date(),
  deadline: z.date(),
  status: z.enum(STATUS_OPTIONS, {
    required_error: "Status must be from the list",
  }),
  host: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
  members: z
    .string()
    .array()
    .optional()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    }),
  adress: adressSchema,
  location: z
    .object({
      coordinates: z
        .array(z.number())
        .length(2, { message: "Coordinates must be [longitude, latitude]" })
        .optional(),
    })
    .optional(),
  validationProofType: z.enum(validationProofTypeOptions, {
    required_error: "Validation proof type must be from the list",
  }),
  validationProofNumber: z
    .string({ required_error: "Validation proof number must be a string" })
    .min(3, {
      message: "Validation proof number must be at least 3 characters",
    }),
  targetFunds: z.string().default(0),
  targetReach: z.string().default(0),
  sponsors: z.string().array().optional(),
  flags: z.enum(FLAGS_OPTIONS).optional(),
  category: z.enum(CATEGORY_OPTIONS, {
    required_error: "Category must be from the list",
  }),
  media: z.string().array().optional(),
  donors: z
    .string()
    .array()
    .optional()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    }),
  shares: z.number().default(0),
  likes: z
    .string()
    .array()
    .optional()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    }),
  comments: z
    .string()
    .array()
    .optional()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    }),
});
