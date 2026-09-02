import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const user = await getSession()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Send initial connected event
  writer.write(encoder.encode(`event: connected\ndata: ${JSON.stringify({ userId: user.id })}\n\n`))

  // Keep-alive heartbeat every 15s to maintain persistent HTTP connection
  const interval = setInterval(() => {
    try {
      writer.write(encoder.encode(`: heartbeat\n\n`))
    } catch {
      clearInterval(interval)
    }
  }, 15000)

  req.signal.addEventListener('abort', () => {
    clearInterval(interval)
    writer.close()
  })

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
