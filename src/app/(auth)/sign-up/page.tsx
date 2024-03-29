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
import { useRouter } from "next/navigation"

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const router = useRouter()
  const form = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isPending } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT")
        toast.error("This email is already in use")
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
      }
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}`)
      router.push("/verify-email?to=" + sentToEmail)
    },
  })
  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // Send Data to server using TRPC
    mutate({ email, password })
  }

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-in"
          >
            Already have an account? Sign-in
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
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Page
