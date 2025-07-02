import React from "react";
import { TextField } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { calculateCellColor, colorMap } from "../../utils/colorUtils";
import { ProductData } from "../../interfaces/ProductData";

interface CellRendererProps extends GridRenderCellParams {
  onValueChange: (id: string, value: number) => void;
}

const CellRenderer: React.FC<CellRendererProps> = ({ 
  id, 
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

  return (
    <TextField
      type="number"
      value={row.MakeToOrder}
      onChange={(e) => 
        onValueChange(row.id, parseFloat(e.target.value) || 0)
      }
      InputProps={{
        style: {
          backgroundColor: colorMap[color],
          width: "100%",
          height: "100%",
          borderRadius: 0
        }
      }}
      variant="outlined"
      size="small"
      fullWidth
      onClick={(e) => e.stopPropagation()}
      inputProps={{
        style: { 
          textAlign: "center",
          padding: "10px 5px"
        }
      }}
    />
  );
};

export default CellRenderer;