'use client'
import Image from 'next/image'
import Penbox from '../../../../public/Penbox.svg'
import Plusbox from '../../../../public/Plusbox.svg'
import Exclusedbox from '../../../../public/Exclusedbox.svg'
import ProductTable from '../../components/Table'
import { useTheme } from '@/contexts/themeContext'
import { useState, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'

export type Product = {
  id: number
  nome: string
  observacoes: string
  valor: string
  quantidade: string
  date: string
  foto: string | null
}

export default function Home() {
  const { darkMode } = useTheme()
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [productData, setProductData] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

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

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleOpenPopup = (product: Product) => {
    setProductData(product)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (files) {
      setProductData((prevData) =>
        prevData ? { ...prevData, [name]: files[0] } : null,
      )
    } else {
      setProductData((prevData) =>
        prevData ? { ...prevData, [name]: value } : null,
      )
    }
  }

  const handleEditSelected = async () => {
    if (!productData) return

    const formData = new FormData()
    formData.append('id', String(productData.id))
    formData.append('nome', productData.nome)
    formData.append('observacoes', productData.observacoes)
    formData.append('valor', productData.valor)
    formData.append('quantidade', productData.quantidade)

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

      // Atualiza a lista de produtos após a edição
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
      // Exibir uma mensagem de erro para o usuário, se necessário
    }
  }

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
      className={`mt-16 p-14 ml-16 h-auto transition-all ${
        darkMode ? 'text-white bg-gray-400' : 'text-black bg-white'
      }`}
    >
      <div
        className={`w-full h-min p-5 rounded ${
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
                    quantidade: '',
                    date: '',
                    foto: '',
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
                type="text"
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
