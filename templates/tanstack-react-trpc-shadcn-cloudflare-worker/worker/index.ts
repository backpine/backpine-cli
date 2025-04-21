import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

export default {
  fetch(request, env, ctx) {
    return fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: appRouter,
      createContext: () =>
        createContext({ req: request, env: env, workerCtx: ctx }),
    });
  },
} satisfies ExportedHandler<ServiceBindings>;
