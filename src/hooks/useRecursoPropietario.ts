import { useState } from "react";
import { recursoService } from "@/services/recurso.service";
import { RecursoUI, mapResponseToUI } from "@/services/propietario.recurso.adapter";

export const useRecursoPropietario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recurso, setRecurso] = useState<RecursoUI[]>([]);

  const fetchRecursoPropietario = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await recursoService.getRecursoEnabled();
      const adaptados = list.map(mapResponseToUI);
      setRecurso(adaptados);
    } catch (error) {
      setError("Error fetching recurso propietario");
    } finally {
      setLoading(false);
    }
  };

  return { recurso, loading, error, fetchRecursoPropietario };
}