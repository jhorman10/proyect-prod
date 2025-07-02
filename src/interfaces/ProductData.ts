export interface ProductData {
  id: string;
  CenterCode: string;
  Reference: string;
  VisibleForecastedDate: string; // Mantener como string para simplificar
  NetFlow: number;
  GreenZone: number;
  YellowZone: number;
  RedZone: number;
  MakeToOrder: number;
}

export type ColorZone = 'red' | 'yellow' | 'green' | 'black' | 'blue';