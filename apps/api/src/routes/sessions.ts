import { createRouter } from "@/api/lib/create-app";
import type { AppRouteHandler } from "@/api/lib/types";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const getSession = createRoute({
    tags: ["sessions"],
    method: "get",
    path: "/sessions",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
          z.object({
            session: z.object({
              id: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              userId: z.string(),
              expiresAt: z.date(),
              token: z.string(),
              ipAddress: z.string().nullable().optional(),
              userAgent: z.string().nullable().optional(),
            }),
            user: z.object({
              id: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              email: z.email(),
              emailVerified: z.boolean(),
              name: z.string(),
              image: z.string().nullable().optional(),
            }),
          }),
        "Session api response"
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        createMessageObjectSchema("Unauthorized"),
        "Unauthorized response"
      ),
    }
});

export const getSessionHandler: AppRouteHandler<typeof getSession> = (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({message:"Unauthorized"}, HttpStatusCodes.UNAUTHORIZED);
  }
  return c.json({session, user}, HttpStatusCodes.OK);
}

export const sessionRouter = createRouter().openapi(getSession,getSessionHandler);