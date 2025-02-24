// components/Header.tsx
'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-blue-600">CodeStylist</h1>
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/">Log In</Link>
                        </li>
                        <li>
                            <Link href="/">Edit Forms</Link>
                        </li>
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
                        <li>
                            <Link href="/login" onClick={() => setShowMenu(false)}>
                                Log In
                            </Link>
                        </li>
                        <li>
                            <Link href="/edit" onClick={() => setShowMenu(false)}>
                                Edit Forms
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    )
}