import Image from 'next/image'
import { useState } from 'react'

type Product = {
  foto?: string
  nome: string
  date: string
  observacoes: string
  valor: string
  quantidade: number
}

type ProductCardProps = {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="lg:hidden flex p-4 border rounded-lg shadow-md relative my-5">
      <div className="flex-shrink-0">
        <Image
          src={product.foto || '/default-image.jpg'}
          alt={product.nome}
          width={60}
          height={60}
          className="object-cover w-16 h-16 rounded-md"
        />
      </div>
      <div className="flex-grow pl-4">
        <header className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-sm">{product.nome}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-xs">{`Data de Cadastro: ${product.date}`}</span>
            <div className="relative">
              <button onClick={toggleMenu} className="focus:outline-none">
                &#x22EE;
              </button>
              {menuVisible && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Editar
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <p className="text-sm text-gray-600 mb-2">{product.observacoes}</p>
        <footer className="flex justify-between text-sm text-gray-700">
          <span>{`Valor: R$ ${product.valor}`}</span>
          <span>{`Quantidade: ${product.quantidade} Und.`}</span>
        </footer>
      </div>
    </div>
  )
}

export default ProductCard
