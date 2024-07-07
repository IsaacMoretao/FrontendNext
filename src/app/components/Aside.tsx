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
    { href: '/2', src: Box, alt: 'Box' },
    { href: '#', src: Settings, alt: 'Settings' },
    { href: '#', src: HamburguerButton, alt: 'HamburguerButton' },
  ]

  return (
    <nav
      className={`flex flex-col fixed top-0 left-0 bottom-0 w-16 ${darkMode ? 'bg-gray-300 text-white' : 'bg-gray-100 text-black'} items-center`}
    >
      <figure className="pt-2 mb-10">
        <Image
          src={Logo}
          alt="Logo"
          layout="responsive"
          width={50}
          height={56}
        />
      </figure>
      <ul className="flex flex-col gap-5">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`relative ${currentPath === item.href ? 'pl-4' : ''}`}
          >
            {currentPath === item.href && (
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 rounded h-full bg-blue-500"></span>
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
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Aside
