import { ColorZone } from "../interfaces/ProductData";

/**
 * Calcula el color de la celda basado en la lógica de negocio optimizada
 * @param netFlow - Valor de inventario neto
 * @param makeToOrder - Pedido de abastecimiento
 * @param redZone - Zona roja límite
 * @param yellowZone - Zona amarilla límite  
 * @param greenZone - Zona verde límite
 * @returns ColorZone correspondiente
 */
export const calculateCellColor = (
  netFlow: number,
  makeToOrder: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
): ColorZone => {
  const total = netFlow + makeToOrder;
  
  // Optimización: early return para casos más comunes primero
  if (total === 0) return 'black';
  
  // Precalcular límites para evitar operaciones repetidas
  const yellowLimit = redZone + yellowZone;
  const greenLimit = yellowLimit + greenZone;
  
  // Usar lógica de rangos optimizada
  if (total >= 1 && total <= redZone) return 'red';
  if (total <= yellowLimit) return 'yellow';
  if (total <= greenLimit) return 'green';
  
  return 'blue';
};

/**
 * Mapa de colores optimizado con colores CSS predefinidos
 * Usar const assertion para mejor performance
 */
export const colorMap = {
  red: '#ffebee',
  yellow: '#fff8e1', 
  green: '#e8f5e8',
  black: '#f5f5f5',
  blue: '#e3f2fd'
} as const satisfies Record<ColorZone, string>;

/**
 * Nombres de colores para UI - usando const assertion
 */
export const colorNames = {
  red: 'Rojo',
  yellow: 'Amarillo',
  green: 'Verde', 
  black: 'Negro',
  blue: 'Azul'
} as const satisfies Record<ColorZone, string>;

/**
 * Función helper para obtener color de texto con contraste óptimo
 */
export const getTextColorForBackground = (backgroundColor: ColorZone): string => {
  const textColorMap = {
    red: '#c53030',
    yellow: '#d69e2e',
    green: '#38a169',
    blue: '#3182ce',
    black: '#4a5568'
  } as const;
  
  return textColorMap[backgroundColor];
};