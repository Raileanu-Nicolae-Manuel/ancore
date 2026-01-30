import type { AppType } from "@ancore/api/app";
import { hc } from "hono/client";

const client = hc<AppType>("", {
  init:{
    credentials: "include",
  }
});
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};