'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FiFilter } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'
import {
  BiFirstPage,
  BiLastPage,
  BiChevronLeft,
  BiChevronRight,
} from 'react-icons/bi'
import { useTheme } from '@/contexts/themeContext'

type Product = {
  id: number
  nome: string
  observacoes: string
  valor: string
  quantidade: string
  date: string
  foto: string | null
}

type ProductTableProps = {
  onSelectItem: (id: number) => void
  selectedItems: number[]
  setSelectedItems: (items: number[]) => void
  products: Product[]
}

const ProductTable: React.FC<ProductTableProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelectItem,
  selectedItems,
  setSelectedItems,
  products,
}) => {
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    nome: '',
    observacoes: '',
    quantidade: '',
    date: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    nome: '',
    observacoes: '',
    quantidade: '',
    date: '',
  })
  const { darkMode } = useTheme()

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const filteredProducts = products.filter((product) => {
    return (
      product.nome.toLowerCase().includes(appliedFilters.nome.toLowerCase()) &&
      product.observacoes
        .toLowerCase()
        .includes(appliedFilters.observacoes.toLowerCase()) &&
      product.quantidade
        .toLowerCase()
        .includes(appliedFilters.quantidade.toLowerCase())
    )
  })

  const currentItems = filteredProducts.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  )

  const totalPages = Math.ceil(filteredProducts.length / 10)

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const applyFilters = () => {
    setAppliedFilters({ ...filters })
    setCurrentPage(1)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      const allItemIds = filteredProducts.map((product) => product.id)
      setSelectedItems(allItemIds)
    }
    setSelectAll(!selectAll)
  }

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const clearFilters = () => {
    setFilters({
      nome: '',
      observacoes: '',
      quantidade: '',
      date: '',
    })
    setAppliedFilters({
      nome: '',
      observacoes: '',
      quantidade: '',
      date: '',
    })
    setCurrentPage(1)
  }

  return (
    <div className="p-4">
      <div
        className={`overflow-x-auto ${darkMode ? 'bg-gray-400 text-white' : 'bg-white text-black'} border border-gray-200 rounded-md`}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-500">
            <tr>
              <th className="px-4 py-2">
                <input
                  className="px-5 py-2"
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>IMAGEM</span>
                  <FiFilter />
                </div>
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>NOME DO PRODUTO</span>
                  <FiFilter />
                </div>
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>DESCRIÇÃO</span>
                  <FiFilter />
                </div>
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>VALOR</span>
                  <FiFilter />
                </div>
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>QUANTIDADE</span>
                  <FiFilter />
                </div>
              </th>
              <th className="px-4 py-5 text-left text-sm font-medium text-white uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>DATA DE CADASTRO</span>
                  <FiFilter />
                </div>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th />
              <th />
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaSearch />
                  <input
                    type="text"
                    className={`h-10 outline-none rounded ${
                      darkMode
                        ? 'bg-gray-400 text-white'
                        : 'bg-white text-black'
                    }`}
                    value={filters.nome}
                    onChange={(e) => handleFilterChange('nome', e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaSearch />
                  <input
                    type="text"
                    className={`outline-none ${
                      darkMode
                        ? 'bg-gray-400 text-white'
                        : 'bg-white text-black'
                    }`}
                    value={filters.observacoes}
                    onChange={(e) =>
                      handleFilterChange('observacoes', e.target.value)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"></th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaSearch />
                  <input
                    type="text"
                    className={`h-10 outline-none ${
                      darkMode
                        ? 'bg-gray-400 text-white'
                        : 'bg-white text-black'
                    }`}
                    value={filters.quantidade}
                    onChange={(e) =>
                      handleFilterChange('quantidade', e.target.value)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <FaSearch />
                  <input
                    type="text"
                    className={`h-10 outline-none ${
                      darkMode
                        ? 'bg-gray-400 text-white'
                        : 'bg-white text-black'
                    }`}
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                </div>
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody
            className={`${
              darkMode ? 'bg-gray-400 text-white' : 'bg-white text-black'
            } divide-y divide-gray-200`}
          >
            {currentItems.map((product, index) => (
              <tr key={index} className="text-xs">
                <td className="px-4 py-2">
                  <input
                    className="px-5 py-2"
                    type="checkbox"
                    onChange={() => handleSelectItem(product.id)}
                    checked={selectedItems.includes(product.id)}
                  />
                </td>
                <td className="px-4 py-2">
                  <Image
                    src={product.foto || '/default-image.jpg'}
                    alt={product.nome}
                    width={60}
                    height={60}
                    className="object-cover w-16 h-16 rounded-md"
                  />
                </td>
                <td className="px-4 py-2">{product.nome}</td>
                <td className="px-4 py-2">{product.observacoes}</td>
                <td className="px-4 py-2">{product.valor}</td>
                <td className="px-4 py-2">{product.quantidade}</td>
                <td className="px-4 py-2">{product.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <FiFilter className="text-purple-500" />
          <button className="text-purple-500" onClick={applyFilters}>
            Criar Filtro
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="bg-purple-500 p-2 rounded text-gray-50"
            onClick={clearFilters}
          >
            Limpar Filtro
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end items-center text-black">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-1 disabled:opacity-50 border"
        >
          <BiFirstPage />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 disabled:opacity-50 border"
        >
          <BiChevronLeft />
        </button>
        <span className="p-1 text-sm text-gray-700 border">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 disabled:opacity-50 border"
        >
          <BiChevronRight />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1 disabled:opacity-50 border"
        >
          <BiLastPage />
        </button>
      </div>
    </div>
  )
}

export default ProductTable
