'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface UserContextType {
    username: string | null
    setUsername: (username: string | null) => void
    logout: () => void
    isInitialized: boolean
}

const defaultContext: UserContextType = {
    username: null,
    setUsername: () => {},
    logout: () => {},
    isInitialized: false
}

const UserContext = createContext<UserContextType>(defaultContext)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsernameState] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    // This is critical - check localStorage immediately in a useEffect
    // using the 'mounted' pattern to avoid hydration mismatches
    useEffect(() => {
        // Load username from localStorage on initial render
        const savedUsername = localStorage.getItem('username')
        if (savedUsername) {
            setUsernameState(savedUsername)
        }
        // Mark as initialized so we know we've checked local storage
        setIsInitialized(true)
    }, [])

    // Function to set username and save to localStorage
    const setUsername = (newUsername: string | null) => {
        setUsernameState(newUsername)

        if (newUsername) {
            localStorage.setItem('username', newUsername)
        } else {
            localStorage.removeItem('username')
        }
    }

    // Function to logout user
    const logout = () => {
        setUsernameState(null)
        localStorage.removeItem('username')

        // Clear other user-related data
        localStorage.removeItem('analyzeFormState')

        // Find all keys that start with 'feedback_' and remove them
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('feedback_')) {
                localStorage.removeItem(key)
            }
        })
    }

    // Return the context provider with the values
    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            logout,
            isInitialized
        }}>
            {children}
        </UserContext.Provider>
    )
}