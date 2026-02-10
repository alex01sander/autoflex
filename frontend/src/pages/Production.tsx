import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchProduction,
  fetchPossibleProduction,
} from "@/store/productionSlice";
import { formatCurrencyBRL } from "@/lib/utils";

export function Production() {
  const suggestedItems = useSelector(
    (state: RootState) => state.production.items,
  );
  const possibleItems = useSelector(
    (state: RootState) => state.production.possibleItems,
  );
  const loading = useSelector((state: RootState) => state.production.loading);
  const dispatch = useDispatch<AppDispatch>();

  async function handleRefresh() {
    try {
      await Promise.all([
        dispatch(fetchProduction()).unwrap(),
        dispatch(fetchPossibleProduction()).unwrap(),
      ]);
      toast.success("Capacidades atualizadas!");
    } catch {
      toast.error("Erro ao atualizar dados de produção.");
    }
  }

  useEffect(() => {
    dispatch(fetchProduction());
    dispatch(fetchPossibleProduction());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Análise de Produção
        </h1>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Atualizar Dados"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">
            1. Produção Possível (Análise de Capacidade)
          </CardTitle>
          <p className="text-sm text-slate-500">
            Quantidade máxima que cada produto pode produzir isoladamente com o
            estoque atual.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Capacidade Máxima</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Valor Potencial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {possibleItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.maxQuantity} unidades</TableCell>
                    <TableCell>{formatCurrencyBRL(item.unitPrice)}</TableCell>
                    <TableCell>{formatCurrencyBRL(item.totalValue)}</TableCell>
                  </TableRow>
                ))}
                {possibleItems.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 py-4"
                    >
                      Nenhum produto pode ser produzido com o estoque atual.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-700">
            2. Produção Sugerida (Otimização)
          </CardTitle>
          <p className="text-sm text-slate-500">
            Sugestão de produção priorizando produtos de maior valor e
            consumindo o estoque progressivamente.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade Sugerida</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestedItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.maxQuantity} unidades</TableCell>
                    <TableCell>{formatCurrencyBRL(item.unitPrice)}</TableCell>
                    <TableCell>{formatCurrencyBRL(item.totalValue)}</TableCell>
                  </TableRow>
                ))}
                {suggestedItems.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 py-4"
                    >
                      Não há sugestões disponíveis para o estoque atual.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
