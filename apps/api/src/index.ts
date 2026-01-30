import configureOpenAPI from '@/api/lib/configure-open-api';
import { serve } from '@hono/node-server';
import env from "@/api/env";
import createApp from './lib/create-app';
import { sessionRouter } from './routes/sessions';
import type { AppOpenAPI } from '@/api/lib/types';

const app = createApp();

configureOpenAPI(app)

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", sessionRouter);
}

export const registeredApp = registerRoutes(app);

export type AppType = typeof registeredApp;

serve({
  fetch: registeredApp.fetch,
  port: env.PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
