# Sistema de Proyección de Inventario - Arquitectura SOLID Completa

Aplicación empresarial para visualizar y gestionar proyecciones diarias de inventario de productos con **arquitectura SOLID completa**, **hooks personalizados** y **componentes 100% presentacionales**.

## 🏗️ Arquitectura SOLID Implementada

### **Separación Completa de Responsabilidades**

- **Componentes TSX**: 100% presentacionales, solo renderizado visual
- **Hooks Personalizados**: Toda la lógica de negocio encapsulada
- **Servicios**: Lógica de dominio con responsabilidades específicas
- **Factory Pattern**: Inyección de dependencias y configuración

## 🚀 Características principales

- **Grid de Proyección Inteligente**: Tabla interactiva optimizada con celdas editables
- **Sistema de Colores Dinámico**: Lógica basada en `NetFlow + MakeToOrder` vs zonas de riesgo
- **Panel de Resumen Estadístico**: Métricas en tiempo real con componentes memoizados
- **Interfaz Moderna**: Diseño responsivo con glassmorphism y micro-interacciones
- **Edición en Tiempo Real**: Recálculo optimizado de colores y estadísticas
- **Arquitectura SOLID**: Principios aplicados completamente
- **TypeScript Estricto**: 100% type safety sin uso de `any`
- **Performance Optimizada**: Memoización estratégica y hooks especializados

## 🎯 Lógica de Colores (Optimizada)

- **Negro**: Si `(NetFlow + MakeToOrder) == 0`
- **Rojo**: Si `1 <= (NetFlow + MakeToOrder) <= RedZone`
- **Amarillo**: Si `RedZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone`
- **Verde**: Si `RedZone + YellowZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone + GreenZone`
- **Azul**: Si `(NetFlow + MakeToOrder) > RedZone + YellowZone + GreenZone`

## 🔧 Hooks Personalizados Implementados

### **Lógica de Aplicación**
- `useApp` - Estado principal y configuración de servicios
- `useProjectionData` - Carga de datos y gestión de estado

### **Lógica de UI**
- `useProjectionGrid` - Transformación y manejo del grid
- `useCellRenderer` - Lógica de renderizado de celdas  
- `useSummaryPanel` - Cálculos estadísticos y formateo

## 🏛️ Servicios SOLID

### **Gestión de Datos**
- `DataService` - Carga y validación (SRP, DIP)
- `MetricsService` - Cálculo de métricas del sistema (SRP)

### **Lógica de Negocio**
- `ColorService` - Cálculo de colores y zonas (OCP, LSP, ISP)
- `StatisticsService` - Cálculos estadísticos (SRP, DIP)
- `GridDataService` - Transformación de datos (SRP, ISP)

### **Configuración**
- `ColorServiceFactory` - Factory para servicios de color (DIP)
- `StatisticsServiceFactory` - Factory para servicios estadísticos (DIP)

## 📋 Principios SOLID Aplicados

### ✅ **S**ingle Responsibility Principle
- Cada componente, hook y servicio tiene una responsabilidad específica
- Separación clara entre lógica de negocio y presentación

### ✅ **O**pen/Closed Principle  
- Servicios extensibles mediante interfaces y estrategias
- Nuevas funcionalidades sin modificar código existente

### ✅ **L**iskov Substitution Principle
- Implementaciones intercambiables de servicios
- Contratos bien definidos mediante interfaces

### ✅ **I**nterface Segregation Principle
- Interfaces pequeñas y específicas
- Clientes no dependen de métodos que no usan

### ✅ **D**ependency Inversion Principle
- Dependencia de abstracciones, no de implementaciones
- Inyección de dependencias completa

## 🛠 Tecnologías utilizadas

- **React 19** (hooks personalizados avanzados)
- **TypeScript 5.8** (configuración estricta, 0% any)
- **Vite 7.0** (build tool moderno)
- **Material UI 7.2** (componentes optimizados)
- **MUI X Data Grid 8.6** (tabla virtualizada)
- **Yarn** (gestión de dependencias)

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd proyect-prod

# Instalar dependencias
yarn install

# Ejecutar en desarrollo
yarn dev

# Compilar para producción
yarn build

# Previsualizar build
yarn preview
```

## 🎮 Uso de la Aplicación

1. **Carga Automática**: Los datos se procesan automáticamente desde `src/data/DatosPruebas.json`
2. **Edición Inteligente**: Haga clic en cualquier celda para editar el valor (validación automática)
3. **Colores Dinámicos**: Los colores se recalculan automáticamente al modificar valores
4. **Resumen Estadístico**: Seleccione una columna de fecha para ver estadísticas detalladas

## 📁 Estructura del Proyecto

```
src/
├── components/                    # Componentes presentacionales puros
│   ├── ProjectionGrid/
│   │   ├── index.tsx             # ✅ Solo renderizado del grid
│   │   └── CellRenderer.tsx      # ✅ Solo renderizado de celdas
│   └── SummaryPanel/
│       └── index.tsx             # ✅ Solo renderizado del panel
├── hooks/                        # Lógica de negocio encapsulada
│   ├── useApp.ts                # ✅ Lógica principal de la app
│   ├── useProjectionData.ts     # ✅ Gestión de datos
│   ├── useProjectionGrid.ts     # ✅ Lógica del grid
│   ├── useCellRenderer.ts       # ✅ Lógica de celdas
│   └── useSummaryPanel.ts       # ✅ Lógica del panel de resumen
├── services/                     # Servicios SOLID especializados
│   ├── DataService.ts           # ✅ Carga y validación de datos
│   ├── ColorService.ts          # ✅ Cálculos de color y zonas
│   ├── ColorPalette.ts          # ✅ Paletas y factories
│   ├── StatisticsService.ts     # ✅ Cálculos estadísticos
│   ├── MetricsService.ts        # ✅ Métricas del sistema
│   └── GridDataService.ts       # ✅ Transformación de datos
├── interfaces/
│   └── ProductData.ts           # ✅ Contratos TypeScript
├── data/
│   └── DatosPruebas.json        # ✅ Datos de prueba
└── App.tsx                      # ✅ Solo renderizado principal
```
