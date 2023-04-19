import { z } from 'zod'

import { Report as ReportSchema } from '@/schemas/report'

export type Report = z.infer<typeof ReportSchema>
