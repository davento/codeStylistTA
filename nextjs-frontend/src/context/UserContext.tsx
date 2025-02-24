'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserContextType {
    username: string | null
    setUsername: (username: string | null) => void
}

const UserContext = createContext<UserContextType>({
    username: null,
    setUsername: () => {},
})

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(null)
    return (
        <UserContext.Provider value={{ username, setUsername }}>
    {children}
    </UserContext.Provider>
)
}
