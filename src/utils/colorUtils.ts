import { ColorZone } from "../interfaces/ProductData";

export const calculateCellColor = (
  netFlow: number,
  makeToOrder: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
): ColorZone => {
  const total = netFlow + makeToOrder;
  
  if (total === 0) return 'black';
  if (total <= redZone) return 'red';
  if (total <= redZone + yellowZone) return 'yellow';
  if (total <= redZone + yellowZone + greenZone) return 'green';
  return 'blue';
};

export const colorMap: Record<ColorZone, string> = {
  red: '#ffcccc',
  yellow: '#ffffcc',
  green: '#ccffcc',
  black: '#000000',
  blue: '#cce5ff'
};

export const colorNames: Record<ColorZone, string> = {
  red: 'Rojo',
  yellow: 'Amarillo',
  green: 'Verde',
  black: 'Negro',
  blue: 'Azul'
};