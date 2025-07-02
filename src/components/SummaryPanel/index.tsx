import React, { useMemo } from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { ProductData, ColorZone } from "../../interfaces/ProductData";
import { calculateCellColor, colorMap, colorNames } from "../../utils/colorUtils";

interface SummaryPanelProps {
  data: ProductData[];
  selectedDate?: string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ data, selectedDate }) => {
  const colorStats = useMemo(() => {
    if (!selectedDate) return null;
    
    const stats: Record<ColorZone, { count: number; percentage: string }> = {
      red: { count: 0, percentage: "0%" },
      yellow: { count: 0, percentage: "0%" },
      green: { count: 0, percentage: "0%" },
      black: { count: 0, percentage: "0%" },
      blue: { count: 0, percentage: "0%" }
    };
    
    const filteredData = data.filter(item => 
      item.VisibleForecastedDate === selectedDate
    );
    
    filteredData.forEach(item => {
      const color = calculateCellColor(
        item.NetFlow,
        item.MakeToOrder,
        item.RedZone,
        item.YellowZone,
        item.GreenZone
      );
      stats[color].count++;
    });
    
    const total = filteredData.length;
    Object.keys(stats).forEach(color => {
      const key = color as ColorZone;
      stats[key].percentage = total > 0 
        ? `${((stats[key].count / total) * 100).toFixed(1)}%` 
        : "0%";
    });
    
    return stats;
  }, [data, selectedDate]);

  if (!selectedDate) {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        mt: 4, 
        textAlign: "center",
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.12)',
        borderRadius: 3
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
    );
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      mt: 4,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      border: '1px solid rgba(102, 126, 234, 0.12)',
      borderRadius: 3
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'primary.main',
        fontWeight: 600,
        mb: 1
      }}>
        📊 Resumen para {new Date(selectedDate).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{
        fontSize: '0.95rem',
        mb: 3
      }}>
        Cantidad de productos y porcentaje por zona de riesgo
      </Typography>
      <Divider sx={{ my: 2, opacity: 0.6 }} />
      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {(Object.entries(colorStats!) as [ColorZone, { count: number; percentage: string }][])
          .map(([color, stats]) => (
            <Paper 
              key={color} 
              elevation={0}
              sx={{ 
                p: 3, 
                flex: 1, 
                minWidth: 160,
                backgroundColor: colorMap[color],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: '2px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ 
                color: color === 'yellow' ? '#d69e2e' : 
                       color === 'red' ? '#c53030' :
                       color === 'green' ? '#38a169' :
                       color === 'blue' ? '#3182ce' : '#4a5568',
                mb: 1,
                fontSize: '1rem'
              }}>
                {colorNames[color]}
              </Typography>
              <Typography variant="h4" sx={{ 
                my: 1, 
                color: 'primary.main', 
                fontWeight: 700,
                fontSize: '2.5rem'
              }}>
                {stats.count}
              </Typography>
              <Chip 
                label={stats.percentage} 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            </Paper>
          ))}
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ 
        mt: 3, 
        display: 'block',
        textAlign: 'center',
        fontSize: '0.875rem',
        opacity: 0.8
      }}>
        Total de productos en esta fecha: {colorStats ? Object.values(colorStats).reduce((acc, stat) => acc + stat.count, 0) : 0}
      </Typography>
    </Paper>
  );
};

export default SummaryPanel;