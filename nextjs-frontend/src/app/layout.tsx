// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeStylist',
  description: 'Analyze your code with AI feedback',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
      <Header />
      <main className="container mx-auto p-4">{children}</main>
      </body>
      </html>
  )
}