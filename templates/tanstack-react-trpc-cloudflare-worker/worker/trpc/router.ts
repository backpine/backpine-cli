import { t } from "@worker/trpc/trpc-instance";
import { exampleTrpcRoutes } from "./routers/example";

export const appRouter = t.router({
  exampleTrpc: exampleTrpcRoutes,
});

export type AppRouter = typeof appRouter;
