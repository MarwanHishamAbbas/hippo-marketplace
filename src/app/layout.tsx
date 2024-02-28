import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn, constructMetadata } from "@/lib/utils"
import Navbar from "@/components/layout/navbar/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn("relative h-full font-sans antialiased", inter.className)}
      >
        <main className="min-h-screen relative flex flex-col">
          <Navbar />
          <div className="flex-1 flex-grow">{children}</div>
        </main>
      </body>
    </html>
  )
}
