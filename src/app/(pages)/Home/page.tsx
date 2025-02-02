'use client'

import Image from 'next/image'
import Penbox from '../../../../public/Penbox.svg'
import Plusbox from '../../../../public/Plusbox.svg'
import Exclusedbox from '../../../../public/Exclusedbox.svg'
import ProductTable from '../../components/Table'
import { useTheme } from '@/contexts/themeContext'
import { useState, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/app/components/Card'

// Tipagem do produto
export type Product = {
  id: number
  nome: string
  observacoes: string
  valor: string
  quantidade: number // alterado de string para number
  date: string
  foto: string | undefined
}

export default function Home() {
  const { darkMode } = useTheme() // Utiliza o contexto de tema
  const [selectedItems, setSelectedItems] = useState<number[]>([]) // Estado para itens selecionados
  const [isPopupOpen, setIsPopupOpen] = useState(false) // Estado para o popup
  const [productData, setProductData] = useState<Product | null>(null) // Dados do produto para edição
  const [products, setProducts] = useState<Product[]>([]) // Lista de produtos

  // Fetch de produtos ao montar o componente
  useEffect(() => {
    fetchProducts()
  }, [])

  // Função para buscar produtos da API
  const fetchProducts = () => {
    fetch('/api/getProducts')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error)
      })
  }

  // Manipula seleção de item
  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Abre o popup para edição de produto
  const handleOpenPopup = (product: Product) => {
    setProductData(product)
    setIsPopupOpen(true)
  }

  // Fecha o popup de edição
  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  // Manipula mudanças no input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (files) {
      setProductData((prevData) =>
        prevData ? { ...prevData, [name]: files[0] } : null,
      )
    } else {
      setProductData((prevData) =>
        prevData
          ? {
              ...prevData,
              [name]: name === 'quantidade' ? parseInt(value) : value,
            }
          : null,
      )
    }
  }

  // Manipula a edição do produto selecionado
  const handleEditSelected = async () => {
    if (!productData) return

    const formData = new FormData()
    formData.append('id', String(productData.id))
    formData.append('nome', productData.nome)
    formData.append('observacoes', productData.observacoes)
    formData.append('valor', productData.valor)
    formData.append('quantidade', String(productData.quantidade)) // convertendo para string

    if (productData.date) {
      formData.append('date', productData.date)
    }

    if (
      productData.foto &&
      typeof productData.foto === 'object' &&
      'name' in productData.foto &&
      'size' in productData.foto
    ) {
      formData.append('foto', productData.foto as File)
    }

    try {
      const response = await fetch(`/api/editProduct`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao editar o produto')
      }

      const updatedProduct = await response.json()
      console.log('Item editado com sucesso:', updatedProduct)

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productData.id
            ? { ...product, ...productData }
            : product,
        ),
      )

      handleClosePopup()
    } catch (error) {
      console.error('Erro ao editar o produto:', error)
    }
  }

  // Manipula a exclusão dos produtos selecionados
  const handleDeleteSelected = async () => {
    try {
      await fetch(`/api/deleteProduct`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      })

      setProducts((prevProducts) =>
        prevProducts.filter((product) => !selectedItems.includes(product.id)),
      )

      console.log('Itens deletados com sucesso:', selectedItems)
      setSelectedItems([])
    } catch (error) {
      console.error('Erro ao deletar produtos:', error)
    }
  }

  return (
    <main
      className={`sm:mt-16 p-14 sm:ml-16 min-h-[100vh] transition-all ${
        darkMode ? 'text-white bg-gray-400' : 'text-black bg-white'
      }`}
    >
      <div className="max-sm:min-h-[100vh]">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <div
        className={`w-full max-sm:hidden h-min p-5 rounded ${
          darkMode ? 'text-white bg-gray-300' : 'text-black bg-gray-100'
        }`}
      >
        <header>
          <div className="flex gap-3 mb-3">
            <button
              onClick={() =>
                handleOpenPopup(
                  products.find((p) => selectedItems.includes(p.id)) || {
                    id: 0,
                    nome: '',
                    observacoes: '',
                    valor: '',
                    quantidade: 0,
                    date: '',
                    foto: undefined,
                  },
                )
              }
              disabled={selectedItems.length !== 1}
              className={`${
                selectedItems.length !== 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Image src={Penbox} alt="Pen Box" />
            </button>
            <Link href="/Products">
              <Image src={Plusbox} alt="Plus Box" />
            </Link>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedItems.length === 0}
              className={`${
                selectedItems.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Image src={Exclusedbox} alt="Exclused Box" />
            </button>
          </div>
          <p className="font-bold mb-3">
            Arraste o cabeçalho de uma coluna aqui para agrupar por essa coluna
          </p>
        </header>
        <ProductTable
          onSelectItem={handleSelectItem}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          products={products}
        />
      </div>
      {isPopupOpen && productData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
            <label className="block mb-2">
              Nome:
              <input
                type="text"
                name="nome"
                value={productData.nome}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Observações:
              <input
                type="text"
                name="observacoes"
                value={productData.observacoes}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Valor:
              <input
                type="text"
                name="valor"
                value={productData.valor}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Quantidade:
              <input
                type="number"
                name="quantidade"
                value={productData.quantidade}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditSelected}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
