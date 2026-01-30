import * as authSchema from "./auth-schema";

export const schema = {
  ...authSchema,
};

export type Schema = typeof schema;