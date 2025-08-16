import type React from "react"
import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Inter, Roboto_Mono } from 'next/font/google';

// The 'Inter' font is a variable font, so we don't need to specify a weight.
// We just define the subset we want to preload, which is a best practice for performance.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Create a CSS variable for the font
  display: 'swap', // Use 'swap' to show a fallback font while the main font loads
});

// For fonts that are not variable, you must specify the weights you want to use.
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the regular and bold weights
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Blitzit - Task Management",
  description: "Focus-driven task management with Blitz mode",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
