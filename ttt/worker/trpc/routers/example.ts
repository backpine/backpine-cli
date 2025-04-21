import { t } from "@worker/trpc/trpc-instance";
import { z } from "zod";

export const exampleTrpcRoutes = t.router({
  info: t.procedure
    .input(z.object({ title: z.string() }))
    .query(({ input }) => {
      return {
        title: input.title,
        description: "Full-stack that lives on the edge",
      };
    }),
});
