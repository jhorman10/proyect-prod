import React, { useState, useCallback, useMemo } from "react";
import { Container, CssBaseline, Typography, Box } from "@mui/material";
import ProjectionGrid from "./components/ProjectionGrid";
import SummaryPanel from "./components/SummaryPanel";
import useProjectionData from "./hooks/useProjectionData";
import { ColorServiceFactory } from "./services/ColorPalette";
import { StatisticsServiceFactory } from "./services/StatisticsService";

/**
 * Componente principal optimizado de la aplicación
 * Refactorizado siguiendo principios SOLID
 */
const App: React.FC = () => {
  const { data, updateMakeToOrder, metrics, isLoading, error } = useProjectionData();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  // Servicios configurados usando Factory Pattern (Principio de Inversión de Dependencias)
  const colorService = useMemo(() => ColorServiceFactory.createDefaultColorService(), []);
  const statisticsService = useMemo(() => StatisticsServiceFactory.createDefaultStatisticsService(colorService), [colorService]);

  // Optimizar handler de edición de celdas
  const handleCellEdit = useCallback((id: string, value: number) => {
    updateMakeToOrder(id, value);
  }, [updateMakeToOrder]);

  // Optimizar handler de selección de columna
  const handleColumnSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // Memoizar estilos del título
  const titleStyles = useMemo(() => ({
    fontWeight: 700,
    color: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }), []);

  // Memoizar estilos de las instrucciones
  const instructionStyles = useMemo(() => ({
    backgroundColor: 'rgba(102, 126, 234, 0.04)',
    p: 3,
    borderRadius: 2,
    border: '1px solid rgba(102, 126, 234, 0.12)',
    fontSize: '0.95rem',
    lineHeight: 1.6
  }), []);

  // Componente de loading optimizado
  const LoadingState = useMemo(() => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 400,
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h6" color="primary.main">
        📊 Cargando datos de proyección...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Procesando {metrics?.totalProducts || 0} productos
      </Typography>
    </Box>
  ), [metrics?.totalProducts]);

  // Componente de error optimizado
  const ErrorState = useMemo(() => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 400,
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h6" color="error.main">
        ⚠️ Error al cargar los datos
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {error}
      </Typography>
    </Box>
  ), [error]);

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          📈 Sistema de Proyección de Inventario
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ 
          mb: 3,
          fontSize: '1.1rem',
          fontWeight: 500
        }}>
          Visualización y gestión inteligente de proyecciones diarias de productos
        </Typography>
        
        {/* Mostrar métricas del sistema */}
        {metrics && (
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: 2,
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            📋 <strong>{metrics.totalProducts}</strong> productos • 
            🏢 <strong>{metrics.uniqueCenters}</strong> centros • 
            📦 <strong>{metrics.uniqueReferences}</strong> referencias únicas
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={instructionStyles}>
          💡 <strong>Instrucciones:</strong> Haga clic en cualquier celda para editar el valor de "Pedido de Abastecimiento". 
          Los colores se actualizan automáticamente según las zonas de riesgo. 
          Seleccione una columna de fecha para ver el resumen estadístico.
        </Typography>
      </Box>

      {/* Renderizado condicional optimizado */}
      {error ? (
        ErrorState
      ) : isLoading ? (
        LoadingState
      ) : (
        <>
          <ProjectionGrid 
            data={data} 
            onCellEdit={handleCellEdit}
            onColumnSelect={handleColumnSelect}
            colorService={colorService}
          />
          
          <SummaryPanel 
            data={data} 
            selectedDate={selectedDate}
            colorService={colorService}
            statisticsService={statisticsService}
          />
        </>
      )}
    </Container>
  );
};

export default App;