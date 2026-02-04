'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ProxyPublicRequest } from '@/lib/proxy'

interface SelectedCustomer {
  customerId: string
  name: string
}

interface InvoiceContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchBarMovingUp: boolean
  setSearchBarMovingUp: (moving: boolean) => void
  showResults: boolean
  setShowResults: (show: boolean) => void
  isFirstSearch: boolean
  setIsFirstSearch: (first: boolean) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  invoices: any[]
  setInvoices: (invoices: any[]) => void
  mockInvoices: any[]
  setMockInvoices: (invoices: any[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  selectedCustomers: SelectedCustomer[]
  addCustomer: (customerId: string) => Promise<void>
  removeCustomer: (customerId: string) => void
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export function InvoiceProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchBarMovingUp, setSearchBarMovingUp] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [isFirstSearch, setIsFirstSearch] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [invoices, setInvoices] = useState<any[]>([])
    const [mockInvoices, setMockInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedCustomers, setSelectedCustomers] = useState<SelectedCustomer[]>([])

    const updateUrlParams = (params: Record<string, string | null>) => {
        const url = new URL(window.location.href)
        for (const [key, value] of Object.entries(params)) {
            if (value === null || value === '') {
                url.searchParams.delete(key)
            } else {
                url.searchParams.set(key, value)
            }
        }
        window.history.replaceState({}, '', url.toString())
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const customersParam = params.get('customers')
        if (!customersParam) return

        const customerIds = customersParam.split(',').filter(Boolean)
        if (customerIds.length === 0) return

        const restoreCustomers = async () => {
            try {
                setLoading(true)
                const results = await Promise.all(
                    customerIds.map((id) => ProxyPublicRequest(`/api/invoice?customerId=${id}`))
                )

                const restoredCustomers: SelectedCustomer[] = []
                const allInvoices: any[] = []

                results.forEach((res: any, index: number) => {
                    const dataset = res.data.dataset || []
                    if (dataset.length > 0) {
                        restoredCustomers.push({
                            customerId: customerIds[index],
                            name: dataset[0].customerName,
                        })
                        allInvoices.push(...dataset)
                    }
                })

                if (restoredCustomers.length > 0) {
                    setSelectedCustomers(restoredCustomers)
                    setMockInvoices(allInvoices)
                    setInvoices(allInvoices)
                    setShowResults(true)
                }
                setError(null)
            } catch (err: any) {
                setError(err.response?.data?.error || 'Error al restaurar clientes')
            } finally {
                setLoading(false)
            }
        }

        restoreCustomers()
    }, [])

    const fetchInvoicesByCustomers = async (customers: SelectedCustomer[]) => {
        try {
            setLoading(true)
            const results = await Promise.all(
                customers.map((c) => ProxyPublicRequest(`/api/invoice?customerId=${c.customerId}`))
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
    }

    const addCustomer = async (customerId: string) => {
        if (selectedCustomers.some((c) => c.customerId === customerId)) return

        try {
            setLoading(true)
            const response: any = await ProxyPublicRequest(`/api/invoice?customerId=${customerId}`)
            const dataset = response.data.dataset || []

            if (dataset.length === 0) {
                setError('No se encontraron facturas para este cliente')
                setLoading(false)
                return
            }

            const customerName = dataset[0].customerName
            const newCustomers = [...selectedCustomers, { customerId, name: customerName }]
            setSelectedCustomers(newCustomers)
            await fetchInvoicesByCustomers(newCustomers)
            updateUrlParams({ customers: newCustomers.map((c) => c.customerId).join(',') })
            setShowResults(true)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al buscar cliente')
        } finally {
            setLoading(false)
        }
    }

    const removeCustomer = (customerId: string) => {
        const newCustomers = selectedCustomers.filter((c) => c.customerId !== customerId)
        setSelectedCustomers(newCustomers)

        if (newCustomers.length === 0) {
            setMockInvoices([])
            setInvoices([])
            updateUrlParams({ customers: null })
            return
        }

        updateUrlParams({ customers: newCustomers.map((c) => c.customerId).join(',') })
        fetchInvoicesByCustomers(newCustomers)
    }

    return (
        <InvoiceContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchBarMovingUp,
            setSearchBarMovingUp,
            showResults,
            setShowResults,
            isFirstSearch,
            setIsFirstSearch,
            currentPage,
            setCurrentPage,
            invoices,
            setInvoices,
            mockInvoices,
            setMockInvoices,
            loading,
            setLoading,
            error,
            setError,
            selectedCustomers,
            addCustomer,
            removeCustomer,
        }}>
            {children}
        </InvoiceContext.Provider>
    )
}

export function useInvoice() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within InvoiceProvider')
  }
  return context
}
