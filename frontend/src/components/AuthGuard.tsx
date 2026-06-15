'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { username, isInitialized } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Only redirect if we've checked localStorage (isInitialized is true)
        // This prevents premature redirects during hydration
        if (isInitialized) {
            // Allow access to the login page even if not logged in
            if (!username && pathname !== '/login') {
                router.push('/login')
            }

            // Redirect to home if already logged in and trying to access login page
            if (username && pathname === '/login') {
                router.push('/')
            }
        }
    }, [username, pathname, router, isInitialized])

    // Don't render anything until we've checked localStorage
    if (!isInitialized) {
        return null
    }

    // Only render children if authenticated or on login page
    if (!username && pathname !== '/login') {
        return null // Don't render anything while redirecting
    }

    return <>{children}</>
}