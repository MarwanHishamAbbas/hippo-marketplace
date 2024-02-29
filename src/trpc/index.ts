import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  anyApiRouter: publicProcedure.query(() => {
    return "Hello"
  }),
})

export type AppRouter = typeof appRouter
