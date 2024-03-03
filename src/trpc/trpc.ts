import { User } from "../payload-types"
import { ExperssContext } from "@/server"
import { TRPCError, initTRPC } from "@trpc/server"
import { PayloadRequest } from "payload/types"

const t = initTRPC.context<ExperssContext>().create()
const middleware = t.middleware
const isAuth = middleware(async ({ ctx, next }) => {
  const request = ctx.req as PayloadRequest

  const { user } = request as { user: User | null }
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      user,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
