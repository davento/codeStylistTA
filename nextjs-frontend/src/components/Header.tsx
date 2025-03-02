'use client'

import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [showMenu, setShowMenu] = useState(false)
    const { username, logout } = useUser()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/login')
        setShowMenu(false)
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-blue-600">CodeStylist</h1>
                </Link>
                <nav className="hidden md:flex items-center">
                    <ul className="flex items-center space-x-6">
                        <li>
                            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        </li>
                        {!username ? (
                            <li>
                                <Link href="/login" className="hover:text-blue-600 transition-colors">Log In</Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link href="/edit" className="hover:text-blue-600 transition-colors">Edit Forms</Link>
                                </li>
                                <li>
                                    <div className="flex items-center border-l pl-6 ml-2">
                                        <span className="text-gray-600 mr-3 whitespace-nowrap">
                                            {username}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition whitespace-nowrap"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            {showMenu && (
                <nav className="md:hidden bg-white shadow-md">
                    <ul className="flex flex-col p-4 space-y-2">
                        <li>
                            <Link href="/" onClick={() => setShowMenu(false)}>
                                Home
                            </Link>
                        </li>
                        {!username ? (
                            <li>
                                <Link href="/login" onClick={() => setShowMenu(false)}>
                                    Log In
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link href="/edit" onClick={() => setShowMenu(false)}>
                                        Edit Forms
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex flex-col py-2 border-t mt-2">
                                        <span className="text-gray-600 my-2">
                                            Signed in as: {username}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    )
}