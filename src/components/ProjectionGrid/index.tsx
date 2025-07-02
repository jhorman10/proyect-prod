import React, { useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CellRenderer from "./CellRenderer";
import { ProductData } from "../../interfaces/ProductData";

interface ProjectionGridProps {
  data: ProductData[];
  onCellEdit: (id: string, value: number) => void;
  onColumnSelect: (date: string) => void;
}

const ProjectionGrid: React.FC<ProjectionGridProps> = ({ 
  data, 
  onCellEdit,
  onColumnSelect
}) => {
  const uniqueDates = useMemo(() => {
    return Array.from(new Set(data.map(item => item.VisibleForecastedDate)));
  }, [data]);

  const columns: GridColDef[] = useMemo(() => [
    { 
      field: "Reference", 
      headerName: "Referencia", 
      width: 180,
      headerAlign: "center",
      align: "center"
    },
    { 
      field: "CenterCode", 
      headerName: "Centro", 
      width: 120,
      headerAlign: "center",
      align: "center"
    },
    ...uniqueDates.map(date => ({
      field: date,
      headerName: new Date(date).toLocaleDateString(),
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.VisibleForecastedDate === date) {
          return (
            <CellRenderer 
              {...params} 
              onValueChange={onCellEdit}
            />
          );
        }
        return null;
      }
    }))
  ], [uniqueDates, onCellEdit]);

  return (
    <div style={{ height: 600, width: "100%", marginTop: 20 }}>
      <DataGrid
        rows={data}
        columns={columns}
        onColumnHeaderClick={(params) => {
          if (uniqueDates.includes(params.field)) {
            onColumnSelect(params.field);
          }
        }}
        disableRowSelectionOnClick
        rowHeight={50}
      />
    </div>
  );
};

export default ProjectionGrid;