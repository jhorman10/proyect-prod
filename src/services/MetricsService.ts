import { ProductData } from "../interfaces/ProductData";

/**
 * Interfaz para métricas del sistema
 */
export interface IMetrics {
  totalProducts: number;
  uniqueCenters: number;
  uniqueReferences: number;
  dateRange: {
    start: number;
    end: number;
  } | null;
}

/**
 * Interfaz para calculadora de métricas
 * Principio de Segregación de Interfaces: Interface específica para cálculo de métricas
 */
export interface IMetricsCalculator {
  calculateMetrics(data: ProductData[]): IMetrics;
}

/**
 * Implementación de calculadora de métricas
 * Principio de Responsabilidad Única: Solo se encarga de calcular métricas
 */
export class MetricsCalculator implements IMetricsCalculator {
  calculateMetrics(data: ProductData[]): IMetrics {
    if (data.length === 0) {
      return {
        totalProducts: 0,
        uniqueCenters: 0,
        uniqueReferences: 0,
        dateRange: null
      };
    }

    const uniqueCenters = new Set(data.map(item => item.CenterCode));
    const uniqueReferences = new Set(data.map(item => item.Reference));
    
    const dates = data
      .map(item => new Date(item.VisibleForecastedDate).getTime())
      .filter(time => !isNaN(time));

    const dateRange = dates.length > 0 ? {
      start: Math.min(...dates),
      end: Math.max(...dates)
    } : null;

    return {
      totalProducts: data.length,
      uniqueCenters: uniqueCenters.size,
      uniqueReferences: uniqueReferences.size,
      dateRange
    };
  }
}

/**
 * Servicio de métricas con caché
 * Principio de Responsabilidad Única: Maneja métricas con optimización de caché
 */
export class MetricsService {
  private readonly calculator: IMetricsCalculator;
  private cache: Map<string, IMetrics> = new Map();

  constructor(calculator: IMetricsCalculator) {
    this.calculator = calculator;
  }

  /**
   * Obtiene métricas con caché para mejorar rendimiento
   */
  getMetrics(data: ProductData[]): IMetrics {
    const cacheKey = this.generateCacheKey(data);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const metrics = this.calculator.calculateMetrics(data);
    this.cache.set(cacheKey, metrics);
    
    // Limpiar caché si se vuelve muy grande
    if (this.cache.size > 10) {
      this.clearCache();
    }

    return metrics;
  }

  /**
   * Limpia la caché de métricas
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Genera una clave de caché basada en los datos
   */
  private generateCacheKey(data: ProductData[]): string {
    return `${data.length}-${data.map(d => d.id).join(',')}`;
  }
}
