import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn, constructMetadata } from "@/lib/utils"
import Navbar from "@/components/layout/navbar/Navbar"
import Providers from "@/components/Providers"
import { Toaster } from "sonner"

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
          <Providers>
            <Navbar />
            <div className="flex-1 flex-grow">{children}</div>
          </Providers>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
