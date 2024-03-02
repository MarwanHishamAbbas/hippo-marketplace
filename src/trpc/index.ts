import { authRouter } from "./routers/auth-router"
import { productsRouter } from "./routers/products-router"
import { router } from "./trpc"

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
})

export type AppRouter = typeof appRouter
