'use client';

import { useState, useCallback, useRef } from 'react';
import { Asamblea, Asistente, CreateAsambleaData, UpdateAsambleaData } from '@/types/asamblea.types';
import { toast } from 'sonner';
import { AsambleaService } from '@/lib/services/asamblea.service';
import { mockAsambleas, mockAsistentes } from '@/data/asamblea.mock';

// TODO: Set to true to use mock data when API is unavailable
const USE_MOCKS = true;

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
      if (USE_MOCKS) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setAsambleas([...mockAsambleas]);
      } else {
        const data = await AsambleaService.getAll();
        setAsambleas(data);
      }
    } catch {
      toast.error('Error al cargar las asambleas', { description: 'No se pudieron obtener los datos. Intenta de nuevo.' });
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
      if (USE_MOCKS) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        // Create mock attendees for this assembly
        const mockData = mockAsistentes.slice(0, 22).map((a, idx) => ({
          ...a,
          id: idx + 1,
          nombre: `Propietario Casa ${idx + 1}`,
        }));
        setAsistentesPorAsamblea(prev => ({ ...prev, [id]: mockData }));
      } else {
        const res = await AsambleaService.getAsistentes(id);
        // Guardar asistentes asociados a esta asamblea específica
        setAsistentesPorAsamblea(prev => ({ ...prev, [id]: res }));
      }
    } catch {
      toast.error('Error al cargar los asistentes', { description: 'No se pudieron obtener los datos de asistencia.' });
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
      toast.success('Asamblea creada exitosamente', { description: 'La asamblea ha sido programada correctamente.' });
      // Refrescar lista desde el servidor
      const updatedList = await AsambleaService.getAll();
      setAsambleas(updatedList);
    } catch {
      toast.error('Error al crear la asamblea', { description: 'No se pudo guardar la información. Intenta de nuevo.' });
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
      toast.success('Asamblea actualizada exitosamente', { description: 'Los cambios han sido guardados.' });
      // Refrescar lista desde el servidor
      const updatedList = await AsambleaService.getAll();
      setAsambleas(updatedList);
    } catch {
      toast.error('Error al actualizar la asamblea', { description: 'No se pudieron guardar los cambios.' });
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
      toast.success('Asamblea eliminada exitosamente', { description: 'La asamblea ha sido removida del sistema.' });
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
      toast.error('Error al eliminar la asamblea', { description: 'No se pudo completar la operación.' });
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
        toast.success('Asistencia actualizada', { description: 'El registro de asistencia ha sido guardado.' });
      } catch (error) {
        console.error('Error actualizando asistencia:', error);
        toast.error('Error actualizando asistencia', { description: 'No se pudo registrar el cambio.' });

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

  const cambiarEstadoAsamblea = useCallback(async (id: string, nuevoEstado: string) => {
    const opKey = `cambiarEstado-${id}`;
    if (operationInProgress.current[opKey]) return;
    operationInProgress.current[opKey] = true;

    startLoading();
    try {
      if (USE_MOCKS) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Update local state directly for mocks
        setAsambleas(prev => prev.map(a =>
          a.id === id ? { ...a, estado: nuevoEstado as Asamblea['estado'] } : a
        ));
      } else {
        await AsambleaService.cambiarEstado(Number(id), nuevoEstado);
        // Refrescar lista desde el servidor
        const updatedList = await AsambleaService.getAll();
        setAsambleas(updatedList);
      }
      toast.success('Estado actualizado', { description: 'La asamblea ha sido marcada como terminada.' });
    } catch {
      toast.error('Error al cambiar el estado', { description: 'No se pudo completar la operación.' });
    } finally {
      stopLoading();
      operationInProgress.current[opKey] = false;
    }
  }, []);

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
    cambiarEstadoAsamblea,
  };
};
