import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { calculateCellColor, colorMap } from "../../utils/colorUtils";

interface CellRendererProps extends GridRenderCellParams {
  onValueChange: (id: string, value: number) => void;
}

const CellRenderer: React.FC<CellRendererProps> = ({ 
  row,
  onValueChange 
}) => {
  const color = calculateCellColor(
    row.NetFlow,
    row.MakeToOrder,
    row.RedZone,
    row.YellowZone,
    row.GreenZone
  );

  // Determinar color de texto basado en el fondo
  const getTextColor = () => {
    switch(color) {
      case 'red': return '#c53030';      // Rojo oscuro para contraste
      case 'yellow': return '#d69e2e';   // Amarillo oscuro para contraste
      case 'green': return '#38a169';    // Verde oscuro para contraste
      case 'blue': return '#3182ce';     // Azul oscuro para contraste
      case 'black': return '#4a5568';    // Gris oscuro para contraste
      default: return '#2d3748';
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: colorMap[color],
      fontSize: '14px',
      fontWeight: '600',
      color: getTextColor(),
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <input
        type="number"
        value={row.MakeToOrder}
        onChange={(e) => 
          onValueChange(row.id, parseFloat(e.target.value) || 0)
        }
        style={{
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
        }}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default CellRenderer;