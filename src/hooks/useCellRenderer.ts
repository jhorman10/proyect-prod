import { useCallback, useMemo } from "react";
import { ProductData, ColorZone } from "../interfaces/ProductData";
import { ColorService } from "../services/ColorService";
import { ColorServiceFactory } from "../services/ColorPalette";

/**
 * Interfaz para la configuración del hook
 */
interface UseCellRendererConfig {
  colorService?: ColorService;
}

/**
 * Interfaz para los estilos de la celda
 */
export interface CellStyles {
  container: React.CSSProperties;
  input: React.CSSProperties;
}

/**
 * Interfaz para el resultado del hook
 */
interface UseCellRendererResult {
  // Color calculado
  cellColor: ColorZone;
  
  // Estilos memoizados
  cellStyles: CellStyles;
  
  // Handlers
  handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (event: React.MouseEvent) => void;
  handleFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Hook personalizado para manejar la lógica del renderizador de celdas
 * Principio de Responsabilidad Única: Solo maneja lógica de renderizado de celdas
 */
export const useCellRenderer = (
  row: ProductData,
  onValueChange: (id: string, value: number) => void,
  config: UseCellRendererConfig = {}
): UseCellRendererResult => {
  const { colorService = ColorServiceFactory.createDefaultColorService() } = config;

  // Memoizar el cálculo del color usando el servicio
  const cellColor = useMemo(() => 
    colorService.calculateCellColor(
      row.NetFlow,
      row.MakeToOrder,
      row.RedZone,
      row.YellowZone,
      row.GreenZone
    ), [colorService, row.NetFlow, row.MakeToOrder, row.RedZone, row.YellowZone, row.GreenZone]
  );

  // Memoizar estilos usando el servicio de color
  const cellStyles = useMemo((): CellStyles => ({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorService.getBackgroundColor(cellColor),
      fontSize: '14px',
      fontWeight: '600',
      color: colorService.getTextColor(cellColor),
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease'
    },
    input: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'inherit',
      outline: 'none',
      fontFamily: 'Inter, sans-serif'
    }
  }), [colorService, cellColor]);

  // Handler optimizado para cambio de valor
  const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    const validValue = isNaN(newValue) ? 0 : Math.max(0, newValue);
    onValueChange(row.id, validValue);
  }, [onValueChange, row.id]);

  // Handler para prevenir propagación de eventos
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  // Handler para auto-seleccionar texto al enfocar
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  }, []);

  return {
    cellColor,
    cellStyles,
    handleValueChange,
    handleClick,
    handleFocus
  };
};
