"use client"

import { toast } from "sonner"
import { buttonVariants } from "@/components/ui/Button"
import { Icons } from "@/constants/Icons"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { FC } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { ZodError } from "zod"
import { useRouter, useSearchParams } from "next/navigation"

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSeller = searchParams.get("as") === "seller"
  const origin = searchParams.get("origin")
  const form = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const continueAsSeller = () => {
    router.push("?as=seller")
  }

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined)
  }

  const { mutate: signIn, isPending } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED")
        toast.error("Invalid email or password")
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
      }
    },
    onSuccess: ({}) => {
      toast.success("Signed in successfully")
      router.refresh()
      if (origin) {
        router.push(`/${origin}`)
        return
      }
      if (isSeller) {
        router.push("/seller")
        return
      }
      router.push("/")
    },
  })
  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // Send Data to server using TRPC
    signIn({ email, password })
  }

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your {isSeller ? "seller" : ""} account
          </h1>
          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-up"
          >
            Don&apos;t have an account?
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={cn({
                          "focus-visible:ring-red-500":
                            form.formState.errors.email,
                        })}
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className={cn({
                          "focus-visible:ring-red-500":
                            form.formState.errors.password,
                        })}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isPending ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="relative my-2">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {isSeller ? (
        <Button
          onClick={continueAsBuyer}
          variant="secondary"
          disabled={isPending}
        >
          Continue as customer
        </Button>
      ) : (
        <Button
          onClick={continueAsSeller}
          variant="secondary"
          disabled={isPending}
        >
          Continue as seller
        </Button>
      )}
    </div>
  )
}

export default Page
