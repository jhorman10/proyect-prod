import { ProductData } from "../interfaces/ProductData";

/**
 * Tipo para la estructura de datos JSON esperada
 */
interface JsonDataSource {
  Datos: unknown[];
}

/**
 * Abstracción del servicio de datos - Principio de Inversión de Dependencias
 */
export interface IDataService {
  loadData(): Promise<ProductData[]>;
  validateData(data: unknown[]): ProductData[];
}

/**
 * Implementación concreta del servicio de datos JSON
 * Principio de Responsabilidad Única: Solo se encarga de cargar y validar datos
 */
export class JsonDataService implements IDataService {
  private readonly dataSource: JsonDataSource;

  constructor(dataSource: JsonDataSource) {
    this.dataSource = dataSource;
  }

  async loadData(): Promise<ProductData[]> {
    try {
      if (!this.dataSource?.Datos || !Array.isArray(this.dataSource.Datos)) {
        throw new Error('Invalid data source format');
      }
      
      return this.validateData(this.dataSource.Datos);
    } catch (error) {
      console.error('Error loading data from JSON:', error);
      throw new Error('Failed to load data');
    }
  }

  validateData(rawData: unknown[]): ProductData[] {
    const validator = new DataValidator();
    return rawData
      .filter((item): item is Record<string, unknown> => 
        typeof item === 'object' && item !== null
      )
      .map((item, index) => validator.transformToProductData(item, index))
      .filter(validator.isValidProductData);
  }
}

/**
 * Validador de datos - Principio de Responsabilidad Única
 */
class DataValidator {
  /**
   * Genera un ID único para cada producto
   */
  private generateProductId(item: Record<string, unknown>, index: number): string {
    const centerCode = (item?.CenterCode as string) || 'unknown';
    const reference = (item?.Reference as string) || 'unknown';
    return `${centerCode}-${reference}-${index}`;
  }

  /**
   * Transforma datos crudos a ProductData
   */
  transformToProductData(item: Record<string, unknown>, index: number): ProductData {
    return {
      id: this.generateProductId(item, index),
      CenterCode: (item?.CenterCode as string) || '',
      Reference: (item?.Reference as string) || '',
      VisibleForecastedDate: (item?.VisibleForecastedDate as string) || '',
      NetFlow: Number(item?.NetFlow) || 0,
      GreenZone: Number(item?.GreenZone) || 0,
      YellowZone: Number(item?.YellowZone) || 0,
      RedZone: Number(item?.RedZone) || 0,
      MakeToOrder: Number(item?.MakeToOrder) || 0
    };
  }

  /**
   * Valida que un item tenga todos los campos requeridos
   */
  isValidProductData(item: ProductData): boolean {
    return Boolean(
      item &&
      typeof item.CenterCode === 'string' && item.CenterCode.length > 0 &&
      typeof item.Reference === 'string' && item.Reference.length > 0 &&
      typeof item.VisibleForecastedDate === 'string' && item.VisibleForecastedDate.length > 0 &&
      typeof item.NetFlow === 'number' && !isNaN(item.NetFlow) &&
      typeof item.GreenZone === 'number' && !isNaN(item.GreenZone) &&
      typeof item.YellowZone === 'number' && !isNaN(item.YellowZone) &&
      typeof item.RedZone === 'number' && !isNaN(item.RedZone) &&
      typeof item.MakeToOrder === 'number' && !isNaN(item.MakeToOrder)
    );
  }
}
