import type React from "react"
import "@/styles/globals.css"
import { Inter, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
// ThemeProvider removed; site locked to light mode

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CEF - AI Agent Platform | 2025",
  description:
    "Next-generation AI agents that solve your key problems fast. Real-time customer intelligence with zero data migration. Built for 2025.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
