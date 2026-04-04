import { z } from 'zod';

export const RegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),

  email: z.string().email('Invalid email'),

  // ✅ optional at schema level
  otp: z
    .string()
    .optional()
    .or(z.literal('')),

  contact: z.string().min(10, 'Contact number is required'),

  referenceCode: z
    .string()
    .min(3, 'Reference code is required')
    .max(20, 'Reference code is too long')
    .regex(/^[A-Za-z0-9_-]+$/, 'Reference code can only contain letters, numbers, - or _'),
});
