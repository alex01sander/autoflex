import { useEffect, useState } from "react";

import { api } from "../services/api";
import type { ProductionSuggestion } from "../types/production";
import { Button } from "@/components/ui/button";

export function Production() {
  const [data, setData] = useState<ProductionSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ProductionSuggestion[]>("/production-suggestions")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.productId} className="rounded-lg border p-4 shadow-sm">
          <h2 className="font-semibold">{item.name}</h2>
          <p>Max quantity: {item.maxQuantity}</p>
          <p>Unit price: ${item.unitPrice}</p>
          <p>Total value: ${item.totalValue}</p>
        </div>
      ))}

      <Button>Generate report</Button>
    </div>
  );
}
