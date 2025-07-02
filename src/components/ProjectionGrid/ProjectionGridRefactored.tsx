import React, { useMemo, useState, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridColumnHeaderParams } from "@mui/x-data-grid";
import CellRenderer from "./CellRenderer";
import { ProductData } from "../../interfaces/ProductData";
import { ColorService } from "../../services/ColorService";
import { ColorServiceFactory } from "../../services/ColorPalette";
import { GridDataTransformer, DateFormatter, GridRow } from "../../services/GridDataService";

interface ProjectionGridProps {
  data: ProductData[];
  onCellEdit: (id: string, value: number) => void;
  onColumnSelect: (date: string) => void;
  colorService?: ColorService; // Principio de Inversión de Dependencias
  gridDataTransformer?: GridDataTransformer; // Principio de Inversión de Dependencias
  dateFormatter?: DateFormatter; // Principio de Inversión de Dependencias
}

/**
 * Componente optimizado del Grid de Proyección
 * Refactorizado siguiendo principios SOLID
 */
const ProjectionGrid: React.FC<ProjectionGridProps> = ({ 
  data, 
  onCellEdit,
  onColumnSelect,
  colorService = ColorServiceFactory.createDefaultColorService(),
  gridDataTransformer = new GridDataTransformer(),
  dateFormatter = new DateFormatter()
}) => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  // Memoizar fechas únicas usando el servicio
  const uniqueDates = useMemo(() => 
    gridDataTransformer.getUniqueDates(data), [data, gridDataTransformer]
  );

  // Optimizar transformación de datos usando el servicio
  const gridRows = useMemo((): GridRow[] => 
    gridDataTransformer.transformToGridRows(data), [data, gridDataTransformer]
  );

  // Optimizar handler de click en columna
  const handleColumnHeaderClick = useCallback((params: GridColumnHeaderParams) => {
    if (uniqueDates.includes(params.field)) {
      setSelectedColumn(params.field);
      onColumnSelect(params.field);
    }
  }, [uniqueDates, onColumnSelect]);

  // Memoizar definición de columnas
  const columns = useMemo((): GridColDef[] => {
    const staticColumns: GridColDef[] = [
      { 
        field: "CenterCode", 
        headerName: "Centro", 
        width: 100,
        headerAlign: "center",
        align: "center",
        type: "string"
      },
      { 
        field: "Reference", 
        headerName: "Referencia", 
        width: 180,
        headerAlign: "center",
        align: "center",
        type: "string"
      }
    ];

    const dateColumns: GridColDef[] = uniqueDates.map(date => ({
      field: date,
      headerName: dateFormatter.formatDateHeader(date),
      width: 100,
      headerAlign: "center" as const,
      align: "center" as const,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value && typeof params.value === 'object' && 'data' in params.value) {
          const cellData = params.value as { data: ProductData };
          return (
            <CellRenderer
              {...params}
              row={cellData.data}
              onValueChange={onCellEdit}
              colorService={colorService}
            />
          );
        }
        return null;
      },
      renderHeader: (params: GridColumnHeaderParams) => (
        <div 
          style={{ 
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '8px',
            textAlign: 'center',
            backgroundColor: selectedColumn === params.field ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleColumnHeaderClick(params)}
        >
          {params.colDef.headerName}
          {selectedColumn === params.field && (
            <div style={{ 
              fontSize: '10px', 
              color: '#667eea', 
              marginTop: '2px',
              fontWeight: 'normal'
            }}>
              ● Seleccionada
            </div>
          )}
        </div>
      )
    }));

    return [...staticColumns, ...dateColumns];
  }, [uniqueDates, onCellEdit, selectedColumn, handleColumnHeaderClick, colorService, dateFormatter]);

  // Memoizar estilos optimizados
  const dataGridStyles = useMemo(() => ({
    height: 600,
    width: '100%',
    '& .MuiDataGrid-root': {
      border: '1px solid rgba(102, 126, 234, 0.12)',
      borderRadius: '12px',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)'
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#667eea',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      borderBottom: '2px solid rgba(102, 126, 234, 0.3)'
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      color: 'white'
    },
    '& .MuiDataGrid-cell': {
      borderRight: '1px solid rgba(102, 126, 234, 0.12)',
      borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
      fontSize: '13px',
      padding: 0
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: 'rgba(102, 126, 234, 0.04)'
      }
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      borderTop: '1px solid rgba(102, 126, 234, 0.12)'
    }
  }), []);

  return (
    <DataGrid
      rows={gridRows}
      columns={columns}
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 25 }
        }
      }}
      sx={dataGridStyles}
      onColumnHeaderClick={handleColumnHeaderClick}
      disableRowSelectionOnClick
    />
  );
};

export default React.memo(ProjectionGrid);
