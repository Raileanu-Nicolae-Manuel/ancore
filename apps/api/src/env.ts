import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'node:path';
import { z } from 'zod';

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  )
}));

const EnvSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  PG_PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  WEB_URL: z.url(),
});

export type env = z.infer<typeof EnvSchema>;

const {data: env, error} = EnvSchema.safeParse(process.env);

if (error) {
  console.error('❌ Invalid environment variables:', z.treeifyError(error).errors);
  console.error(JSON.stringify(z.treeifyError(error).errors, null, 2));
  process.exit(1);
}

export default env!;