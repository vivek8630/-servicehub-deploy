import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentType = req.headers.get('content-type') || ''
    
    let fileUrl = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Check max size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
      }

      // Convert file buffer to Data URL (base64) for lightweight cloud-ready storage
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const mimeType = file.type || 'image/jpeg'
      fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`
    } else {
      const body = await req.json()
      if (!body.fileUrl && !body.base64) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
      }
      fileUrl = body.fileUrl || body.base64
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: 'File uploaded successfully',
    })
  } catch (err: any) {
    console.error('Upload handler error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
