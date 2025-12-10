// hooks/useMembers.ts
import apiClient from '@/lib/config/axios.config';
import { useState, useEffect } from 'react';

export function useDashboardProp() {
  const [membersData, setMembersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/miembros/all-casa-members`);
        const activeMembers = res.data.filter((m: any) => m.estado);
        const formattedMembers = activeMembers.map((m: any) => {
          const nombres = m.nombre.split(' ');
          let avatar = '';
          if (nombres.length >= 2) avatar = nombres[0][0] + nombres[1][0];
          else if (nombres.length === 1) avatar = nombres[0][0];

          return {
            id: m.id,
            nombre: m.nombre,
            parentesco: m.parentesco,
            avatar: avatar.toUpperCase(),
          };
        });
        setMembersData(formattedMembers);
      } catch (err) {
        console.error("Error al obtener los miembros:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { membersData, loading, error };
}
