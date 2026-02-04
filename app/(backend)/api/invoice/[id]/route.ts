// app/api/invoice/[id]/route.ts
import { mockInvoices } from '@/app/(backend)/mocks/MockInvoices'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // Cambia el tipo aquí
) {
  try {
    // Await params antes de usarlo
    const { id } = await context.params
    
    // Simula un delay de procesamiento (1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Encuentra la factura por ID
    const invoiceIndex = mockInvoices.findIndex(inv => inv.id === id)
    
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }

    const invoice = mockInvoices[invoiceIndex]

    // Verifica si ya está pagada
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Esta factura ya ha sido pagada' },
        { status: 400 }
      )
    }

    // Cambia el estado a 'paid'
    mockInvoices[invoiceIndex] = {
      ...invoice,
      status: 'paid'
    }

    return NextResponse.json({ 
      success: true,
      message: 'Pago procesado exitosamente',
      invoice: mockInvoices[invoiceIndex]
    })

  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el pago' },
      { status: 500 }
    )
  }
}