'use client'

import React from 'react'
import Image from 'next/image'
import Book from '../../../public/Book.svg'
import Home from '../../../public/Home.svg'
import { useTheme } from '@/contexts/themeContext'
import { usePathname } from 'next/navigation'
import Plusbox from '../../../public/Plusbox.svg'
import Link from 'next/link'

const Header: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme()
  const currentPath = usePathname()

  return (
    <header
      className="flex fixed justify-between z-20 items-center top-0 left-16
    right-0 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 text-white
    shadow-md px-16 max-sm:left-0 max-lg:rounded-b-lg"
    >
      <div className="flex flex-1 items-center gap-3">
        <Image
          src={currentPath === `/Home` ? Home : Book}
          alt="Logo"
          width={30}
          height={30}
        />
        <span>{currentPath === `/Home` ? 'Home' : 'Produtos'}</span>
      </div>

      <button
        className={`relative w-14 h-7 rounded-full p-1 max-sm:hidden cursor-pointer ${
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
      <Link href="/Products" className="sm:hidden">
        <Image src={Plusbox} alt="Plus Box" />
      </Link>
    </header>
  )
}

export default Header
