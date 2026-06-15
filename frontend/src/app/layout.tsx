import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { UserProvider } from '@/context/UserContext'
import AuthGuard from '@/components/AuthGuard'

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
        <UserProvider>
            <Header />
            <AuthGuard>{children}</AuthGuard>
        </UserProvider>
        </body>
        </html>
    )
}