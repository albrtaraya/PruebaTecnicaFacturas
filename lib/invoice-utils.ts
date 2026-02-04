export interface InvoiceFilters {
  status: string
  minAmount: string
  maxAmount: string
  startDate: string
  endDate: string
}

export interface InvoiceData {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  status: string
  dueDate: string
  service: string
  period: string
  [key: string]: any
}

export const DEFAULT_FILTERS: InvoiceFilters = {
  status: "all",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
}

export const STATUS_LABELS: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  overdue: "Vencido",
}

export const FILTER_LABELS: Record<string, string> = {
  status: "Estado",
  minAmount: "Monto min",
  maxAmount: "Monto max",
  startDate: "Desde",
  endDate: "Hasta",
}

export function filterInvoices(
  invoices: InvoiceData[],
  filters: InvoiceFilters
): InvoiceData[] {
  let filtered = [...invoices]

  if (filters.status !== "all") {
    filtered = filtered.filter((inv) => inv.status === filters.status)
  }
  if (filters.minAmount) {
    filtered = filtered.filter(
      (inv) => inv.amount >= Number.parseFloat(filters.minAmount)
    )
  }
  if (filters.maxAmount) {
    filtered = filtered.filter(
      (inv) => inv.amount <= Number.parseFloat(filters.maxAmount)
    )
  }
  if (filters.startDate) {
    filtered = filtered.filter((inv) => inv.dueDate >= filters.startDate)
  }
  if (filters.endDate) {
    filtered = filtered.filter((inv) => inv.dueDate <= filters.endDate)
  }

  return filtered
}

export function getFilterDisplayValue(key: string, value: string): string {
  if (key === "status") return STATUS_LABELS[value] || value
  if (key === "minAmount" || key === "maxAmount") return `Bs. ${value}`
  return value
}

export function getActiveFilterEntries(
  filters: InvoiceFilters
): [string, string][] {
  return Object.entries(filters).filter(
    ([, value]) => value !== "" && value !== "all"
  ) as [string, string][]
}

export function parseUrlFilters(
  searchParams: URLSearchParams
): InvoiceFilters | null {
  const status = searchParams.get("status")
  const minAmount = searchParams.get("minAmount")
  const maxAmount = searchParams.get("maxAmount")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!status && !minAmount && !maxAmount && !startDate && !endDate) {
    return null
  }

  return {
    status: status || "all",
    minAmount: minAmount || "",
    maxAmount: maxAmount || "",
    startDate: startDate || "",
    endDate: endDate || "",
  }
}

export function buildUrlParams(
  filters: InvoiceFilters
): Record<string, string | null> {
  return {
    status: filters.status !== "all" ? filters.status : null,
    minAmount: filters.minAmount || null,
    maxAmount: filters.maxAmount || null,
    startDate: filters.startDate || null,
    endDate: filters.endDate || null,
  }
}

export function getPaginationInfo(
  totalItems: number,
  currentPage: number,
  rowsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  return {
    totalPages,
    startIndex,
    endIndex: Math.min(endIndex, totalItems),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

export function parseCustomerIdsFromUrl(
  searchParams: URLSearchParams
): string[] {
  const customersParam = searchParams.get("customers")
  if (!customersParam) return []
  return customersParam.split(",").filter(Boolean)
}
