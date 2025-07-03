import { useState, useCallback, useMemo } from "react";
import { GridColDef, GridRenderCellParams, GridColumnHeaderParams } from "@mui/x-data-grid";
import { ProductData } from "../interfaces/ProductData";
import { ColorService } from "../services/ColorService";
import { GridDataTransformer, DateFormatter, GridRow } from "../services/GridDataService";

/**
 * Interfaz para la configuración del hook
 */
interface UseProjectionGridConfig {
  colorService?: ColorService;
  gridDataTransformer?: GridDataTransformer;
  dateFormatter?: DateFormatter;
}

/**
 * Interfaz para datos de celda para el renderizado
 */
export interface CellRenderData {
  data: ProductData;
  onValueChange: (id: string, value: number) => void;
  colorService?: ColorService;
}

/**
 * Interfaz para datos de header para el renderizado
 */
export interface HeaderRenderData {
  params: GridColumnHeaderParams;
  isSelected: boolean;
  onClick: (params: GridColumnHeaderParams) => void;
}

/**
 * Interfaz para el resultado del hook
 */
interface UseProjectionGridResult {
  // Datos procesados
  gridRows: GridRow[];
  columns: GridColDef[];
  uniqueDates: string[];
  
  // Estado
  selectedColumn: string | null;
  
  // Handlers
  handleColumnHeaderClick: (params: GridColumnHeaderParams) => void;
  
  // Estilos
  dataGridStyles: Record<string, unknown>;
  
  // Funciones para renderizado
  getCellRenderData: (params: GridRenderCellParams) => CellRenderData | null;
  getHeaderRenderData: (params: GridColumnHeaderParams) => HeaderRenderData;
}

/**
 * Hook personalizado para manejar la lógica del grid de proyección
 * Principio de Responsabilidad Única: Solo maneja lógica del grid
 */
export const useProjectionGrid = (
  data: ProductData[],
  onCellEdit: (id: string, value: number) => void,
  onColumnSelect: (date: string) => void,
  config: UseProjectionGridConfig = {}
): UseProjectionGridResult => {
  const {
    colorService,
    gridDataTransformer = new GridDataTransformer(),
    dateFormatter = new DateFormatter()
  } = config;

  // Estado local del componente
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  // Memoizar fechas únicas usando el servicio
  const uniqueDates = useMemo(() => 
    gridDataTransformer.getUniqueDates(data), 
    [data, gridDataTransformer]
  );

  // Memoizar transformación de datos usando el servicio
  const gridRows = useMemo((): GridRow[] => 
    gridDataTransformer.transformToGridRows(data), 
    [data, gridDataTransformer]
  );

  // Handler optimizado para click en columna
  const handleColumnHeaderClick = useCallback((params: GridColumnHeaderParams) => {
    if (uniqueDates.includes(params.field)) {
      setSelectedColumn(params.field);
      onColumnSelect(params.field);
    }
  }, [uniqueDates, onColumnSelect]);

  // Función para obtener datos de renderizado de celda
  const getCellRenderData = useCallback((params: GridRenderCellParams): CellRenderData | null => {
    if (params.value && typeof params.value === 'object' && 'data' in params.value) {
      const cellData = params.value as { data: ProductData };
      return {
        data: cellData.data,
        onValueChange: onCellEdit,
        colorService
      };
    }
    return null;
  }, [onCellEdit, colorService]);

  // Función para obtener datos de renderizado de header
  const getHeaderRenderData = useCallback((params: GridColumnHeaderParams): HeaderRenderData => ({
    params,
    isSelected: selectedColumn === params.field,
    onClick: handleColumnHeaderClick
  }), [selectedColumn, handleColumnHeaderClick]);

  // Memoizar definición de columnas (sin JSX)
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
      align: "center" as const
    }));

    return [...staticColumns, ...dateColumns];
  }, [uniqueDates, dateFormatter]);

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

  return {
    gridRows,
    columns,
    uniqueDates,
    selectedColumn,
    handleColumnHeaderClick,
    dataGridStyles,
    getCellRenderData,
    getHeaderRenderData
  };
};
