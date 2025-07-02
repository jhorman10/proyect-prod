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
        <Typography variant="h4" component="h1" gutterBottom>
          Proyección de Inventario
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualización y gestión de proyecciones diarias de productos
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