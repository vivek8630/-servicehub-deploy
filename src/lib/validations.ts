import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits').max(15).optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['CUSTOMER', 'PROVIDER']),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const providerProfileSchema = z.object({
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  experience: z.number().min(0).max(50).optional(),
  location: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  isEmergencyAvailable: z.boolean().optional(),
  atHomeService: z.boolean().optional(),
  onlineService: z.boolean().optional(),
  languages: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price must be positive'),
  priceType: z.enum(['fixed', 'hourly', 'starting_from']),
  estimatedDuration: z.number().min(15).max(480).optional(),
})

export const bookingSchema = z.object({
  serviceId: z.string().optional(),
  providerId: z.string().min(1, 'Provider is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().min(1, 'Time is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2).optional(),
  notes: z.string().max(500).optional(),
  estimatedPrice: z.number().min(0),
  paymentMethod: z.enum(['upi', 'card', 'cash']).optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  serviceQuality: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  valueForMoney: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000).optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProviderProfileInput = z.infer<typeof providerProfileSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
