import 'dotenv/config'

import { z } from 'zod'

import { logger } from '@/logger'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  SENTRY_DNS: z.string().url(),
})

const env = envSchema.safeParse(process.env)

if (env.success === false) {
  logger.error('Invalid environment variables.', env.error.format())
  throw new Error('Invalid environment variables.')
}

export const ENV = env.data
