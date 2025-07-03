import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { ProductData } from "../../interfaces/ProductData";
import { ColorService } from "../../services/ColorService";
import { StatisticsService } from "../../services/StatisticsService";
import { useSummaryPanel, ColorChipData } from "../../hooks/useSummaryPanel";

interface SummaryPanelProps {
  data: ProductData[];
  selectedDate?: string;
  colorService?: ColorService; // Principio de Inversión de Dependencias
  statisticsService?: StatisticsService; // Principio de Inversión de Dependencias
}

/**
 * Componente optimizado para mostrar estadísticas de color individual
 * Principio de Responsabilidad Única: Solo renderiza estadísticas de un color
 */
const ColorStatChip: React.FC<ColorChipData> = React.memo(({ 
  stats, 
  backgroundColor, 
  colorName 
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    minWidth: 120,
    p: 2,
    borderRadius: 2,
    backgroundColor,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }}>
    <Chip 
      label={colorName} 
      size="small"
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 600,
        fontSize: '0.85rem',
        mb: 1
      }}
    />
    <Typography variant="h6" sx={{ 
      fontWeight: 700,
      color: 'primary.main',
      fontSize: '1.5rem'
    }}>
      {stats.count}
    </Typography>
    <Typography variant="body2" sx={{ 
      color: 'text.secondary',
      fontWeight: 500,
      fontSize: '0.9rem'
    }}>
      {stats.percentage}
    </Typography>
  </Box>
));

/**
 * Componente optimizado del Panel de Resumen
 * Refactorizado siguiendo principios SOLID - Completamente presentacional
 * Toda la lógica está delegada al hook useSummaryPanel
 */
const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  data, 
  selectedDate,
  colorService,
  statisticsService
}) => {
  // Toda la lógica está encapsulada en el hook personalizado
  const {
    hasData,
    totalProducts,
    formattedDate,
    colorChipsData,
    emptyStateStyles,
    panelStyles,
    chipContainerStyles
  } = useSummaryPanel(data, selectedDate, { colorService, statisticsService });

  // Estado vacío - componente presentacional puro
  if (!hasData) {
    return (
      <Paper elevation={0} sx={emptyStateStyles}>
        <Typography variant="h6" sx={{ 
          color: 'primary.main',
          fontWeight: 600,
          mb: 1
        }}>
          📊 Resumen de Proyección
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mt: 1,
          fontSize: '0.95rem',
          lineHeight: 1.5
        }}>
          Haga clic en el encabezado de una columna de fecha para ver el resumen estadístico
        </Typography>
      </Paper>
    );
  }

  // Panel con datos - componente presentacional puro
  return (
    <Paper elevation={0} sx={panelStyles}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'primary.main',
        fontWeight: 600,
        mb: 1
      }}>
        📊 Resumen para {formattedDate}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{
        fontSize: '0.95rem',
        mb: 3
      }}>
        Cantidad de productos y porcentaje por zona de riesgo
      </Typography>
      <Divider sx={{ my: 2, opacity: 0.6 }} />
      
      <Box sx={chipContainerStyles}>
        {colorChipsData.map((chipData, index) => (
          <ColorStatChip key={index} {...chipData} />
        ))}
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ 
        mt: 3, 
        display: 'block',
        textAlign: 'center',
        fontSize: '0.875rem',
        opacity: 0.8,
        fontWeight: 500
      }}>
        Total de productos en esta fecha: <strong>{totalProducts}</strong>
      </Typography>
    </Paper>
  );
};

export default React.memo(SummaryPanel);
