import React, { useMemo, useState } from "react";
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
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  // Obtener fechas únicas y ordenarlas
  const uniqueDates = useMemo(() => {
    return Array.from(new Set(data.map(item => item.VisibleForecastedDate)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [data]);

  // Transformar datos para que cada fila sea un producto único
  const gridRows = useMemo(() => {
    const productMap = new Map();
    
    data.forEach(item => {
      const key = `${item.CenterCode}-${item.Reference}`;
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: key,
          CenterCode: item.CenterCode,
          Reference: item.Reference,
          ...Object.fromEntries(uniqueDates.map(date => [date, { MakeToOrder: 0, data: null }]))
        });
      }
      
      const row = productMap.get(key);
      row[item.VisibleForecastedDate] = {
        MakeToOrder: item.MakeToOrder,
        data: item
      };
    });
    
    return Array.from(productMap.values());
  }, [data, uniqueDates]);

  const columns: GridColDef[] = useMemo(() => [
    { 
      field: "CenterCode", 
      headerName: "CenterCode", 
      width: 100,
      headerAlign: "center",
      align: "center",
      type: "string"
    },
    { 
      field: "Reference", 
      headerName: "Reference", 
      width: 180,
      headerAlign: "center",
      align: "center",
      type: "string"
    },
    ...uniqueDates.map(date => ({
      field: date,
      headerName: new Date(date).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      width: 100,
      headerAlign: "center" as const,
      align: "center" as const,
      renderCell: (params: GridRenderCellParams) => {
        const cellData = params.row[date];
        if (cellData && cellData.data) {
          return (
            <CellRenderer 
              {...params}
              row={cellData.data}
              onValueChange={onCellEdit}
            />
          );
        }
        return (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif'
          }}>
            0
          </div>
        );
      }
    }))
  ], [uniqueDates, onCellEdit]);

  return (
    <div style={{ height: 600, width: "100%", marginTop: 20 }}>
      <DataGrid
        rows={gridRows}
        columns={columns}
        onColumnHeaderClick={(params) => {
          // Solo seleccionar columnas de fecha (no Reference ni CenterCode)
          if (uniqueDates.includes(params.field)) {
            setSelectedColumn(params.field);
            onColumnSelect(params.field);
          }
        }}
        disableRowSelectionOnClick
        rowHeight={50}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            background: '#667eea',
            color: 'white !important',
            fontWeight: 600,
            fontSize: '14px'
          },
          '& .MuiDataGrid-columnHeader': {
            background: '#667eea !important',
            color: 'white !important',
            borderRight: '1px solid rgba(255, 255, 255, 0.2) !important'
          },
          '& .MuiDataGrid-columnHeader[data-field]': {
            background: '#667eea !important',
            color: 'white !important',
            cursor: 'pointer'
          },
          [`& .MuiDataGrid-columnHeader[data-field="${selectedColumn}"]`]: {
            background: '#5a67d8 !important',
            boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.3)',
            '& .MuiDataGrid-columnHeaderTitle::before': {
              content: '"● "',
              color: '#fbbf24',
              fontSize: '12px',
              marginRight: '4px'
            }
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'white !important',
            fontWeight: '600 !important'
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none'
          },
          // Resaltar toda la columna seleccionada
          [`& .MuiDataGrid-cell[data-field="${selectedColumn}"]`]: {
            backgroundColor: 'rgba(102, 126, 234, 0.05) !important',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(102, 126, 234, 0.03)',
              pointerEvents: 'none',
              zIndex: -1
            }
          }
        }}
      />
    </div>
  );
};

export default ProjectionGrid;