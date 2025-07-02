import React, { useState } from "react";
import { Container, CssBaseline, Typography, Box } from "@mui/material";
import ProjectionGrid from "./components/ProjectionGrid";
import SummaryPanel from "./components/SummaryPanel";
import useProjectionData from "./hooks/useProjectionData";

const App: React.FC = () => {
  const { data, updateMakeToOrder } = useProjectionData();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📈 Sistema de Proyección de Inventario
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ 
          mb: 3,
          fontSize: '1.1rem',
          fontWeight: 500
        }}>
          Visualización y gestión inteligente de proyecciones diarias de productos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          backgroundColor: 'rgba(102, 126, 234, 0.04)', 
          p: 3, 
          borderRadius: 2,
          border: '1px solid rgba(102, 126, 234, 0.12)',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}>
          💡 <strong>Instrucciones:</strong> Haga clic en cualquier celda para editar el valor de "Pedido de Abastecimiento". 
          Los colores se actualizan automáticamente según las zonas de riesgo. 
          Seleccione una columna de fecha para ver el resumen estadístico.
        </Typography>
      </Box>

      <ProjectionGrid 
        data={data} 
        onCellEdit={updateMakeToOrder}
        onColumnSelect={setSelectedDate}
      />
      
      <SummaryPanel 
        data={data} 
        selectedDate={selectedDate} 
      />
    </Container>
  );
};

export default App;