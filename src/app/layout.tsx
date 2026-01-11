import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/hooks/useAuth"
import { QueryProvider } from "@/lib/providers/QueryProvider"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sunday AI Work | Exploring AI, Automation, and Modern Tech",
  description: "Practical guides and deep dives into artificial intelligence, workflow automation, LLMs, and cutting-edge technologies. Real projects built in my free time.",
  keywords: ["AI", "automation", "machine learning", "LLMs", "artificial intelligence", "workflow", "modern technology", "programming", "n8n", "Supabase", "OpenAI", "LangChain", "Python", "React"],
  authors: [{ name: "Sunday AI Work" }],
  creator: "Sunday AI Work",
  publisher: "Sunday AI Work",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Sunday AI Work | Exploring AI, Automation, and Modern Tech",
    description: "Practical guides and deep dives into artificial intelligence, workflow automation, LLMs, and cutting-edge technologies. Real projects built in my free time.",
    siteName: "Sunday AI Work",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sunday AI Work - Building the future, one Sunday at a time",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday AI Work | Exploring AI, Automation, and Modern Tech",
    description: "Practical guides and deep dives into artificial intelligence, workflow automation, LLMs, and cutting-edge technologies.",
    images: ["/og-image.png"],
    creator: "@sundayaiwork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1c3a" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <QueryProvider>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}