import "@testing-library/jest-dom";

import {
  getFilterDisplayValue,
  getActiveFilterEntries,
  parseUrlFilters,
  DEFAULT_FILTERS,
} from "@/lib/invoice-utils"

describe("getFilterDisplayValue", () => {
  it("devuelve la etiqueta en español para valores de status", () => {
    expect(getFilterDisplayValue("status", "paid")).toBe("Pagado")
    expect(getFilterDisplayValue("status", "pending")).toBe("Pendiente")
    expect(getFilterDisplayValue("status", "overdue")).toBe("Vencido")
  })

  it("devuelve el valor original si el status no tiene etiqueta", () => {
    expect(getFilterDisplayValue("status", "cancelled")).toBe("cancelled")
  })

  it("formatea montos con prefijo Bs.", () => {
    expect(getFilterDisplayValue("minAmount", "100")).toBe("Bs. 100")
    expect(getFilterDisplayValue("maxAmount", "500.50")).toBe("Bs. 500.50")
  })

  it("devuelve el valor tal cual para fechas", () => {
    expect(getFilterDisplayValue("startDate", "2024-01-01")).toBe("2024-01-01")
    expect(getFilterDisplayValue("endDate", "2024-12-31")).toBe("2024-12-31")
  })
})

describe("getActiveFilterEntries", () => {
  it("devuelve array vacio cuando no hay filtros activos", () => {
    const result = getActiveFilterEntries(DEFAULT_FILTERS)
    expect(result).toEqual([])
  })

  it("detecta solo los filtros que tienen valor activo", () => {
    const filters = {
      status: "paid",
      minAmount: "100",
      maxAmount: "",
      startDate: "",
      endDate: "",
    }
    const result = getActiveFilterEntries(filters)
    expect(result).toEqual([
      ["status", "paid"],
      ["minAmount", "100"],
    ])
  })

  it("ignora status='all' como filtro activo", () => {
    const filters = {
      status: "all",
      minAmount: "",
      maxAmount: "500",
      startDate: "",
      endDate: "2024-12-31",
    }
    const result = getActiveFilterEntries(filters)
    expect(result).toEqual([
      ["maxAmount", "500"],
      ["endDate", "2024-12-31"],
    ])
  })
})

describe("parseUrlFilters", () => {
  it("devuelve null cuando no hay parametros de filtro en la URL", () => {
    const params = new URLSearchParams("")
    expect(parseUrlFilters(params)).toBeNull()
  })

  it("devuelve null cuando solo hay parametros no relacionados con filtros", () => {
    const params = new URLSearchParams("customers=123,456")
    expect(parseUrlFilters(params)).toBeNull()
  })

  it("parsea correctamente todos los filtros de la URL", () => {
    const params = new URLSearchParams(
      "status=pending&minAmount=50&maxAmount=200&startDate=2024-01-01&endDate=2024-06-30"
    )
    expect(parseUrlFilters(params)).toEqual({
      status: "pending",
      minAmount: "50",
      maxAmount: "200",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
    })
  })

  it("usa valores por defecto para filtros ausentes", () => {
    const params = new URLSearchParams("status=paid")
    expect(parseUrlFilters(params)).toEqual({
      status: "paid",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    })
  })
})
