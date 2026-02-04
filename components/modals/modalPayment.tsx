import { Invoice } from "@/components/ui/invoice-card";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ProxyPublicRequest } from "@/lib/proxy";
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";

interface ModalPaymentProps {
    children: React.ReactNode
    invoice: Invoice
    setMockInvoices: (invoices: any[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const ModalPayment = ({children, invoice}: ModalPaymentProps) => {

    const { toast } = useToast()
    const { selectedCustomers, setMockInvoices, setInvoices, setLoading, setError } = useInvoice()
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await ProxyPublicRequest.post(`/api/invoice/${invoice.id}`);

            toast({
                title: "¡Pago exitoso!",
                description: `La factura ${invoice.invoiceNumber} ha sido pagada correctamente.`,
                variant: "default",
                className: "p-2 bg-green-800/20  max-lg:z-50 max-lg:bg-green-800",
            });

            setOpen(false);

            // Recargar facturas de los clientes seleccionados
            try {
                setLoading(true)
                const results = await Promise.all(
                    selectedCustomers.map((c) => ProxyPublicRequest(`/api/invoice?customerId=${c.customerId}`))
                )
                const allInvoices = results.flatMap((res: any) => res.data.dataset || [])
                setMockInvoices(allInvoices)
                setInvoices(allInvoices)
                setError(null)
            } catch (err: any) {
                setError(err.response?.data?.error || 'Error al cargar facturas')
            } finally {
                setLoading(false)
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.error ||
                                error.message ||
                                'No se pudo procesar el pago';

            toast({
                title: "Error al procesar el pago",
                description: errorMessage,
                variant: "destructive",
                className: "p-2 bg-red-800/20 max-lg:z-50 max-lg:bg-red-800",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-500">Pagado</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500">Pendiente</Badge>
            case 'overdue':
                return <Badge className="bg-red-500">Vencido</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handlePayment}>
                    <DialogHeader>
                        <DialogTitle>Detalle de Factura</DialogTitle>
                        <DialogDescription>
                            Revisa los detalles de tu factura antes de proceder con el pago
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="font-semibold">Cliente:</Label>
                            <div className="col-span-2 text-sm">
                                {invoice.customerName}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="font-semibold">Nro. Factura:</Label>
                            <div className="col-span-2 text-sm">
                                {invoice.invoiceNumber}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="font-semibold">Servicio:</Label>
                            <div className="col-span-2 text-sm">
                                {invoice.service}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="font-semibold">Período:</Label>
                            <div className="col-span-2 text-sm">
                                {formatDate(invoice.period)}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="font-semibold">Estado:</Label>
                            <div className="col-span-2">
                                {getStatusBadge(invoice.status)}
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label className="font-bold text-lg">Monto Total:</Label>
                                <div className="col-span-2 text-2xl font-bold text-primary">
                                    Bs. {invoice.amount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={invoice.status === 'paid' || isLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isLoading ? (
                                <>
                                    <span className="mr-2">Procesando...</span>
                                    <span className="animate-spin"></span>
                                </>
                            ) : invoice.status === 'paid' ? (
                                'Ya Pagado'
                            ) : (
                                'Pagar Ahora'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
