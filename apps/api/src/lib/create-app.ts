import type { Schema } from "hono";

import { OpenAPIHono, type Hook } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";

import type { AppBindings, AppOpenAPI } from "./types";
import { UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import {notFound, onError} from "stoker/middlewares";
import { auth } from "./auth";
import { cors } from "hono/cors";
import env from "@/api/env";

const defaultHook:Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json({
      success: result.success,
      error: {
        name: result.error.name,
        issues: result.error.issues,
      }
    }, UNPROCESSABLE_ENTITY);
  }
}

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(requestId())

  app.notFound(notFound);
  app.onError(onError);

  app.use(
	"*", // or replace with "*" to enable cors for all routes
    cors({
      origin: env.WEB_URL, // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );

  // TODO: this could be a problem with the open api specs
  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        c.set("user", null);
        c.set("session", null);
        // TODO: add the 401 response for most routes expect auth/*
        await next();
        return;
      }
      c.set("user", session.user);
      c.set("session", session.session);
      await next();
  });


  app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });
  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}