import { useState, useEffect } from "react";
import { ProductData } from "../interfaces/ProductData";
import datosJson from "../data/DatosPruebas.json";

const useProjectionData = () => {
  const [data, setData] = useState<ProductData[]>([]);

  useEffect(() => {
    // Procesar los datos del JSON y agregar IDs únicos
    const processedData: ProductData[] = datosJson.Datos.map((item, index) => ({
      ...item,
      id: `${item.CenterCode || 'unknown'}-${item.Reference || 'unknown'}-${index}`
    })).filter(item => 
      // Filtrar elementos que tengan todos los campos requeridos
      item.CenterCode && 
      item.Reference && 
      item.VisibleForecastedDate &&
      typeof item.NetFlow === 'number' &&
      typeof item.GreenZone === 'number' &&
      typeof item.YellowZone === 'number' &&
      typeof item.RedZone === 'number'
    );
    
    setData(processedData);
  }, []);
  
  const updateMakeToOrder = (id: string, newValue: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, MakeToOrder: newValue } : item
    ));
  };

  return { data, updateMakeToOrder };
};

export default useProjectionData;