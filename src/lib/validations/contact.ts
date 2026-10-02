import { z } from "zod";

export const contactMessageSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(7, { message: "Please provide a valid phone number." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactMessageFormData = z.infer<typeof contactMessageSchema>;
