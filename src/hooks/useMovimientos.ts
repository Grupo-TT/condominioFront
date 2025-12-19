import { getMovimientosMes } from "@/lib/services/cuotas.service";
import { Metricas, Movimiento } from "@/types/cuotas.types";
import { useEffect, useState } from "react";

export function useMovimientosMes(periodo: Date) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);

  const [trigger, setTrigger] = useState(0);

  const recargar = () => setTrigger(prev => prev + 1);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);

      const mes = periodo.getMonth() + 1;
      const anio = periodo.getFullYear();

      try {
        const res = await getMovimientosMes(mes, anio);

        const metrics =
          res?.data?.metricas ??
          res?.metricas ??
          null;

        const lista =
          res?.data?.movimientos ??
          res?.data ??
          res?.movimientos ??
          res ??
          [];

        setMovimientos(lista);
        setMetricas(metrics);
      } catch (err) {
        console.error("Error cargando movimientos:", err);
        setMovimientos([]);
        setMetricas(null);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [periodo, trigger]);

  return { movimientos, loading, metricas, recargar };
}
