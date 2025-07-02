import React, { useCallback, useMemo } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { ColorService } from "../../services/ColorService";
import { ColorServiceFactory } from "../../services/ColorPalette";

interface CellRendererProps extends GridRenderCellParams {
  onValueChange: (id: string, value: number) => void;
  colorService?: ColorService; // Principio de Inversión de Dependencias
}

/**
 * Componente optimizado para renderizar celdas con colores dinámicos
 * Refactorizado siguiendo principios SOLID
 */
const CellRenderer: React.FC<CellRendererProps> = ({ 
  row,
  onValueChange,
  colorService = ColorServiceFactory.createDefaultColorService() // Default factory
}) => {
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
  const cellStyles = useMemo(() => ({
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
      position: 'relative' as const,
      transition: 'all 0.2s ease'
    },
    input: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: '600',
      color: 'inherit',
      outline: 'none',
      fontFamily: 'Inter, sans-serif'
    }
  }), [colorService, cellColor]);

  // Optimizar handler de cambio con useCallback
  const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    const validValue = isNaN(newValue) ? 0 : Math.max(0, newValue);
    onValueChange(row.id, validValue);
  }, [onValueChange, row.id]);

  // Prevenir propagación de eventos
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  // Auto-seleccionar texto al enfocar
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  }, []);

  return (
    <div style={cellStyles.container}>
      <input
        type="number"
        min="0"
        step="1"
        value={row.MakeToOrder}
        onChange={handleValueChange}
        onClick={handleClick}
        onFocus={handleFocus}
        style={cellStyles.input}
        aria-label={`Make to Order value for ${row.Reference}`}
      />
    </div>
  );
};

export default React.memo(CellRenderer);