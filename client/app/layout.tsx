import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { ReduxProvider } from "./providers" 

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI NOTE",
  description: "Created with AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* Wrap children with the ReduxProvider Client Component */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
        
        <Toaster
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "20px",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}