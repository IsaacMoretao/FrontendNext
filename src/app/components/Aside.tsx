'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '../../../public/Logo.svg'
import Home from '../../../public/Home.svg'
import Book from '../../../public/Book.svg'
import Box from '../../../public/Box.svg'
import Settings from '../../../public/Settings.svg'
import HamburguerButton from '../../../public/HamburguerButton.svg'
import { useTheme } from '@/contexts/themeContext'
import Image from 'next/image'

const Aside: React.FC = () => {
  const { darkMode } = useTheme()
  const currentPath = usePathname()

  const navItems = [
    { href: '/Home', src: Home, alt: 'Home' },
    { href: '/Products', src: Book, alt: 'Book' },
    { href: '#', src: Box, alt: 'Box' },
    { href: '#', src: Settings, alt: 'Settings' },
    { href: '#', src: HamburguerButton, alt: 'HamburguerButton' },
  ]

  return (
    <nav
      className={`flex sm:flex-col fixed sm:top-0 left-0 bottom-0 w-16
        ${darkMode ? 'bg-gray-300 text-white' : 'bg-gray-100 text-black'}
        items-center max-sm:right-0 z-20 max-sm:w-full max-sm:h-16`}
    >
      <figure className="pt-2 mb-10 max-sm:hidden">
        <Image
          src={Logo}
          alt="Logo"
          layout="responsive"
          width={50}
          height={56}
        />
      </figure>
      <div className="flex max-sm:justify-between max-sm:items-center max-sm:px-5 max-sm:w-full sm:flex-col sm:gap-5">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`relative ${currentPath === item.href ? 'pl-4 max-sm:p-5 max-sm:rounded-full max-sm:bg-purple-600 max-sm:bottom-5 ' : ''}`}
          >
            {currentPath === item.href && (
              <span className="max-sm:hidden absolute left-0 top-1/2 transform -translate-y-1/2 w-1 rounded h-full bg-blue-500"></span>
            )}
            {currentPath === item.href ? (
              <span className="block">
                <Image src={item.src} alt={item.alt} />
              </span>
            ) : (
              <Link href={item.href}>
                <Image src={item.src} alt={item.alt} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Aside
