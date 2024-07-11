'use client'
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useTheme } from '@/contexts/themeContext'

// Interface para tipagem do produto
interface Product {
  id: string
  foto: File | null
  nome: string
  observacoes: string
  valor: string
  quantidade: string
}

export default function Products() {
  const { darkMode } = useTheme() // Utiliza o contexto de tema

  // Estado inicial do produto
  const [produto, setProduto] = useState<Product>({
    id: '',
    foto: null,
    nome: '',
    observacoes: '',
    valor: '',
    quantidade: '',
  })

  // Manipula mudanças nos inputs e textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { name, value, files } = e.target

    if (name === 'foto' && files && files.length > 0) {
      setProduto((prev) => ({
        ...prev,
        foto: files[0],
      }))
    } else {
      setProduto((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Abre o seletor de arquivo quando o botão é clicado
  const handleClick = () => {
    document.getElementById('fileInput')?.click()
  }

  // Envia o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const id = new Date().getTime().toString() // Gera um ID único

      const formData = new FormData()
      formData.append('id', id)
      formData.append('nome', produto.nome)
      formData.append('observacoes', produto.observacoes)
      formData.append('valor', produto.valor)
      formData.append('quantidade', produto.quantidade)
      if (produto.foto) {
        formData.append('foto', produto.foto)
      }

      const response = await axios.post('/api/salvarProduto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      alert(response.data.message)

      // Reseta o formulário
      setProduto({
        id: '',
        foto: null,
        nome: '',
        observacoes: '',
        valor: '',
        quantidade: '',
      })
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto')
    }
  }

  return (
    <main
      className={`${darkMode ? 'text-gray-100 bg-gray-400' : 'text-black bg-white'} transition-all mt-16 p-14 ml-16 h-screen`}
    >
      <div
        className={`w-full h-full ${darkMode ? 'text-gray-100 bg-gray-300' : 'text-black bg-gray-100'} p-5 rounded-lg shadow-md`}
      >
        <header>
          <p className="font-bold mb-3">Cadastrar Produto</p>
          <form onSubmit={handleSubmit} className="flex">
            <div>
              <div className="flex flex-col items-center rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Foto do Produto
                </label>
                <input
                  id="fileInput"
                  type="file"
                  name="foto"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-end w-[250px] h-[247px] bg-gray-200 rounded-lg"
                >
                  {produto.foto ? (
                    <Image
                      src={URL.createObjectURL(produto.foto)}
                      alt="Foto do Produto"
                      className="w-full h-full object-cover rounded-lg"
                      layout="responsive"
                      width={250}
                      height={247}
                    />
                  ) : (
                    <div className="w-full h-8 bg-purple-500 text-white text-center flex items-center justify-center rounded-lg">
                      Selecione um arquivo
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-1 ml-5">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  name="nome"
                  value={produto.nome}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${darkMode ? 'text-gray-100 bg-gray-300' : 'text-black bg-white'} outline-none`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={produto.observacoes}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${darkMode ? 'text-gray-100 bg-gray-300' : 'text-black bg-white'}`}
                ></textarea>
                <p className="text-xs mt-1 text-right">00/100</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Valor</label>
                  <div className="flex items-center">
                    <span className="inline-block px-3 py-2 border rounded-l-lg">
                      R$
                    </span>
                    <input
                      type="text"
                      name="valor"
                      value={produto.valor}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border-t border-b border-r rounded ${darkMode ? 'text-gray-100 bg-gray-300' : 'text-black bg-white'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    value={produto.quantidade}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${darkMode ? 'text-gray-100 bg-gray-300' : 'text-black bg-white'}`}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </header>
      </div>
    </main>
  )
}
