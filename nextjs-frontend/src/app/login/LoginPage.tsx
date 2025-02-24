'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { setUsername: setLoggedInUsername } = useUser()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + '/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            }
        )
        const data = await res.json()
        if (res.ok) {
            setLoggedInUsername(data.username)
            router.push('/') // Redirect to home
        } else {
            setError(data.message || 'Login failed')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Log In
                </button>
            </form>
        </div>
    )
}
