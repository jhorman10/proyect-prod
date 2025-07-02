import { ProductData, ColorZone } from "../interfaces/ProductData";
import { ColorService } from "./ColorService";

/**
 * Estructura para estadísticas de colores
 */
export interface ColorStats {
  count: number;
  percentage: string;
}

/**
 * Interfaz para el servicio de estadísticas
 * Principio de Segregación de Interfaces: Interface específica para estadísticas
 */
export interface IStatisticsService {
  calculateColorStats(data: ProductData[], selectedDate: string): {
    stats: Record<ColorZone, ColorStats>;
    total: number;
  };
  calculateGeneralStats(data: ProductData[]): {
    totalProducts: number;
    averageNetFlow: number;
    averageMakeToOrder: number;
  };
}

/**
 * Servicio de estadísticas que sigue principios SOLID
 * Principio de Responsabilidad Única: Solo maneja cálculo de estadísticas
 */
export class StatisticsService implements IStatisticsService {
  private readonly colorService: ColorService;

  constructor(colorService: ColorService) {
    this.colorService = colorService;
  }

  /**
   * Calcula estadísticas de colores para una fecha específica
   */
  calculateColorStats(data: ProductData[], selectedDate: string): {
    stats: Record<ColorZone, ColorStats>;
    total: number;
  } {
    const stats: Record<ColorZone, ColorStats> = {
      red: { count: 0, percentage: "0%" },
      yellow: { count: 0, percentage: "0%" },
      green: { count: 0, percentage: "0%" },
      black: { count: 0, percentage: "0%" },
      blue: { count: 0, percentage: "0%" }
    };
    
    const filteredData = data.filter(item => item.VisibleForecastedDate === selectedDate);
    
    // Contar cada color usando el servicio de color
    for (const item of filteredData) {
      const color = this.colorService.calculateCellColor(
        item.NetFlow,
        item.MakeToOrder,
        item.RedZone,
        item.YellowZone,
        item.GreenZone
      );
      stats[color].count++;
    }
    
    // Calcular porcentajes
    const total = filteredData.length;
    if (total > 0) {
      for (const color of Object.keys(stats) as ColorZone[]) {
        stats[color].percentage = `${((stats[color].count / total) * 100).toFixed(1)}%`;
      }
    }
    
    return { stats, total };
  }

  /**
   * Calcula estadísticas generales de los datos
   */
  calculateGeneralStats(data: ProductData[]): {
    totalProducts: number;
    averageNetFlow: number;
    averageMakeToOrder: number;
  } {
    if (data.length === 0) {
      return {
        totalProducts: 0,
        averageNetFlow: 0,
        averageMakeToOrder: 0
      };
    }

    const totalNetFlow = data.reduce((sum, item) => sum + item.NetFlow, 0);
    const totalMakeToOrder = data.reduce((sum, item) => sum + item.MakeToOrder, 0);

    return {
      totalProducts: data.length,
      averageNetFlow: Math.round(totalNetFlow / data.length * 100) / 100,
      averageMakeToOrder: Math.round(totalMakeToOrder / data.length * 100) / 100
    };
  }
}

/**
 * Factory para crear el servicio de estadísticas
 */
export class StatisticsServiceFactory {
  static createDefaultStatisticsService(colorService: ColorService): StatisticsService {
    return new StatisticsService(colorService);
  }
}
