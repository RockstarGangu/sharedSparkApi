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

const validationProofTypeOptions = [
  "AdharCard",
  "Passport",
  "PanNumber",
  "NGOCertificationNumber",
  "SEBICertificationNumber",
  "Other",
];



export const campaignSchema = z.object({
  campaignName: z
    .string({ required_error: "Campaign name must be a string" })
    .min(3, { message: "Campaign name must be at least 3 characters" }),
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
  // adress: adressSchema,
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
  popularityScore: z
    .number({ required_error: "popularity score has to be a number" })
    .default(0),
});
