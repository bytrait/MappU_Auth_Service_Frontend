import { z } from 'zod';

export const StudentRegistrationSchema = z
  .object({
    fullName: z.string().min(2, 'Name is required'),

    email: z.string().email('Invalid email'),

    otp: z
      .string()
      .optional()
      .or(z.literal('')),

    contact: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a valid 10 digit mobile number'
      ),

    referenceCode: z
      .string()
      .min(4, 'Reference code must be at least 4 characters')
      .max(20, 'Reference code must be at most 20 characters')
      .regex(
        /^[A-Za-z0-9]+$/,
        'Reference code can only contain letters and numbers'
      )
      .transform((v) => v.trim().toUpperCase()),
  })
  .superRefine((data, ctx) => {
    if (!data.otp || data.otp.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otp'],
        message: 'OTP is required',
      });
    }
  });
