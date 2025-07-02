import { useState } from "react";
import { ProductData } from "../interfaces/ProductData";

const mockData: ProductData[] = [
  {
    id: "1",
    CenterCode: "BCV",
    Reference: "210001000004R20",
    VisibleForecastedDate: "2025-03-21T00:00:00",
    NetFlow: 1513.0,
    GreenZone: 121.77,
    YellowZone: 121.77,
    RedZone: 194.83,
    MakeToOrder: 0
  },
  // Agregar más datos de ejemplo...
];

const useProjectionData = () => {
  const [data, setData] = useState<ProductData[]>(mockData);
  
  const updateMakeToOrder = (id: string, newValue: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, MakeToOrder: newValue } : item
    ));
  };

  return { data, updateMakeToOrder };
};

export default useProjectionData;