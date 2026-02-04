"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModalPayment } from "@/components/modals/modalPayment"

export interface Invoice {
  id: string
  customerId: string
  customerName: string
  invoiceNumber: string
  service: string
  amount: number
  period: string
  status: "pending" | "overdue" | "paid"
}

interface InvoiceCardProps {
  invoice: Invoice
  setMockInvoices: (invoices: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const statusLabels = {
  pending: "Pendiente",
  overdue: "Vencida",
  paid: "Pagada",
}

export function InvoiceCard({ invoice,
    setMockInvoices,
    setLoading,
    setError }: InvoiceCardProps) {

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    overdue: "bg-red-500/10 text-red-700 dark:text-red-400",
    paid: "bg-green-500/10 text-green-700 dark:text-green-400",
  }

  return (
    <ModalPayment invoice={invoice}
                setError={setError}
                setLoading={setLoading}
                setMockInvoices={setMockInvoices}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="text-lg font-semibold">{invoice.customerName}</p>
            </div>
            <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Servicio</p>
              <p className="text-base font-medium">{invoice.service}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto</p>
              <p className="text-xl font-bold">${invoice.amount.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Periodo</p>
            <p className="text-base font-medium">{invoice.period}</p>
          </div>
        </CardContent>
      </Card>
    </ModalPayment>
  )
}
