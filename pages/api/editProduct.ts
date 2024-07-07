import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, updatedProduct } = req.body

    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const produtos = JSON.parse(fileData)

    const updatedProdutos = produtos.map((produto: { id: number }) => {
      if (produto.id === id) {
        return { ...produto, ...updatedProduct }
      }
      return produto
    })

    fs.writeFileSync(filePath, JSON.stringify(updatedProdutos, null, 2))

    res.status(200).json({ message: 'Produto editado com sucesso' })
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
