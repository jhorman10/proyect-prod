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
      <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          Seleccione una columna de fecha para ver el resumen
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen para {new Date(selectedDate).toLocaleDateString()}
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {(Object.entries(colorStats!) as [ColorZone, { count: number; percentage: string }][])
          .map(([color, stats]) => (
            <Paper 
              key={color} 
              sx={{ 
                p: 2, 
                flex: 1, 
                minWidth: 150,
                backgroundColor: colorMap[color],
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {colorNames[color]}
              </Typography>
              <Typography variant="h5" my={1}>
                {stats.count}
              </Typography>
              <Chip 
                label={stats.percentage} 
                color="default"
                size="small"
                sx={{ backgroundColor: "rgba(255,255,255,0.7)" }}
              />
            </Paper>
          ))}
      </Box>
    </Paper>
  );
};

export default SummaryPanel;