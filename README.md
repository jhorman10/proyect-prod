# Proyección de Inventario - React 19

Aplicación para visualizar y gestionar proyecciones diarias de inventario de productos.

## Características principales
- **Grid de Proyección**: Tabla interactiva con celdas editables que muestran valores de `MakeToOrder`
- **Sistema de colores**: Colores de fondo basados en la lógica `NetFlow + MakeToOrder` vs zonas de riesgo
- **Panel de resumen**: Estadísticas por color y porcentajes de la columna seleccionada
- **Interfaz responsive**: Diseño moderno y profesional
- **Edición en tiempo real**: Recálculo automático de colores y estadísticas

## Lógica de Colores
- **Negro**: Si `(NetFlow + MakeToOrder) == 0`
- **Rojo**: Si `1 <= (NetFlow + MakeToOrder) <= RedZone`
- **Amarillo**: Si `RedZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone`
- **Verde**: Si `RedZone + YellowZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone + GreenZone`
- **Azul**: Si `(NetFlow + MakeToOrder) > RedZone + YellowZone + GreenZone`

## Tecnologías utilizadas
- React 19
- TypeScript
- Vite
- Material UI
- MUI X Data Grid
- Yarn

## Instalación

```bash
yarn install
yarn dev
```

## Uso
1. La aplicación carga automáticamente los datos del archivo `src/data/DatosPruebas.json`
2. Haga clic en cualquier celda del grid para editarla
3. Los colores se recalculan en tiempo real al modificar valores
4. Seleccione una columna de fecha para ver el resumen estadístico