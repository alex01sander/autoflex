import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchProduction } from "@/store/productionSlice";

export function Production() {
  const items = useSelector((state: RootState) => state.production.items);
  const loading = useSelector((state: RootState) => state.production.loading);
  const dispatch = useDispatch<AppDispatch>();

  async function handleRefresh() {
    try {
      await dispatch(fetchProduction()).unwrap();
      toast.success("Lista atualizada!");
    } catch {
      toast.error("Erro ao atualizar lista.");
    }
  }

  useEffect(() => {
    dispatch(fetchProduction());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Sugestão de Produção
        </h1>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Qtd. Máxima</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Valor Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.maxQuantity}</TableCell>
                <TableCell>R$ {item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>R$ {item.totalValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}

            {items.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500">
                  Nenhum produto pode ser produzido com o estoque atual
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

