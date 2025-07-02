import { useState, useEffect, useCallback, useMemo } from "react";
import { ProductData } from "../interfaces/ProductData";
import { IDataService, JsonDataService } from "../services/DataService";
import { IMetrics, MetricsService, MetricsCalculator } from "../services/MetricsService";
import datosJson from "../data/DatosPruebas.json";

/**
 * Interfaz para el estado del hook
 */
interface ProjectionDataState {
  data: ProductData[];
  metrics: IMetrics | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook refactorizado siguiendo principios SOLID
 * Principio de Inversión de Dependencias: Depende de abstracciones (servicios)
 */
const useProjectionData = () => {
  const [state, setState] = useState<ProjectionDataState>({
    data: [],
    metrics: null,
    isLoading: true,
    error: null
  });

  // Servicios inicializados usando Inversión de Dependencias
  const dataService = useMemo<IDataService>(() => 
    new JsonDataService(datosJson), []
  );
  
  const metricsService = useMemo(() => 
    new MetricsService(new MetricsCalculator()), []
  );

  // Cargar datos usando el servicio de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const loadedData = await dataService.loadData();
        const metrics = metricsService.getMetrics(loadedData);
        
        setState({
          data: loadedData,
          metrics,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error loading data'
        }));
      }
    };

    loadData();
  }, [dataService, metricsService]);

  // Función optimizada para actualizar MakeToOrder
  // Principio de Responsabilidad Única: Solo actualiza un valor específico
  const updateMakeToOrder = useCallback((id: string, newValue: number) => {
    // Validar que el nuevo valor sea un número válido
    const validValue = isNaN(newValue) ? 0 : Math.max(0, newValue);
    
    setState(prevState => {
      const updatedData = prevState.data.map(item => 
        item.id === id 
          ? { ...item, MakeToOrder: validValue }
          : item
      );
      
      // Recalcular métricas con los datos actualizados
      const updatedMetrics = metricsService.getMetrics(updatedData);
      
      return {
        ...prevState,
        data: updatedData,
        metrics: updatedMetrics
      };
    });
  }, [metricsService]);

  return { 
    data: state.data,
    updateMakeToOrder,
    metrics: state.metrics,
    isLoading: state.isLoading,
    error: state.error
  };
};

export default useProjectionData;