"use client"

import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    status: string
    minAmount: string
    maxAmount: string
    startDate: string
    endDate: string
  }
  onFiltersChange: (filters: any) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function FiltersPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: FiltersPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Filtros</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contenido de filtros */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Filtro por Estado */}
            <div className="space-y-2">
              <Label>Filtrar por Estado</Label>
              <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los Estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Monto */}
            <div className="space-y-2">
              <Label>Filtrar por Monto</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Monto Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => onFiltersChange({ ...filters, minAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Monto Máximo</Label>
                  <Input
                    type="number"
                    placeholder="9999"
                    value={filters.maxAmount}
                    onChange={(e) => onFiltersChange({ ...filters, maxAmount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Fecha */}
            <div className="space-y-2">
              <Label>Filtrar por Fecha</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="p-6 border-t space-y-3">
            <Button onClick={onApplyFilters} className="w-full" size="lg">
              Aplicar Filtros
            </Button>
            <Button onClick={onClearFilters} variant="outline" className="w-full bg-transparent" size="lg">
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
