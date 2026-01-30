import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/api/db";
import env from "@/api/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    advanced: {
        database: {
            generateId: false, // "serial" for auto-incrementing numeric IDs
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET!,
    trustedOrigins: [env.WEB_URL!, env.BETTER_AUTH_URL!, "http://localhost:3000"],
});