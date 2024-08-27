import { z } from 'zod';

export const SignupValidationSchema = z.object({
    name: z.string().min(2, { message: 'Too short name!' }),
    username: z.string().min(2, { message: 'Too short username.' }),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 9 characters' }),
});

export type SignupValidationSchemaType = z.infer<typeof SignupValidationSchema>;

export const SigninValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 9 characters' }),
});

export type SigninValidationSchemaType = z.infer<typeof SigninValidationSchema>;

export const PostValidationSchema = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
});

export type PostValidationSchemaType = z.infer<typeof PostValidationSchema>;
