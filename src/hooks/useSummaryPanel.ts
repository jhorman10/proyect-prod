import { useMemo, useCallback } from "react";
import { ProductData, ColorZone } from "../interfaces/ProductData";
import { ColorService } from "../services/ColorService";
import { ColorServiceFactory } from "../services/ColorPalette";
import { StatisticsService, StatisticsServiceFactory, ColorStats } from "../services/StatisticsService";

/**
 * Interfaz para la configuración del hook
 */
interface UseSummaryPanelConfig {
  colorService?: ColorService;
  statisticsService?: StatisticsService;
}

/**
 * Interfaz para datos de chip de color
 */
export interface ColorChipData {
  color: ColorZone;
  stats: ColorStats;
  backgroundColor: string;
  colorName: string;
}

/**
 * Interfaz para el resultado del hook
 */
interface UseSummaryPanelResult {
  // Estado calculado
  hasData: boolean;
  totalProducts: number;
  formattedDate: string;
  
  // Datos para renderizado
  colorChipsData: ColorChipData[];
  
  // Funciones utilitarias
  formatDateForDisplay: (dateString: string) => string;
  
  // Estilos memoizados
  emptyStateStyles: Record<string, unknown>;
  panelStyles: Record<string, unknown>;
  chipContainerStyles: Record<string, unknown>;
}

/**
 * Hook personalizado para manejar la lógica del panel de resumen
 * Principio de Responsabilidad Única: Solo maneja lógica del panel de resumen
 */
export const useSummaryPanel = (
  data: ProductData[],
  selectedDate?: string,
  config: UseSummaryPanelConfig = {}
): UseSummaryPanelResult => {
  const {
    colorService = ColorServiceFactory.createDefaultColorService(),
    statisticsService = StatisticsServiceFactory.createDefaultStatisticsService(
      colorService || ColorServiceFactory.createDefaultColorService()
    )
  } = config;

  // Función para formatear fecha de manera consistente
  const formatDateForDisplay = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }, []);

  // Memoizar cálculo de estadísticas usando el servicio
  const colorStatsData = useMemo(() => {
    if (!selectedDate) return null;
    return statisticsService.calculateColorStats(data, selectedDate);
  }, [data, selectedDate, statisticsService]);

  // Memoizar datos de chips de colores
  const colorChipsData = useMemo((): ColorChipData[] => {
    if (!colorStatsData) return [];
    
    return (Object.entries(colorStatsData.stats) as [ColorZone, ColorStats][])
      .filter(([, stats]) => stats.count > 0) // Solo mostrar colores con datos
      .map(([color, stats]) => ({
        color,
        stats,
        backgroundColor: colorService.getBackgroundColor(color),
        colorName: colorService.getColorName(color)
      }));
  }, [colorStatsData, colorService]);

  // Estado calculado
  const hasData = Boolean(selectedDate && colorStatsData);
  const totalProducts = colorStatsData?.total || 0;
  const formattedDate = selectedDate ? formatDateForDisplay(selectedDate) : '';

  // Estilos memoizados
  const emptyStateStyles = useMemo(() => ({
    p: 4, 
    mt: 4, 
    textAlign: "center",
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.12)',
    borderRadius: 3,
    transition: 'all 0.3s ease'
  }), []);

  const panelStyles = useMemo(() => ({
    p: 4, 
    mt: 4,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.12)',
    borderRadius: 3,
    transition: 'all 0.3s ease'
  }), []);

  const chipContainerStyles = useMemo(() => ({
    display: "flex", 
    flexWrap: "wrap", 
    gap: 3,
    justifyContent: 'center',
    alignItems: 'stretch'
  }), []);

  return {
    hasData,
    totalProducts,
    formattedDate,
    colorChipsData,
    formatDateForDisplay,
    emptyStateStyles,
    panelStyles,
    chipContainerStyles
  };
};
