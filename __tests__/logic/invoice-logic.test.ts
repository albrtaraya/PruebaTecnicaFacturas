import "@testing-library/jest-dom";

import {
  filterInvoices,
  buildUrlParams,
  getPaginationInfo,
  parseCustomerIdsFromUrl,
  parseUrlFilters,
  InvoiceData,
  InvoiceFilters,
  DEFAULT_FILTERS,
} from "@/lib/invoice-utils"

const mockInvoices: InvoiceData[] = [
  {
    id: "1",
    invoiceNumber: "FAC-001",
    customerName: "Cliente A",
    amount: 150,
    status: "pending",
    dueDate: "2024-03-15",
    service: "Internet",
    period: "2024-03-01",
  },
  {
    id: "2",
    invoiceNumber: "FAC-002",
    customerName: "Cliente A",
    amount: 300,
    status: "paid",
    dueDate: "2024-05-20",
    service: "TV Cable",
    period: "2024-05-01",
  },
  {
    id: "3",
    invoiceNumber: "FAC-003",
    customerName: "Cliente B",
    amount: 75,
    status: "overdue",
    dueDate: "2024-01-10",
    service: "Telefono",
    period: "2024-01-01",
  },
  {
    id: "4",
    invoiceNumber: "FAC-004",
    customerName: "Cliente B",
    amount: 500,
    status: "pending",
    dueDate: "2024-07-01",
    service: "Internet",
    period: "2024-07-01",
  },
  {
    id: "5",
    invoiceNumber: "FAC-005",
    customerName: "Cliente C",
    amount: 200,
    status: "paid",
    dueDate: "2024-06-15",
    service: "TV Cable",
    period: "2024-06-01",
  },
]

describe("Logica de filtrado de facturas", () => {
  it("filtra por status, luego al quitar el filtro se recuperan todas", () => {
    // Simula: usuario aplica filtro status=pending
    const pendingFilters: InvoiceFilters = {
      ...DEFAULT_FILTERS,
      status: "pending",
    }
    const pendingInvoices = filterInvoices(mockInvoices, pendingFilters)
    expect(pendingInvoices).toHaveLength(2)
    expect(pendingInvoices.every((inv) => inv.status === "pending")).toBe(true)

    // Simula: usuario quita el filtro de status (removeFilter)
    const clearedFilters: InvoiceFilters = {
      ...pendingFilters,
      status: "all",
    }
    const allInvoices = filterInvoices(mockInvoices, clearedFilters)
    expect(allInvoices).toHaveLength(5)
  })

  it("aplica multiples filtros combinados y mantiene coherencia", () => {
    // Simula: filtrar por status=pending + rango de monto 100-400
    const combinedFilters: InvoiceFilters = {
      status: "pending",
      minAmount: "100",
      maxAmount: "400",
      startDate: "",
      endDate: "",
    }
    const result = filterInvoices(mockInvoices, combinedFilters)

    // Solo FAC-001 (pending, 150) cumple - FAC-004 (pending, 500) excede maxAmount
    expect(result).toHaveLength(1)
    expect(result[0].invoiceNumber).toBe("FAC-001")

    // Simula: quitar filtro de monto maximo
    const withoutMax: InvoiceFilters = { ...combinedFilters, maxAmount: "" }
    const result2 = filterInvoices(mockInvoices, withoutMax)

    // Ahora FAC-001 y FAC-004 cumplen (ambos pending, >= 100)
    expect(result2).toHaveLength(2)
    expect(result2.map((inv) => inv.invoiceNumber).sort()).toEqual([
      "FAC-001",
      "FAC-004",
    ])
  })

  it("filtra por rango de fechas correctamente", () => {
    // Facturas entre marzo y junio 2024
    const dateFilters: InvoiceFilters = {
      status: "all",
      minAmount: "",
      maxAmount: "",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
    }
    const result = filterInvoices(mockInvoices, dateFilters)

    // FAC-001 (2024-03-15), FAC-002 (2024-05-20), FAC-005 (2024-06-15)
    expect(result).toHaveLength(3)
    expect(result.map((inv) => inv.id).sort()).toEqual(["1", "2", "5"])

    // Verificar que FAC-003 (enero) y FAC-004 (julio) quedan excluidas
    expect(result.find((inv) => inv.id === "3")).toBeUndefined()
    expect(result.find((inv) => inv.id === "4")).toBeUndefined()
  })
})

describe("Logica de sincronizacion con URL", () => {
  it("buildUrlParams genera null para filtros inactivos y valores para activos", () => {
    const filters: InvoiceFilters = {
      status: "paid",
      minAmount: "100",
      maxAmount: "",
      startDate: "",
      endDate: "2024-12-31",
    }
    const params = buildUrlParams(filters)

    expect(params).toEqual({
      status: "paid",
      minAmount: "100",
      maxAmount: null,
      startDate: null,
      endDate: "2024-12-31",
    })
  })

  it("buildUrlParams genera todos null cuando no hay filtros", () => {
    const params = buildUrlParams(DEFAULT_FILTERS)

    expect(params).toEqual({
      status: null,
      minAmount: null,
      maxAmount: null,
      startDate: null,
      endDate: null,
    })
  })

  it("el ciclo URL -> parse -> filter -> buildUrlParams es consistente", () => {
    // Simula: URL tiene filtros -> se parsean -> se aplican -> se reconstruye URL
    const originalUrl = new URLSearchParams(
      "customers=123&status=pending&minAmount=100&endDate=2024-12-31"
    )

    // Paso 1: parsear filtros de URL
    const parsedFilters = parseUrlFilters(originalUrl)!
    expect(parsedFilters).not.toBeNull()
    expect(parsedFilters.status).toBe("pending")

    // Paso 2: aplicar filtros sobre las facturas
    const filtered = filterInvoices(mockInvoices, parsedFilters)
    expect(filtered.every((inv) => inv.status === "pending")).toBe(true)
    expect(filtered.every((inv) => inv.amount >= 100)).toBe(true)
    expect(filtered.every((inv) => inv.dueDate <= "2024-12-31")).toBe(true)

    // Paso 3: reconstruir URL params
    const rebuiltParams = buildUrlParams(parsedFilters)
    expect(rebuiltParams.status).toBe("pending")
    expect(rebuiltParams.minAmount).toBe("100")
    expect(rebuiltParams.maxAmount).toBeNull()
    expect(rebuiltParams.startDate).toBeNull()
    expect(rebuiltParams.endDate).toBe("2024-12-31")

    // Paso 4: parsear los customers de la URL
    const customerIds = parseCustomerIdsFromUrl(originalUrl)
    expect(customerIds).toEqual(["123"])
  })
})

describe("Logica de paginacion", () => {
  it("calcula correctamente paginas, indices y flags de navegacion", () => {
    const info = getPaginationInfo(20, 1, 6)
    expect(info.totalPages).toBe(4) // ceil(20/6) = 4
    expect(info.startIndex).toBe(0)
    expect(info.endIndex).toBe(6)
    expect(info.hasPreviousPage).toBe(false)
    expect(info.hasNextPage).toBe(true)
  })

  it("ultima pagina muestra items restantes", () => {
    const info = getPaginationInfo(20, 4, 6)
    expect(info.startIndex).toBe(18)
    expect(info.endIndex).toBe(20) // solo 2 items en la ultima pagina
    expect(info.hasPreviousPage).toBe(true)
    expect(info.hasNextPage).toBe(false)
  })

  it("con 0 items devuelve 0 paginas", () => {
    const info = getPaginationInfo(0, 1, 6)
    expect(info.totalPages).toBe(0)
    expect(info.startIndex).toBe(0)
    expect(info.endIndex).toBe(0)
    expect(info.hasNextPage).toBe(false)
    expect(info.hasPreviousPage).toBe(false)
  })
})
