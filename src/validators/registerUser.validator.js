import { z } from 'zod';

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

    referenceCode: z
      .string()
      .min(6, 'Reference code must be 6 characters')
      .max(6, 'Reference code must be 6 characters')
      .regex(
        /^[A-Za-z0-9]+$/,
        'Reference code can only contain letters and numbers'
      ),

    registrationType: z
      .enum(['INDIVIDUAL', 'SCHOOL'])
      .optional(),

    selectedSchoolId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.otp || data.otp.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otp'],
        message: 'OTP is required',
      });
    }

    if (!data.registrationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registrationType'],
        message: 'Please select registration type',
      });
    }

    if (
      data.registrationType === 'SCHOOL' &&
      (!data.selectedSchoolId ||
        data.selectedSchoolId.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['selectedSchoolId'],
        message: 'Please select a school option',
      });
    }
  });