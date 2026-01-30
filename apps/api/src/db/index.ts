import { drizzle } from "drizzle-orm/node-postgres";

import env from "@/api/env";
import { schema } from "@/api/db/schema";

const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL!,
  },
  schema
});

export default db;