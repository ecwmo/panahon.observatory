import { z } from 'zod'

export const Report = z.object({
  id: z.number(),
  title: z.string(),
  name: z.string(),
  number: z.number(),
  show: z.boolean().optional().default(true),
  coverImg: z.string(),
})

export const ReportImages = z.object({
  files: z.string().array(),
  staticFiles: z.string().array(),
})
