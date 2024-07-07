import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : '[]'
    const produtos = JSON.parse(fileData)

    res.status(200).json(produtos)
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
