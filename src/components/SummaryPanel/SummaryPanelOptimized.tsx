import React, { useMemo, useCallback } from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { ProductData, ColorZone } from "../../interfaces/ProductData";
import { calculateCellColor, colorMap, colorNames } from "../../utils/colorUtils";

interface SummaryPanelProps {
  data: ProductData[];
  selectedDate?: string;
}

/**
 * Estructura para estadísticas de colores optimizada
 */
interface ColorStats {
  count: number;
  percentage: string;
}

/**
 * Función para formatear fecha de manera consistente
 */
const formatDateForDisplay = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

/**
 * Función para calcular estadísticas de colores optimizada
 */
const calculateColorStats = (data: ProductData[], selectedDate: string) => {
  const stats: Record<ColorZone, ColorStats> = {
    red: { count: 0, percentage: "0%" },
    yellow: { count: 0, percentage: "0%" },
    green: { count: 0, percentage: "0%" },
    black: { count: 0, percentage: "0%" },
    blue: { count: 0, percentage: "0%" }
  };
  
  const filteredData = data.filter(item => item.VisibleForecastedDate === selectedDate);
  
  // Contar cada color
  for (const item of filteredData) {
    const color = calculateCellColor(
      item.NetFlow,
      item.MakeToOrder,
      item.RedZone,
      item.YellowZone,
      item.GreenZone
    );
    stats[color].count++;
  }
  
  // Calcular porcentajes
  const total = filteredData.length;
  if (total > 0) {
    for (const color of Object.keys(stats) as ColorZone[]) {
      stats[color].percentage = `${((stats[color].count / total) * 100).toFixed(1)}%`;
    }
  }
  
  return { stats, total };
};

/**
 * Componente optimizado para mostrar estadísticas de color individual
 */
const ColorStatChip: React.FC<{
  color: ColorZone;
  stats: ColorStats;
}> = React.memo(({ color, stats }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    minWidth: 120,
    p: 2,
    borderRadius: 2,
    backgroundColor: colorMap[color],
    border: '1px solid rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }}>
    <Chip 
      label={colorNames[color]} 
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
 */
const SummaryPanel: React.FC<SummaryPanelProps> = ({ data, selectedDate }) => {
  // Memoizar cálculo de estadísticas
  const colorStatsData = useMemo(() => {
    if (!selectedDate) return null;
    return calculateColorStats(data, selectedDate);
  }, [data, selectedDate]);

  // Memoizar componente de estado vacío
  const EmptyState = useMemo(() => (
    <Paper elevation={0} sx={{ 
      p: 4, 
      mt: 4, 
      textAlign: "center",
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      border: '1px solid rgba(102, 126, 234, 0.12)',
      borderRadius: 3,
      transition: 'all 0.3s ease'
    }}>
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
  ), []);

  // Renderizar chips de colores memoizados
  const renderColorChips = useCallback(() => {
    if (!colorStatsData) return null;
    
    return (Object.entries(colorStatsData.stats) as [ColorZone, ColorStats][])
      .filter(([, stats]) => stats.count > 0) // Solo mostrar colores con datos
      .map(([color, stats]) => (
        <ColorStatChip 
          key={color}
          color={color}
          stats={stats}
        />
      ));
  }, [colorStatsData]);

  if (!selectedDate || !colorStatsData) {
    return EmptyState;
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      mt: 4,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      border: '1px solid rgba(102, 126, 234, 0.12)',
      borderRadius: 3,
      transition: 'all 0.3s ease'
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'primary.main',
        fontWeight: 600,
        mb: 1
      }}>
        📊 Resumen para {formatDateForDisplay(selectedDate)}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{
        fontSize: '0.95rem',
        mb: 3
      }}>
        Cantidad de productos y porcentaje por zona de riesgo
      </Typography>
      <Divider sx={{ my: 2, opacity: 0.6 }} />
      
      <Box sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 3,
        justifyContent: 'center',
        alignItems: 'stretch'
      }}>
        {renderColorChips()}
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ 
        mt: 3, 
        display: 'block',
        textAlign: 'center',
        fontSize: '0.875rem',
        opacity: 0.8,
        fontWeight: 500
      }}>
        Total de productos en esta fecha: <strong>{colorStatsData.total}</strong>
      </Typography>
    </Paper>
  );
};

export default React.memo(SummaryPanel);
