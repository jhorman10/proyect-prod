import { ProductData } from "../interfaces/ProductData";

/**
 * Estructura de datos para las filas del grid
 */
export interface GridRow {
  id: string;
  CenterCode: string;
  Reference: string;
  [date: string]: string | { MakeToOrder: number; data: ProductData | null };
}

/**
 * Interfaz para el servicio de transformación de datos del grid
 * Principio de Segregación de Interfaces: Interface específica para transformación
 */
export interface IGridDataTransformer {
  transformToGridRows(data: ProductData[]): GridRow[];
  getUniqueDates(data: ProductData[]): string[];
  generateProductKey(centerCode: string, reference: string): string;
}

/**
 * Servicio de transformación de datos del grid
 * Principio de Responsabilidad Única: Solo se encarga de transformar datos para el grid
 */
export class GridDataTransformer implements IGridDataTransformer {
  /**
   * Transforma los datos de productos a filas del grid
   */
  transformToGridRows(data: ProductData[]): GridRow[] {
    // Agrupar datos por producto (centro + referencia)
    const productMap = new Map<string, GridRow>();
    
    for (const item of data) {
      const productKey = this.generateProductKey(item.CenterCode, item.Reference);
      
      if (!productMap.has(productKey)) {
        productMap.set(productKey, {
          id: productKey,
          CenterCode: item.CenterCode,
          Reference: item.Reference
        });
      }
      
      const row = productMap.get(productKey)!;
      row[item.VisibleForecastedDate] = {
        MakeToOrder: item.MakeToOrder,
        data: item
      };
    }
    
    return Array.from(productMap.values());
  }

  /**
   * Obtiene fechas únicas ordenadas
   */
  getUniqueDates(data: ProductData[]): string[] {
    const dateSet = new Set(data.map(item => item.VisibleForecastedDate));
    return Array.from(dateSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  /**
   * Genera una clave única para un producto
   */
  generateProductKey(centerCode: string, reference: string): string {
    return `${centerCode}-${reference}`;
  }
}

/**
 * Interfaz para el servicio de formateo de fechas
 * Principio de Segregación de Interfaces: Interface específica para formateo
 */
export interface IDateFormatter {
  formatDateHeader(dateString: string): string;
  formatDateForDisplay(dateString: string): string;
}

/**
 * Servicio de formateo de fechas
 * Principio de Responsabilidad Única: Solo se encarga del formateo de fechas
 */
export class DateFormatter implements IDateFormatter {
  /**
   * Formatea fechas para los headers del grid
   */
  formatDateHeader(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Formatea fechas para mostrar al usuario
   */
  formatDateForDisplay(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }
}
