import { z } from 'zod'

export const Auth = z.object({
  valid: z.boolean(),
  username: z.string(),
  isLoggedIn: z.boolean().optional(),
  err: z
    .object({
      type: z.enum(['login', 'logout']),
    })
    .optional(),
})
