import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "COUNSELLOR"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const journalSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  mood: z.string().min(2)
});
