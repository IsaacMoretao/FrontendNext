import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../contexts/themeContext'
import Header from './components/Header'
import Aside from './components/Aside'

// Importando a fonte Poppins do Google Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: '100',
})

// Metadados da página
export const metadata: Metadata = {
  title: 'Teste vaga frontEnd',
  description: 'Feito com next com ❤️ por Isaac Moretão',
}

// Componente RootLayout que envolve toda a aplicação
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <ThemeProvider>
          <Header />
          <Aside />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
