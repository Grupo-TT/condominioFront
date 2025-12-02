'use client';

import { useState, useCallback } from 'react';
import { Asamblea, Asistente, CreateAsambleaData, UpdateAsambleaData } from '@/types/asamblea.types';
import { toast } from 'sonner';
import { AsambleaService } from '@/lib/services/asamblea.service';

export const useAsamblea = () => {
  const [loading, setLoading] = useState(false);
  const [asambleas, setAsambleas] = useState<Asamblea[]>([]);
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);

  const fetchAsambleas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AsambleaService.getAll();
      setAsambleas(data);
    } catch {
      toast.error('Error al cargar las asambleas');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAsistentes = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await AsambleaService.getAsistentes(id);
      console.log("🚀 ~ useAsamblea ~ res:", res)
      setAsistentes(res);
    } catch {
      toast.error("Error al cargar los asistentes");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsamblea = useCallback(async (data: CreateAsambleaData) => {
    setLoading(true);
    try {
      const newAsamblea = await AsambleaService.createAsamblea({ ...data, estado: 'PROGRAMADA' } as any);
      setAsambleas(prev => [...prev, newAsamblea]);
      toast.success('Asamblea creada exitosamente');
      return newAsamblea;
    } catch (error) {
      toast.error('Error al crear la asamblea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAsamblea = useCallback(async (id: string, data: UpdateAsambleaData) => {
    setLoading(true);
    try {
      const updated = await AsambleaService.updateAsamblea(Number(id), data);
      setAsambleas(prev =>
        prev.map(asamblea =>
          asamblea.id === id
            ? { ...asamblea, ...updated, id: String(updated.id) }
            : asamblea
        )
      );
      toast.success('Asamblea actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la asamblea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAsamblea = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const deleted = await AsambleaService.deleteAsamblea(Number(id));
      setAsambleas(prev =>
        prev.map(asamblea =>
          asamblea.id === id
            ? { ...asamblea, ...deleted, id: String(deleted.id) }
            : asamblea
        )
      ); toast.success('Asamblea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la asamblea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAsistentesByAsamblea = useCallback(() => {
    return Array.isArray(asistentes) ? asistentes : [];
  }, [asistentes]);

  const markAsistencia = useCallback(
  async (idAsamblea: number, id: number, asistio: boolean) => {
    try {
      // Actualizar estado local
      setAsistentes(prev =>
        prev.map(a =>
          a.id === id ? { ...a, asistio } : a
        )
      );

      await AsambleaService.markAsistencia(idAsamblea, id, asistio);

      toast.success('Asistencia actualizada');
    } catch (error) {
      console.error(error);
      toast.error('Error actualizando asistencia');
    }
  },
  []
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
