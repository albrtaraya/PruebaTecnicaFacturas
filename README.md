# Sistema de Consulta de Facturas

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?logo=jest)

## Descripcion del Proyecto

Sistema moderno de consulta y gestion de facturas construido con **Next.js 16**, **React 19** y **TypeScript**. La aplicacion permite a los usuarios consultar facturas de multiples clientes simultaneamente, filtrarlas por diversos criterios y simular pagos. Incluye modo oscuro/claro, sincronizacion de filtros con URL, vistas adaptables y tests automatizados.

## Tabla de Contenidos

- [Stack Tecnologico](#stack-tecnologico)
- [Caracteristicas Principales](#caracteristicas-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [API Endpoints](#api-endpoints)
- [Componentes Principales](#componentes-principales)
- [Sistema de Contexto](#sistema-de-contexto)
- [Testing](#testing)
- [Instalacion y Configuracion](#instalacion-y-configuracion)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Scripts Disponibles](#scripts-disponibles)

---

## Stack Tecnologico

### Frontend
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Next.js | 16.1.6 | Framework React con App Router |
| React | 19.2.3 | Libreria UI |
| TypeScript | 5+ | Tipado estatico |
| Tailwind CSS | 4 | Estilos utilitarios |
| Radix UI | 1.4.3 | Primitivas UI accesibles |
| Lucide React | 0.563.0 | Iconos |

### Formularios y HTTP
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| React Hook Form | 7.71.1 | Manejo de formularios |
| Axios | 1.13.4 | Cliente HTTP |

### Testing y Calidad
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Jest | 29.7.0 | Framework de testing |
| Testing Library | 16.3.2 | Testing de componentes |
| ESLint | 9 | Linting |
| Prettier | 3.8.1 | Formateo de codigo |

---

## Caracteristicas Principales

### Gestion de Facturas
- Consulta de facturas por ID de cliente
- Soporte para multiples clientes simultaneamente
- Visualizacion en modo tarjetas o tabla
- Estados: Pendiente, Vencida, Pagada
- Simulacion de pagos con actualizacion en tiempo real

### Filtros Avanzados
- Filtro por estado (Todos/Pendiente/Vencido/Pagado)
- Rango de montos (minimo y maximo)
- Rango de fechas (inicio y fin)
- Badges visuales de filtros activos
- Eliminacion individual de filtros
- Sincronizacion automatica con URL (persistencia de filtros)

### Paginacion
- Configuracion de filas por pagina (6, 12, 24, 48)
- Navegacion entre paginas
- Indicador de registros mostrados

### Temas
- Modo claro y oscuro
- Toggle en header
- Persistencia en cookies

### Experiencia de Usuario
- Animaciones de entrada suaves
- Transiciones al buscar y filtrar
- Diseño responsivo (movil, tablet, desktop)
- Vista adaptativa segun dispositivo

---

## Arquitectura del Proyecto

El proyecto utiliza **route groups** de Next.js para separar el codigo del backend y frontend:

```
app/
├── (backend)/      # API Routes y logica del servidor
└── (frontend)/     # Paginas y componentes de UI
```

### Beneficios de esta Arquitectura
- **Claridad:** Separacion clara entre servidor y cliente
- **Escalabilidad:** Facil localizacion de archivos
- **Mantenibilidad:** Contexto claro al editar codigo

---

## Estructura de Carpetas

```
v2.0.0/
│
├── app/
│   ├── (backend)/                    # Backend - Logica del Servidor
│   │   ├── api/
│   │   │   └── invoice/
│   │   │       ├── route.ts          # GET /api/invoice
│   │   │       └── [id]/
│   │   │           └── route.ts      # POST /api/invoice/[id]
│   │   └── mocks/
│   │       ├── MockCustomers.ts      # Datos de usuarios (8 clientes)
│   │       └── MockInvoices.ts       # Datos de facturas (38 facturas)
│   │
│   ├── (frontend)/                   # Frontend - UI y Paginas
│   │   ├── page.tsx                  # Pagina principal
│   │   ├── layout.tsx                # Layout con providers
│   │   └── globals.css               # Estilos globales
│   │
│   └── favicon.ico
│
├── components/
│   ├── header/
│   │   ├── header.tsx                # Header con logo y controles
│   │   └── avatar.tsx                # Avatar del usuario
│   ├── table/
│   │   └── table.tsx                 # Tabla/Cards con paginacion
│   ├── modals/
│   │   └── modalPayment.tsx          # Modal de pago de factura
│   └── ui/                           # Componentes Shadcn/ui (50+)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── filters-panel.tsx         # Panel de filtros lateral
│       ├── invoice-card.tsx          # Tarjeta de factura
│       ├── invoice-table.tsx         # Tabla de facturas
│       ├── theme-toggle.tsx          # Toggle de tema
│       └── ...
│
├── contexts/
│   └── InvoiceContext.tsx            # Context global de facturas
│
├── hooks/
│   └── use-toast.ts                  # Hook de notificaciones
│
├── lib/
│   ├── cookies.ts                    # Manejo de cookies (tema)
│   ├── proxy.ts                      # Instancia Axios
│   ├── utils.ts                      # Utilidades (cn function)
│   └── invoice-utils.ts              # Logica de filtros y paginacion
│
├── __tests__/
│   ├── unit/
│   │   └── invoice-utils.test.ts     # Tests unitarios
│   └── logic/
│       └── invoice-logic.test.ts     # Tests de logica de negocio
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── eslint.config.mjs
```

---

## API Endpoints

### GET `/api/invoice`

**Descripcion:** Obtener facturas de un cliente

**Query Parameters:**
| Parametro | Tipo | Requerido | Descripcion |
|-----------|------|-----------|-------------|
| customerId | string | Si | ID del cliente |

**Response (200 OK):**
```json
{
  "dataset": [
    {
      "id": "1",
      "customerId": "123",
      "invoiceNumber": "INV-2025-001",
      "amount": 1250.0,
      "service": "Electropaz S.A.",
      "period": "2025-11-15",
      "status": "pending",
      "customerName": "Albert"
    }
  ]
}
```

**Errores:**
- `400` - customerId is required
- `500` - Error interno del servidor

---

### POST `/api/invoice/[id]`

**Descripcion:** Procesar pago de una factura

**URL Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| id | string | ID de la factura |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "invoice": {
    "id": "1",
    "status": "paid",
    ...
  }
}
```

**Errores:**
- `404` - Factura no encontrada
- `400` - Esta factura ya ha sido pagada
- `500` - Error interno del servidor

---

## Componentes Principales

### Header (`components/header/header.tsx`)
- Logo de la aplicacion
- Toggle de tema (claro/oscuro)
- Avatar del usuario
- Animacion de entrada suave

### Table (`components/table/table.tsx`)
- **Dos modos de vista:** Cards y Tabla
- **Badges de clientes:** Muestra clientes seleccionados con opcion de eliminar
- **Badges de filtros:** Visualizacion de filtros activos
- **Controles:** Toggle de vista, botones de exportacion (UI)
- **Paginacion:** Navegacion y selector de filas por pagina

### FiltersPanel (`components/ui/filters-panel.tsx`)
- Panel deslizable desde la derecha
- Filtro por estado (Select)
- Rango de monto (Inputs numericos)
- Rango de fechas (Date inputs)
- Botones Aplicar y Limpiar filtros

### InvoiceCard (`components/ui/invoice-card.tsx`)
- Diseño tipo tarjeta responsivo
- Badge de estado con colores
- Informacion: numero, servicio, monto, periodo
- Boton de pago integrado

### InvoiceTable (`components/ui/invoice-table.tsx`)
- Tabla HTML semantica
- Columnas: Factura, Cliente, Servicio, Monto, Periodo, Estado, Accion
- Hover effects en filas
- Scroll horizontal en movil

### ModalPayment (`components/modals/modalPayment.tsx`)
- Detalles completos de la factura
- Formateo de fecha en español
- Estado de carga durante pago
- Notificaciones toast (exito/error)
- Actualizacion automatica de lista post-pago

---

## Sistema de Contexto

### InvoiceContext (`contexts/InvoiceContext.tsx`)

El contexto centraliza todo el estado relacionado con las facturas:

```typescript
interface InvoiceContextType {
  // Busqueda
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Animaciones
  searchBarMovingUp: boolean
  showResults: boolean
  isFirstSearch: boolean

  // Paginacion
  currentPage: number
  setCurrentPage: (page: number) => void

  // Datos
  invoices: any[]           // Facturas filtradas
  mockInvoices: any[]       // Facturas originales

  // Estados
  loading: boolean
  error: string | null

  // Clientes
  selectedCustomers: SelectedCustomer[]
  addCustomer: (customerId: string) => Promise<void>
  removeCustomer: (customerId: string) => void
}
```

### Caracteristicas del Contexto
- Soporte para multiples clientes simultaneos
- Sincronizacion automatica con URL (parametro `customers`)
- Restauracion de estado desde URL al cargar
- Manejo de errores centralizado

---

## Testing

El proyecto incluye tests automatizados con Jest y Testing Library.

### Estructura de Tests

```
__tests__/
├── unit/
│   └── invoice-utils.test.ts    # Tests de funciones utilitarias
└── logic/
    └── invoice-logic.test.ts    # Tests de logica de negocio
```

### Tests Unitarios (`invoice-utils.test.ts`)
- `getFilterDisplayValue`: Formateo de valores de filtros
- `getActiveFilterEntries`: Deteccion de filtros activos
- `parseUrlFilters`: Parseo de filtros desde URL

### Tests de Logica (`invoice-logic.test.ts`)
- Filtrado por estado
- Filtros combinados (estado + monto + fecha)
- Filtrado por rango de fechas
- Sincronizacion URL -> filtros -> URL
- Logica de paginacion

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage
```

---

## Instalacion y Configuracion

### Requisitos Previos
- Node.js 18+
- npm, yarn, pnpm o bun

### Instalacion

```bash
# Clonar repositorio
git clone <repo-url>
cd v2.0.0

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Variables de Entorno

Crear archivo `.env` (opcional):

```env
# Base URL para API
PROXY_URL=http://localhost:3000
```

---

## Credenciales de Prueba

### Usuarios de Prueba

| Customer ID | Nombre | Email |
|-------------|--------|-------|
| `123` | Albert | albert@example.com |
| `456` | Bianca | bianca@example.com |
| `789` | Carlos | carlos@example.com |
| `1011` | Diana | diana@example.com |
| `1213` | Eduardo | eduardo@example.com |
| `1415` | Fernanda | fernanda@example.com |
| `1617` | Gustavo | gustavo@example.com |
| `1819` | Helena | helena@example.com |

### Datos de Ejemplo
- **38 facturas** distribuidas entre los 8 clientes
- **Estados:** Pendiente, Vencida, Pagada
- **Servicios:** Electropaz, TIGO, ENTEL, ANH, AXS, Seguros, Agua, Sociedad Bolivar
- **Montos:** Desde Bs. 430 hasta Bs. 5,200

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Build
npm run build        # Build de produccion
npm run start        # Ejecutar build de produccion

# Calidad de codigo
npm run lint         # Ejecutar ESLint
npm run format       # Formatear con Prettier
npm run format:check # Verificar formato

# Testing
npm test             # Ejecutar tests con Jest
```

---

## Flujo de la Aplicacion

### 1. Busqueda de Cliente

```
Usuario ingresa ID de cliente
        ↓
GET /api/invoice?customerId=123
        ↓
Se muestra badge con nombre del cliente
        ↓
Se cargan facturas del cliente
```

### 2. Multiples Clientes

```
Usuario agrega otro cliente
        ↓
Se agregan facturas al listado existente
        ↓
URL se actualiza: ?customers=123,456
        ↓
Usuario puede eliminar cliente con X en badge
```

### 3. Filtrado

```
Usuario abre panel de filtros
        ↓
Selecciona: Estado=Pendiente, Monto min=1000
        ↓
Click en "Aplicar Filtros"
        ↓
URL: ?customers=123&status=pending&minAmount=1000
        ↓
Se muestran badges de filtros activos
        ↓
Click en X de badge elimina filtro individual
```

### 4. Pago de Factura

```
Usuario hace click en card o boton pagar
        ↓
Abre modal con detalles de factura
        ↓
Click en "Pagar Ahora"
        ↓
POST /api/invoice/[id]
        ↓
Toast de exito
        ↓
Lista se actualiza automaticamente
        ↓
Factura cambia a estado "Pagado"
```

---

## Tecnologias Usadas en Detalle

### Core
```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "typescript": "^5"
}
```

### UI y Estilos
```json
{
  "tailwindcss": "^4",
  "radix-ui": "^1.4.3",
  "lucide-react": "^0.563.0",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.4.0",
  "tw-animate-css": "^1.4.0"
}
```

### Formularios y HTTP
```json
{
  "react-hook-form": "^7.71.1",
  "axios": "^1.13.4",
  "js-cookie": "^3.0.5"
}
```

### Testing
```json
{
  "jest": "29.7.0",
  "jest-environment-jsdom": "29.7.0",
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1"
}
```

---

## Licencia

Este proyecto fue desarrollado como prueba tecnica.

---

**Desarrollado con Next.js 16 y React 19**
