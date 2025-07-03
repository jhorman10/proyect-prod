import React from "react";
import { DataGrid, GridRenderCellParams, GridColumnHeaderParams } from "@mui/x-data-grid";
import CellRenderer from "./CellRenderer";
import { ProductData } from "../../interfaces/ProductData";
import { ColorService } from "../../services/ColorService";
import { GridDataTransformer, DateFormatter } from "../../services/GridDataService";
import { useProjectionGrid } from "../../hooks/useProjectionGrid";

interface ProjectionGridProps {
  data: ProductData[];
  onCellEdit: (id: string, value: number) => void;
  onColumnSelect: (date: string) => void;
  colorService?: ColorService;
  gridDataTransformer?: GridDataTransformer;
  dateFormatter?: DateFormatter;
}

/**
 * Componente de header personalizado
 * Componente presentacional puro
 */
const CustomHeader: React.FC<{
  params: GridColumnHeaderParams;
  isSelected: boolean;
  onClick: (params: GridColumnHeaderParams) => void;
}> = React.memo(({ params, isSelected, onClick }) => (
  <div 
    style={{ 
      fontWeight: 'bold',
      cursor: 'pointer',
      padding: '8px',
      textAlign: 'center',
      backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
      borderRadius: '4px',
      transition: 'all 0.2s ease'
    }}
    onClick={() => onClick(params)}
  >
    {params.colDef.headerName}
    {isSelected && (
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
));

/**
 * Componente presentacional puro del Grid de Proyección
 * Principio de Responsabilidad Única: Solo se encarga del renderizado visual
 */
const ProjectionGrid: React.FC<ProjectionGridProps> = ({ 
  data, 
  onCellEdit,
  onColumnSelect,
  colorService,
  gridDataTransformer,
  dateFormatter
}) => {
  // Toda la lógica está encapsulada en el hook personalizado
  const {
    gridRows,
    uniqueDates,
    handleColumnHeaderClick,
    dataGridStyles,
    getCellRenderData,
    getHeaderRenderData
  } = useProjectionGrid(data, onCellEdit, onColumnSelect, {
    colorService,
    gridDataTransformer,
    dateFormatter
  });

  // Generar columnas dinámicamente usando la lógica del hook
  const columns = React.useMemo(() => {
    const staticColumns = [
      { 
        field: "CenterCode", 
        headerName: "Centro", 
        width: 100,
        headerAlign: "center" as const,
        align: "center" as const,
        type: "string" as const
      },
      { 
        field: "Reference", 
        headerName: "Referencia", 
        width: 180,
        headerAlign: "center" as const,
        align: "center" as const,
        type: "string" as const
      }
    ];

    const dateFormatter = new DateFormatter();
    const dateColumns = uniqueDates.map(date => ({
      field: date,
      headerName: dateFormatter.formatDateHeader(date),
      width: 100,
      headerAlign: "center" as const,
      align: "center" as const,
      type: "string" as const,
      renderCell: (params: GridRenderCellParams) => {
        const cellData = getCellRenderData(params);
        if (!cellData) return null;
        
        return (
          <CellRenderer
            {...params}
            row={cellData.data}
            onValueChange={cellData.onValueChange}
            colorService={cellData.colorService}
          />
        );
      },
      renderHeader: (params: GridColumnHeaderParams) => {
        const headerData = getHeaderRenderData(params);
        return (
          <CustomHeader 
            params={headerData.params}
            isSelected={headerData.isSelected}
            onClick={headerData.onClick}
          />
        );
      }
    }));

    return [...staticColumns, ...dateColumns];
  }, [uniqueDates, getCellRenderData, getHeaderRenderData]);

  // Componente puramente presentacional
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
