import { getMovimientosMes } from "@/lib/services/cuotas.service";
import { Movimiento } from "@/types/cuotas.types";
import { useEffect, useState } from "react";

export function useMovimientosMes(periodo: Date) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);

      try {
        const mes = periodo.getMonth() + 1;
        console.log("🚀 ~ cargar ~ mes:", mes)
        const anio = periodo.getFullYear();
        console.log("🚀 ~ cargar ~ anio:", anio)

        const res = await getMovimientosMes(mes, anio);
        console.log("🚀 ~ cargar ~ res:", res)

        const lista =
          res?.data?.movimientos ??
          res?.data ??
          res?.movimientos ??
          res ??
          [];

        setMovimientos(lista);
      } catch (err) {
        console.error("Error cargando movimientos:", err);
        setMovimientos([]); // evitar undefined
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [periodo]);

  return { movimientos, loading };
}
