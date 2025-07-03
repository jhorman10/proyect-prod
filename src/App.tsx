import React from "react";
import { Container, CssBaseline, Typography, Box } from "@mui/material";
import ProjectionGrid from "./components/ProjectionGrid";
import SummaryPanel from "./components/SummaryPanel";
import { useApp } from "./hooks/useApp";

/**
 * Componente principal de la aplicación - Completamente presentacional
 * Refactorizado siguiendo principios SOLID
 * Toda la lógica está delegada al hook useApp
 */
const App: React.FC = () => {
  // Toda la lógica está encapsulada en el hook personalizado
  const {
    data,
    metrics,
    error,
    selectedDate,
    colorService,
    statisticsService,
    handleCellEdit,
    handleColumnSelect,
    styles,
    shouldShowError,
    shouldShowLoading,
    shouldShowContent
  } = useApp();

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={styles.title}>
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
        
        <Typography variant="body2" color="text.secondary" sx={styles.instructions}>
          💡 <strong>Instrucciones:</strong> Haga clic en cualquier celda para editar el valor de "Pedido de Abastecimiento". 
          Los colores se actualizan automáticamente según las zonas de riesgo. 
          Seleccione una columna de fecha para ver el resumen estadístico.
        </Typography>
      </Box>

      {/* Renderizado condicional optimizado - Estados presentacionales puros */}
      {shouldShowError && (
        <Box sx={styles.errorContainer}>
          <Typography variant="h6" color="error.main">
            ⚠️ Error al cargar los datos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      )}

      {shouldShowLoading && (
        <Box sx={styles.loadingContainer}>
          <Typography variant="h6" color="primary.main">
            📊 Cargando datos de proyección...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Procesando {metrics?.totalProducts || 0} productos
          </Typography>
        </Box>
      )}

      {shouldShowContent && (
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