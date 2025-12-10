import { useState, useCallback } from "react";
import { recursoService } from "@/services/recurso.service";
import { RecursoUI, mapResponseToUI } from "@/services/propietario.recurso.adapter";

export const useRecursoPropietario = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recurso, setRecurso] = useState<RecursoUI[]>([]);

  const fetchRecursoPropietario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await recursoService.getRecursoEnabled();
      const adaptados = list.map(mapResponseToUI);
      const filtrados = adaptados.filter(r =>
        r.disponibilidadRecurso === 'DISPONIBLE' ||
        r.disponibilidadRecurso === 'EN_MANTENIMIENTO'
      );
      setRecurso(filtrados);
    } catch {
      setError("Error fetching recurso propietario");
    } finally {
      setLoading(false);
    }
  }, []);

  return { recurso, loading, error, fetchRecursoPropietario };
}