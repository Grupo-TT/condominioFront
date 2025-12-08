'use client';

import { useState, useCallback, useRef } from 'react';
import { Asamblea, Asistente, CreateAsambleaData, UpdateAsambleaData } from '@/types/asamblea.types';
import { toast } from 'sonner';
import { AsambleaService } from '@/lib/services/asamblea.service';

export const useAsamblea = () => {
  // Usar contador para manejar múltiples operaciones concurrentes
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;

  const [asambleas, setAsambleas] = useState<Asamblea[]>([]);
  // Guardar asistentes por asamblea ID
  const [asistentesPorAsamblea, setAsistentesPorAsamblea] = useState<Record<string, Asistente[]>>({});

  // Ref para prevenir doble ejecución
  const operationInProgress = useRef<Record<string, boolean>>({});

  const startLoading = () => setLoadingCount(prev => prev + 1);
  const stopLoading = () => setLoadingCount(prev => Math.max(0, prev - 1));

  const fetchAsambleas = useCallback(async () => {
    if (operationInProgress.current['fetchAsambleas']) return;
    operationInProgress.current['fetchAsambleas'] = true;

    startLoading();
    try {
      const data = await AsambleaService.getAll();
      setAsambleas(data);
    } catch {
      toast.error('Error al cargar las asambleas');
    } finally {
      stopLoading();
      operationInProgress.current['fetchAsambleas'] = false;
    }
  }, []);

  const fetchAsistentes = useCallback(async (id: string) => {
    const opKey = `fetchAsistentes-${id}`;
    if (operationInProgress.current[opKey]) return;
    operationInProgress.current[opKey] = true;

    startLoading();
    try {
      const res = await AsambleaService.getAsistentes(id);
      // Guardar asistentes asociados a esta asamblea específica
      setAsistentesPorAsamblea(prev => ({ ...prev, [id]: res }));
    } catch {
      toast.error("Error al cargar los asistentes");
    } finally {
      stopLoading();
      operationInProgress.current[opKey] = false;
    }
  }, []);

  const createAsamblea = useCallback(async (data: CreateAsambleaData) => {
    if (operationInProgress.current['createAsamblea']) return;
    operationInProgress.current['createAsamblea'] = true;

    startLoading();
    try {
      await AsambleaService.createAsamblea({ ...data, estado: 'PROGRAMADA' });
      toast.success('Asamblea creada exitosamente');
      // Refrescar lista desde el servidor
      const updatedList = await AsambleaService.getAll();
      setAsambleas(updatedList);
    } catch {
      toast.error('Error al crear la asamblea');
    } finally {
      stopLoading();
      operationInProgress.current['createAsamblea'] = false;
    }
  }, []);

  const updateAsamblea = useCallback(async (id: string, data: UpdateAsambleaData) => {
    const opKey = `updateAsamblea-${id}`;
    if (operationInProgress.current[opKey]) return;
    operationInProgress.current[opKey] = true;

    startLoading();
    try {
      await AsambleaService.updateAsamblea(Number(id), data);
      toast.success('Asamblea actualizada exitosamente');
      // Refrescar lista desde el servidor
      const updatedList = await AsambleaService.getAll();
      setAsambleas(updatedList);
    } catch {
      toast.error('Error al actualizar la asamblea');
    } finally {
      stopLoading();
      operationInProgress.current[opKey] = false;
    }
  }, []);

  const deleteAsamblea = useCallback(async (id: string) => {
    const opKey = `deleteAsamblea-${id}`;
    if (operationInProgress.current[opKey]) return;
    operationInProgress.current[opKey] = true;

    startLoading();
    try {
      await AsambleaService.deleteAsamblea(Number(id));
      toast.success('Asamblea eliminada exitosamente');
      // Refrescar lista desde el servidor
      const updatedList = await AsambleaService.getAll();
      setAsambleas(updatedList);
      // Limpiar asistentes de la asamblea eliminada
      setAsistentesPorAsamblea(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch {
      toast.error('Error al eliminar la asamblea');
    } finally {
      stopLoading();
      operationInProgress.current[opKey] = false;
    }
  }, []);

  // Obtener asistentes de una asamblea específica
  const getAsistentesByAsamblea = useCallback((asambleaId?: string) => {
    if (!asambleaId) return [];
    return asistentesPorAsamblea[asambleaId] || [];
  }, [asistentesPorAsamblea]);

  const markAsistencia = useCallback(
    async (idAsamblea: number, id: number, asistio: boolean) => {
      const asambleaKey = String(idAsamblea);
      const opKey = `markAsistencia-${idAsamblea}-${id}`;

      if (operationInProgress.current[opKey]) return;
      operationInProgress.current[opKey] = true;

      // Guardar estado previo para rollback
      const previousState = asistentesPorAsamblea[asambleaKey] || [];

      try {
        // Actualizar estado local optimísticamente
        setAsistentesPorAsamblea(prev => ({
          ...prev,
          [asambleaKey]: (prev[asambleaKey] || []).map(a =>
            a.id === id ? { ...a, asistio } : a
          )
        }));

        await AsambleaService.markAsistencia(idAsamblea, id, asistio);
        toast.success('Asistencia actualizada');
      } catch (error) {
        console.error('Error actualizando asistencia:', error);
        toast.error('Error actualizando asistencia');

        // Rollback: intentar refrescar desde servidor, si falla usar estado previo
        try {
          const res = await AsambleaService.getAsistentes(asambleaKey);
          setAsistentesPorAsamblea(prev => ({ ...prev, [asambleaKey]: res }));
        } catch {
          // Si el refresh también falla, restaurar estado previo
          setAsistentesPorAsamblea(prev => ({ ...prev, [asambleaKey]: previousState }));
          console.error('Error en rollback, restaurando estado previo');
        }
      } finally {
        operationInProgress.current[opKey] = false;
      }
    },
    [asistentesPorAsamblea]
  );

  return {
    loading,
    asambleas,
    fetchAsambleas,
    fetchAsistentes,
    createAsamblea,
    updateAsamblea,
    deleteAsamblea,
    getAsistentesByAsamblea,
    markAsistencia,
  };
};
