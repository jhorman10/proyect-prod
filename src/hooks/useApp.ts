import { useState, useCallback, useMemo } from "react";
import useProjectionData from "./useProjectionData";
import { ColorServiceFactory } from "../services/ColorPalette";
import { StatisticsServiceFactory } from "../services/StatisticsService";
import { IMetrics } from "../services/MetricsService";
import { ProductData } from "../interfaces/ProductData";
import { ColorService } from "../services/ColorService";
import { StatisticsService } from "../services/StatisticsService";

/**
 * Interfaz para el estado de la aplicación
 */
interface AppState {
  selectedDate?: string;
}

/**
 * Interfaz para estilos de la aplicación
 */
export interface AppStyles {
  title: Record<string, unknown>;
  instructions: Record<string, unknown>;
  loadingContainer: Record<string, unknown>;
  errorContainer: Record<string, unknown>;
}

/**
 * Interfaz para el resultado del hook
 */
interface UseAppResult {
  // Datos del estado
  data: ProductData[];
  metrics: IMetrics | null;
  isLoading: boolean;
  error: string | null;
  selectedDate?: string;
  
  // Servicios configurados
  colorService: ColorService;
  statisticsService: StatisticsService;
  
  // Handlers
  handleCellEdit: (id: string, value: number) => void;
  handleColumnSelect: (date: string) => void;
  
  // Estilos memoizados
  styles: AppStyles;
  
  // Estados derivados
  shouldShowError: boolean;
  shouldShowLoading: boolean;
  shouldShowContent: boolean;
}

/**
 * Hook personalizado para manejar la lógica principal de la aplicación
 * Principio de Responsabilidad Única: Solo maneja lógica de la aplicación principal
 */
export const useApp = (): UseAppResult => {
  // Estado de la aplicación
  const [state, setState] = useState<AppState>({
    selectedDate: undefined
  });

  // Hook de datos de proyección
  const { data, updateMakeToOrder, metrics, isLoading, error } = useProjectionData();

  // Servicios configurados usando Factory Pattern (Principio de Inversión de Dependencias)
  const colorService = useMemo(() => ColorServiceFactory.createDefaultColorService(), []);
  const statisticsService = useMemo(() => 
    StatisticsServiceFactory.createDefaultStatisticsService(colorService), 
    [colorService]
  );

  // Handler optimizado para edición de celdas
  const handleCellEdit = useCallback((id: string, value: number) => {
    updateMakeToOrder(id, value);
  }, [updateMakeToOrder]);

  // Handler optimizado para selección de columna
  const handleColumnSelect = useCallback((date: string) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  // Estilos memoizados
  const styles = useMemo((): AppStyles => ({
    title: {
      fontWeight: 700,
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    instructions: {
      backgroundColor: 'rgba(102, 126, 234, 0.04)',
      p: 3,
      borderRadius: 2,
      border: '1px solid rgba(102, 126, 234, 0.12)',
      fontSize: '0.95rem',
      lineHeight: 1.6
    },
    loadingContainer: {
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 400,
      flexDirection: 'column',
      gap: 2
    },
    errorContainer: {
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 400,
      flexDirection: 'column',
      gap: 2
    }
  }), []);

  // Estados derivados
  const shouldShowError = Boolean(error);
  const shouldShowLoading = Boolean(isLoading && !error);
  const shouldShowContent = Boolean(!error && !isLoading);

  return {
    // Datos
    data,
    metrics,
    isLoading,
    error,
    selectedDate: state.selectedDate,
    
    // Servicios
    colorService,
    statisticsService,
    
    // Handlers
    handleCellEdit,
    handleColumnSelect,
    
    // Estilos
    styles,
    
    // Estados derivados
    shouldShowError,
    shouldShowLoading,
    shouldShowContent
  };
};
