import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable, { File } from 'formidable'

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for this route
  },
}

const dataDir = path.join(process.cwd(), 'data')
const uploadDir = path.join(process.cwd(), 'public', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true }) // Ensure the upload directory exists
fs.mkdirSync(dataDir, { recursive: true }) // Ensure the data directory exists

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false, // If you want to allow multiple files per request, set this to true
    })

    form.parse(req, async (err, fields, files: formidable.Files) => {
      if (err) {
        console.error('Error parsing the file:', err)
        return res.status(500).json({ error: 'Error parsing the file' })
      }

      console.log('Files:', files)
      console.log('Fields:', fields)

      const photoFile = files.foto as File | File[] | undefined

      if (!photoFile || (Array.isArray(photoFile) && photoFile.length === 0)) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      try {
        // Save image permanently
        const file = Array.isArray(photoFile) ? photoFile[0] : photoFile
        const oldPath = file.filepath // Updated property for formidable v2
        const newFileName = `${Date.now()}_${file.originalFilename}`
        const newPath = path.join(uploadDir, newFileName)
        fs.renameSync(oldPath, newPath) // Ensure oldPath is not null/undefined

        const filePath = `/uploads/${newFileName}`

        // Format the date
        const formattedDate = new Date().toISOString().split('T')[0]

        // Save form data to a JSON file
        const formData = {
          id: Array.isArray(fields.id) ? fields.id[0] : fields.id,
          nome: Array.isArray(fields.nome) ? fields.nome[0] : fields.nome,
          observacoes: Array.isArray(fields.observacoes)
            ? fields.observacoes[0]
            : fields.observacoes,
          valor: Array.isArray(fields.valor) ? fields.valor[0] : fields.valor,
          quantidade: Array.isArray(fields.quantidade)
            ? fields.quantidade[0]
            : fields.quantidade,
          foto: filePath, // Save the file path to the JSON
          date: formattedDate, // Add the formatted registration date
        }

        const dataFilePath = path.join(dataDir, 'products.json')
        const fileData = fs.existsSync(dataFilePath)
          ? fs.readFileSync(dataFilePath, 'utf8')
          : '[]'
        const products = JSON.parse(fileData)
        products.push(formData)
        fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2))

        res.status(200).json(formData)
      } catch (error) {
        console.error('Error saving file or data:', error)
        res.status(500).json({ error: 'Error saving file or data' })
      }
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
