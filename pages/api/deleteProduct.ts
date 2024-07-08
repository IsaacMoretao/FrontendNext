import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { ids } = req.body

    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const produtos = JSON.parse(fileData)

    const updatedProdutos = produtos.filter(
      (produto: { id: number }) => !ids.includes(produto.id),
    )

    fs.writeFileSync(filePath, JSON.stringify(updatedProdutos, null, 2))

    res.status(200).json({ message: 'Produtos deletados com sucesso' })
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
