import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Product = {
  photo: string | null
  name: string
  notes: string
  price: string
  quantity: string
  date: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const product: Product = {
      ...req.body,
      date: new Date().toISOString().split('T')[0], // Adding creation date
    }

    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : '[]'
    const products = JSON.parse(fileData)

    products.push(product)

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2))

    res.status(200).json({ message: 'Product saved successfully!' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
