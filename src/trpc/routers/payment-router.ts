import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { getPayloadClient } from "../../get-payload"
import { stripe } from "../../lib/stripe"
import Stripe from "stripe"

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      // We are gonna modify it
      let { productIds } = input
      if (productIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST" })

      const payload = await getPayloadClient()
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      })

      const filteredProducts = products.filter((product) =>
        Boolean(product.priceId)
      )

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((product) => product.id),
          user: user.id,
        },
      })

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      line_items.push({
        price: "price_1Oq2dhJwEiD6HFARDKitUrEY",
        quantity: 1,
        adjustable_quantity: { enabled: false },
      })

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        })
      })
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["paypal", "card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        })
        return { url: stripeSession.url }
      } catch (error) {
        console.log(error)
        return { url: null }
      }
    }),
})
