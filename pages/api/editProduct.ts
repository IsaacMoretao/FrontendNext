import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Product = {
  id: string
  nome: string
  observacoes: string
  valor: string
  quantidade: string
  date?: string
  foto?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, nome, observacoes, valor, quantidade, date } = req.body

    const updatedProduct: Product = {
      id,
      nome,
      observacoes,
      valor,
      quantidade,
      date,
      foto: req.body.foto || null, // Verifica se há uma foto
    }

    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const produtos: Product[] = JSON.parse(fileData)

    const updatedProducts = produtos.map((produto) => {
      if (produto.id === id) {
        return { ...produto, ...updatedProduct }
      }
      return produto
    })

    fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2))

    res.status(200).json({ message: 'Produto editado com sucesso' })
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
