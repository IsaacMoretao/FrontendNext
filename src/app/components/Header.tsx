'use client'
import React from 'react'
import Image from 'next/image'
import Book from '../../../public/Book.svg'
import { useTheme } from '@/contexts/themeContext'

const Header: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <header className="flex fixed justify-between items-center top-0 left-16 right-0 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md px-16">
      <div className="flex flex-1 items-center gap-3">
        <Image src={Book} alt="Logo" width={30} height={30} />
        <span>Produtos</span>
      </div>
      <button
        className={`relative w-14 h-7 rounded-full p-1 cursor-pointer ${
          darkMode ? 'bg-gray-300' : 'bg-gray-100'
        }`}
        onClick={toggleTheme}
      >
        <div
          className={`absolute left-2 w-5 top-1 h-5 rounded-full transition-transform transform ${
            darkMode
              ? 'translate-x-full bg-gray-100'
              : 'translate-x-0 bg-gray-400'
          }`}
        />
      </button>
    </header>
  )
}

export default Header
