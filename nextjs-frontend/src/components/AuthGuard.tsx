'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { username } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Allow access to the login page even if not logged in
        if (!username && pathname !== '/login') {
            router.push('/login')
        }
    }, [username, pathname, router])

    return <>{children}</>
}
