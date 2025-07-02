import { ColorZone } from "../interfaces/ProductData";

/**
 * Interfaz para estrategias de cálculo de color
 * Principio Abierto/Cerrado: Permite extender con nuevas estrategias sin modificar código existente
 */
export interface IColorCalculationStrategy {
  calculateColor(
    netFlow: number,
    makeToOrder: number,
    redZone: number,
    yellowZone: number,
    greenZone: number
  ): ColorZone;
}

/**
 * Interfaz para paletas de colores
 * Principio de Segregación de Interfaces: Interface específica para paletas
 */
export interface IColorPalette {
  getBackgroundColor(zone: ColorZone): string;
  getColorName(zone: ColorZone): string;
}

/**
 * Interfaz para servicios de color de texto
 * Principio de Segregación de Interfaces: Interface específica para colores de texto
 */
export interface ITextColorService {
  getTextColor(zone: ColorZone): string;
}

/**
 * Estrategia de cálculo de color basada en zonas de inventario
 * Principio de Responsabilidad Única: Solo se encarga del cálculo de colores
 */
export class InventoryZoneColorStrategy implements IColorCalculationStrategy {
  calculateColor(
    netFlow: number,
    makeToOrder: number,
    redZone: number,
    yellowZone: number,
    greenZone: number
  ): ColorZone {
    const total = netFlow + makeToOrder;
    
    // Optimización: early return para casos especiales
    if (total === 0) return 'black';
    
    // Precalcular límites para evitar operaciones repetidas
    const yellowLimit = redZone + yellowZone;
    const greenLimit = yellowLimit + greenZone;
    
    // Usar lógica de rangos optimizada
    if (total >= 1 && total <= redZone) return 'red';
    if (total <= yellowLimit) return 'yellow';
    if (total <= greenLimit) return 'green';
    
    return 'blue';
  }
}

/**
 * Servicio de colores - Principio de Inversión de Dependencias
 * Depende de abstracciones, no de implementaciones concretas
 */
export class ColorService {
  private readonly colorStrategy: IColorCalculationStrategy;
  private readonly colorPalette: IColorPalette;
  private readonly textColorService: ITextColorService;

  constructor(
    colorStrategy: IColorCalculationStrategy,
    colorPalette: IColorPalette,
    textColorService: ITextColorService
  ) {
    this.colorStrategy = colorStrategy;
    this.colorPalette = colorPalette;
    this.textColorService = textColorService;
  }

  /**
   * Calcula el color de una celda basado en los datos del producto
   */
  calculateCellColor(
    netFlow: number,
    makeToOrder: number,
    redZone: number,
    yellowZone: number,
    greenZone: number
  ): ColorZone {
    return this.colorStrategy.calculateColor(
      netFlow,
      makeToOrder,
      redZone,
      yellowZone,
      greenZone
    );
  }

  /**
   * Obtiene el color de fondo para una zona
   */
  getBackgroundColor(zone: ColorZone): string {
    return this.colorPalette.getBackgroundColor(zone);
  }

  /**
   * Obtiene el color de texto para una zona
   */
  getTextColor(zone: ColorZone): string {
    return this.textColorService.getTextColor(zone);
  }

  /**
   * Obtiene el nombre legible de una zona de color
   */
  getColorName(zone: ColorZone): string {
    return this.colorPalette.getColorName(zone);
  }
}
