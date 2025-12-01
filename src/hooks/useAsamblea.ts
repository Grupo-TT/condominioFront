'use client';

import { useState, useCallback } from 'react';
import { Asamblea, Asistente, CreateAsambleaData, UpdateAsambleaData } from '@/types/asamblea.types';
import { mockAsambleas, mockAsistentes } from '@/data/asamblea.mock';
import { toast } from 'sonner';

export const useAsamblea = () => {
  const [loading, setLoading] = useState(false);
  const [asambleas, setAsambleas] = useState<Asamblea[]>(mockAsambleas);
  const [asistentes, setAsistentes] = useState<Asistente[]>(mockAsistentes);

  const fetchAsambleas = useCallback(async () => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      setAsambleas(mockAsambleas);
    } catch {
      toast.error('Error al cargar las asambleas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsamblea = useCallback(async (data: CreateAsambleaData) => {
    setLoading(true);
    try {
      // Simular creación
      const newAsamblea: Asamblea = {
        id: Date.now().toString(),
        ...data,
        estado: 'programada',
      };
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
      setAsambleas(prev =>
        prev.map(asamblea => (asamblea.id === id ? { ...asamblea, ...data } : asamblea))
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
      setAsambleas(prev => prev.filter(asamblea => asamblea.id !== id));
      toast.success('Asamblea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la asamblea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAsistentesByAsamblea = useCallback((asambleaId: string) => {
    return asistentes.filter(asistente => asistente.asambleaId === asambleaId);
  }, [asistentes]);

  const markAsistencia = useCallback(async (asistenteId: string, asistio: boolean) => {
    setAsistentes(prev =>
      prev.map(asistente =>
        asistente.id === asistenteId ? { ...asistente, asistio } : asistente
      )
    );
    toast.success('Asistencia actualizada');
  }, []);

  return {
    loading,
    asambleas,
    fetchAsambleas,
    createAsamblea,
    updateAsamblea,
    deleteAsamblea,
    getAsistentesByAsamblea,
    markAsistencia,
  };
};
