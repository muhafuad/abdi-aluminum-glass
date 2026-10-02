import { z } from "zod";

export const quoteRequestSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(7, { message: "Please provide a valid phone number." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  project_type: z.string().min(1, { message: "Please select a project type." }),
  location: z
    .string()
    .min(2, { message: "Please provide project location or site area." }),
  project_size: z.string().min(2, {
    message:
      "Please indicate estimated scope or size (e.g. 50 sqm, 10 windows).",
  }),
  preferred_contact_method: z.enum(["phone", "email", "whatsapp"] as const),
  message: z.string().min(10, {
    message:
      "Please provide at least 10 characters describing your requirements.",
  }),
  attachment_url: z.string().optional(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
