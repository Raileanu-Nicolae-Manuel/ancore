import { queryOptions } from "@tanstack/react-query";
import api from "@/web/lib/api";

export const getSessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const response = await api.sessions.$get();
    const json = await response.json();
    if ("message" in json) {
      throw new Error(json.message);
    }
    return json;
  },
})