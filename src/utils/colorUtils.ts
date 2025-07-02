import { ColorZone } from "../interfaces/ProductData";

export const calculateCellColor = (
  netFlow: number,
  makeToOrder: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
): ColorZone => {
  const total = netFlow + makeToOrder;
  
  // Negro: Si (NetFlow + MakeToOrder) == 0
  if (total === 0) return 'black';
  
  // Rojo: Si 1 <= (NetFlow + MakeToOrder) <= RedZone
  if (total >= 1 && total <= redZone) return 'red';
  
  // Amarillo: Si RedZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone
  if (total > redZone && total <= redZone + yellowZone) return 'yellow';
  
  // Verde: Si RedZone + YellowZone < (NetFlow + MakeToOrder) <= RedZone + YellowZone + GreenZone
  if (total > redZone + yellowZone && total <= redZone + yellowZone + greenZone) return 'green';
  
  // Azul: Si (NetFlow + MakeToOrder) > RedZone + YellowZone + GreenZone
  return 'blue';
};

export const colorMap: Record<ColorZone, string> = {
  red: '#ffebee',       // Rojo suave y moderno
  yellow: '#fff8e1',    // Amarillo suave y elegante
  green: '#e8f5e8',     // Verde suave y relajante
  black: '#f5f5f5',     // Gris claro neutro
  blue: '#e3f2fd'       // Azul suave y profesional
};

export const colorNames: Record<ColorZone, string> = {
  red: 'Rojo',
  yellow: 'Amarillo',
  green: 'Verde',
  black: 'Negro',
  blue: 'Azul'
};