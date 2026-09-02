import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { include: { user: true } },
        provider: { include: { user: true } },
        service: true,
        payment: true,
      },
    })

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 })
    }

    const invoiceDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const amount = booking.finalPrice || booking.estimatedPrice || 0
    const tax = Math.round(amount * 0.05 * 100) / 100 // 5% tax
    const total = amount + tax

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${booking.id.slice(-8)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #fff; }
        .invoice-box { max-w: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
        .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
        .title { font-size: 20px; font-weight: 700; color: #0f172a; text-align: right; }
        .meta { color: #64748b; font-size: 13px; margin-top: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 8px; }
        .party-name { font-size: 16px; font-weight: 700; color: #0f172a; }
        .party-detail { font-size: 13px; color: #475569; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { background: #f8fafc; text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; }
        td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .totals { width: 300px; margin-left: auto; font-size: 14px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; color: #475569; }
        .totals-row.final { border-top: 2px solid #0f172a; font-size: 18px; font-weight: 800; color: #0f172a; padding-top: 16px; margin-top: 8px; }
        .footer { text-align: center; margin-top: 48px; pt-32; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
        @media print {
          body { padding: 0; }
          .invoice-box { border: none; box-shadow: none; padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="max-width: 800px; margin: 0 auto 20px; text-align: right;">
        <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Print or Save PDF
        </button>
      </div>

      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo">ServiceHub</div>
            <div class="meta">Local Services Marketplace</div>
          </div>
          <div>
            <div class="title">INVOICE</div>
            <div class="meta">Invoice #${booking.id.slice(-8).toUpperCase()}</div>
            <div class="meta">Date: ${invoiceDate}</div>
            <div style="margin-top: 8px;"><span class="badge">${booking.status}</span></div>
          </div>
        </div>

        <div class="grid">
          <div>
            <div class="section-title">Billed To</div>
            <div class="party-name">${booking.customer.user.name}</div>
            <div class="party-detail">${booking.customer.user.email}</div>
            <div class="party-detail">${booking.address}</div>
          </div>
          <div>
            <div class="section-title">Service Provider</div>
            <div class="party-name">${booking.provider.user.name}</div>
            <div class="party-detail">${booking.provider.user.email}</div>
            <div class="party-detail">${booking.provider.city || 'India'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Date & Time</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.service?.name || 'Local Service Booking'}</strong>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Scheduled Service Job</div>
              </td>
              <td>${new Date(booking.scheduledDate).toLocaleDateString()} @ ${booking.scheduledTime}</td>
              <td style="text-align: right; font-weight: 600;">₹${amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>₹${amount.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Service Tax (5%)</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div class="totals-row final">
            <span>Total Paid</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing ServiceHub! For support or disputes, contact support@servicehub.com.
        </div>
      </div>
    </body>
    </html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (err: any) {
    console.error('Invoice error:', err)
    return new NextResponse('Invoice generation error', { status: 500 })
  }
}
