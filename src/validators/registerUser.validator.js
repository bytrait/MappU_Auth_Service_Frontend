import { z } from 'zod';

/** Shared OTP registration fields (institution flows). */
export const RegistrationSchema = z
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

    referenceCode: z.string().optional(),
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
