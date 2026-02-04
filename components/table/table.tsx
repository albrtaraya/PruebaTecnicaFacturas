"use client"

import { useState, useEffect, useRef } from "react"
import { Filter, LayoutGrid, Table2, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoiceCard } from "@/components/ui/invoice-card"
import { InvoiceTable } from "@/components/ui/invoice-table"
import { FiltersPanel } from "@/components/ui/filters-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useInvoice } from "@/contexts/InvoiceContext"
import { filterInvoices, getFilterDisplayValue, getActiveFilterEntries, parseUrlFilters, buildUrlParams, FILTER_LABELS } from "@/lib/invoice-utils"

export function Table() {
    const {
        isFirstSearch,
        searchBarMovingUp,
        searchQuery,
        showResults,
        setShowResults,
        currentPage,
        setCurrentPage,
        invoices,
        setInvoices,
        mockInvoices,
        setMockInvoices,
        setLoading,
        setError,
        selectedCustomers,
        removeCustomer,
    } = useInvoice();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(6)
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
    const [showToolbar, setShowToolbar] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => setShowToolbar(true), 100)
      return () => clearTimeout(timer)
    }, [])

  const [filters, setFilters] = useState({
    status: "all",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  })

  const filtersRestoredFromUrl = useRef(false)

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
    if (mockInvoices.length === 0) return

    let activeFilters = filters

    // On first load, restore filters from URL if present
    if (!filtersRestoredFromUrl.current) {
      filtersRestoredFromUrl.current = true
      const urlFilters = parseUrlFilters(new URLSearchParams(window.location.search))
      if (urlFilters) {
        activeFilters = urlFilters
        setFilters(activeFilters)
      }
    }

    setInvoices(filterInvoices(mockInvoices, activeFilters))
  }, [mockInvoices])

    useEffect(() => {
      if(localStorage.getItem("isFirst") == "true"){
        setCurrentPage(1)
        const filtered = mockInvoices.filter(
          (inv: any) =>
            inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.amount.toString().includes(searchQuery),
        )
        setInvoices(filtered)
        const timer1 = setTimeout(() => {
          setTimeout(() => {
            setShowResults(true)
          }, 200)
        }, 100);

        return () => {
          clearTimeout(timer1)
        }
      }
    }, [])

  const totalPages = Math.ceil(invoices.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

    const exportToExcel = () => {
      alert("Exportando a Excel...")
    }

    const exportToPDF = () => {
      alert("Exportando a PDF...")
    }

  const applyFilters = () => {
    setShowResults(false)

    setInvoices(filterInvoices(mockInvoices, filters))
    setIsFiltersOpen(false)
    setCurrentPage(1)
    updateUrlParams(buildUrlParams(filters))

    setTimeout(() => {
      setShowResults(true)
    }, 400)
  }

  const activeFilterEntries = getActiveFilterEntries(filters)

  const removeFilter = (key: string) => {
    const newFilters = { ...filters, [key]: key === "status" ? "all" : "" }
    setFilters(newFilters)
    setInvoices(filterInvoices(mockInvoices, newFilters))
    setCurrentPage(1)
    updateUrlParams(buildUrlParams(newFilters))
  }

  const clearFilters = () => {
    setShowResults(false)

    setFilters({
      status: "all",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    })
    setInvoices(mockInvoices)
    setCurrentPage(1)

    updateUrlParams(buildUrlParams({
      status: "all",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    }))

    setTimeout(() => {
      setShowResults(true)
    }, 400)
  }

    return <>
        {/* Badges de clientes seleccionados */}
        {selectedCustomers.length > 0 && (
          <div className="container mx-auto max-w-8xl px-6 pt-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Clientes:</span>
              {selectedCustomers.map((customer) => (
                <Badge
                  key={customer.customerId}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                  {customer.name}
                  <button
                    type="button"
                    className="inline-flex cursor-pointer hover:text-destructive"
                    onClick={() => removeCustomer(customer.customerId)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 pb-8 max-md:mt-0">
            <div className="container mx-auto max-w-8xl px-6 max-lg:pt-4">
                <div
                className={`flex items-center justify-between mb-6 transition-all duration-500 ease-out ${
                    showToolbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                >
                <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="lg" onClick={() => setIsFiltersOpen(true)} className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
                {activeFilterEntries.map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1 text-sm"
                    >
                      {FILTER_LABELS[key]}: {getFilterDisplayValue(key, value)}
                      <button
                        type="button"
                        className="inline-flex cursor-pointer hover:text-destructive"
                        onClick={() => removeFilter(key)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                        variant={viewMode === "cards" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("cards")}
                        title="Vista de Tarjetas"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("table")}
                        title="Vista de Tabla"
                    >
                        <Table2 className="h-4 w-4" />
                    </Button>
                    </div>

                    <Button variant="outline" size="icon" onClick={exportToExcel} title="Exportar Excel">
                    <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={exportToPDF} title="Exportar PDF">
                    <FileText className="h-4 w-4" />
                    </Button>
                </div>
                </div>

                {invoices.length > 0 ? (
                <>
                <div
                className={`transition-all duration-500 ease-out ${
                    showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                >
                {viewMode === "cards" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentInvoices.map((invoice: any, index: any) => (
                        <div
                        key={invoice.id}
                        className={`transition-all duration-500 ease-out ${
                            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                        style={{
                            transitionDelay: showResults ? `${index * 80}ms` : "0ms",
                        }}
                        >
                        <InvoiceCard invoice={invoice}
                            setError={setError}
                            setLoading={setLoading}
                            setMockInvoices={setMockInvoices} />
                        </div>
                    ))}
                    </div>
                ) : (
                    <InvoiceTable invoices={currentInvoices}
                        setError={setError}
                        setLoading={setLoading}
                        setMockInvoices={setMockInvoices} />
                )}
                </div>

                <div
                className={`flex items-center justify-between mt-8 max-lg:flex-col max-lg:justify-center ${
                    isFirstSearch
                    ? `transition-all duration-500 ease-out ${
                        showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`
                    : ""
                }`}
                style={isFirstSearch ? { transitionDelay: showResults ? "300ms" : "0ms" } : {}}
                >
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filas por página:</span>
                    <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => {
                        setRowsPerPage(Number.parseInt(value))
                        setCurrentPage(1)
                    }}
                    >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-muted-foreground max-lg:py-5">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, invoices.length)} de {invoices.length} resultados
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-4">
                    {currentPage} / {totalPages}
                    </span>
                    <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                </>
                ) : selectedCustomers.length > 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-muted-foreground text-lg">No se encontraron facturas</p>
                    </div>
                </div>
                ) : (
                <div className={`flex items-center justify-center py-20 transition-all duration-500 ease-out delay-200 ${showToolbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="text-center">
                    <p className="text-muted-foreground text-lg">Seleccione un cliente para ver las facturas</p>
                    </div>
                </div>
                )}
            </div>
        </div>

        <FiltersPanel
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
        />
    </>
}
