import { ColorZone } from "../interfaces/ProductData";
import { 
  IColorPalette, 
  ITextColorService, 
  ColorService, 
  InventoryZoneColorStrategy 
} from "./ColorService";

/**
 * Implementación de paleta de colores modernos
 * Principio de Responsabilidad Única: Solo maneja la paleta de colores
 */
export class ModernColorPalette implements IColorPalette {
  /**
   * Mapa de colores optimizado con colores CSS predefinidos
   * Usar const assertion para mejor performance
   */
  private readonly backgroundColors = {
    red: '#ffebee',
    yellow: '#fff8e1', 
    green: '#e8f5e8',
    black: '#f5f5f5',
    blue: '#e3f2fd'
  } as const satisfies Record<ColorZone, string>;

  /**
   * Nombres de colores para UI - usando const assertion
   */
  private readonly colorNames = {
    red: 'Rojo',
    yellow: 'Amarillo',
    green: 'Verde', 
    black: 'Negro',
    blue: 'Azul'
  } as const satisfies Record<ColorZone, string>;

  getBackgroundColor(zone: ColorZone): string {
    return this.backgroundColors[zone];
  }

  getColorName(zone: ColorZone): string {
    return this.colorNames[zone];
  }
}

/**
 * Servicio de colores de texto con contraste óptimo
 * Principio de Responsabilidad Única: Solo maneja colores de texto
 */
export class ContrastTextColorService implements ITextColorService {
  private readonly textColors = {
    red: '#c53030',
    yellow: '#d69e2e',
    green: '#38a169',
    blue: '#3182ce',
    black: '#4a5568'
  } as const satisfies Record<ColorZone, string>;

  getTextColor(zone: ColorZone): string {
    return this.textColors[zone];
  }
}

/**
 * Factory para crear servicios de color configurados
 * Principio de Inversión de Dependencias: Facilita la inyección de dependencias
 */
export class ColorServiceFactory {
  static createDefaultColorService() {
    return new ColorService(
      new InventoryZoneColorStrategy(),
      new ModernColorPalette(),
      new ContrastTextColorService()
    );
  }
}
