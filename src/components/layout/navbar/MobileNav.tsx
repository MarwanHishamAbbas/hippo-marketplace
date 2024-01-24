"use client"

import { buttonVariants } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu"
import { Menu } from "lucide-react"
import Link from "next/link"
import { FC } from "react"

interface MobileNavProps {}

const MobileNav: FC<MobileNavProps> = ({}) => {
  const user = {}
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild>
        <div className="flex flex-col mr-10 p-3">
          {user ? null : (
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Sign in
            </Link>
          )}

          {user ? (
            <h1>Hello, Marwan</h1>
          ) : (
            <Link href="/sign-up" className={buttonVariants({})}>
              Create account
            </Link>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileNav
