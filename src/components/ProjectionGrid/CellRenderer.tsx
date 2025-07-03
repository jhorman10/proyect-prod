import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { ProductData } from "../../interfaces/ProductData";
import { ColorService } from "../../services/ColorService";
import { useCellRenderer } from "../../hooks/useCellRenderer";

interface CellRendererProps extends GridRenderCellParams {
  onValueChange: (id: string, value: number) => void;
  colorService?: ColorService;
}

/**
 * Componente presentacional puro para renderizar celdas
 * Principio de Responsabilidad Única: Solo se encarga del renderizado visual
 */
const CellRenderer: React.FC<CellRendererProps> = ({ 
  row,
  onValueChange,
  colorService
}) => {
  // Toda la lógica está encapsulada en el hook personalizado
  const {
    cellStyles,
    handleValueChange,
    handleClick,
    handleFocus
  } = useCellRenderer(row as ProductData, onValueChange, { colorService });

  // Componente puramente presentacional
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