import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { QueryValidator } from "../../lib/validators/query-validator"
import { getPayloadClient } from "../../get-payload"

export const productsRouter = router({
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        // last element that render
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input
      const { sort, limit, ...queryOpt } = query

      //   We construct a type for our dictionary
      const parsedQueryOpts: Record<string, { equals: string }> = {}

      //   We convert the ..queryOpt into a valid syntax that CMS can understand
      Object.entries(queryOpt).forEach(([key, value]) => {
        parsedQueryOpts[key] = { equals: value }
      })

      const payload = await getPayloadClient()
      const page = cursor || 1

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
        },
        sort,
        depth: 1,
        limit,
        page,
      })
      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
})
