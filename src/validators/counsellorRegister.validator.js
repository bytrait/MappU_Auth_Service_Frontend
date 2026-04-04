import { z } from 'zod';

export const CounsellorRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),

  email: z.string().email('Invalid email'),

  otp: z.string().optional().or(z.literal('')),

  contact: z.string().min(10, 'Contact number is required'),
});