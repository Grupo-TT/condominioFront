// hooks/useMembers.ts
import apiClient from '@/lib/config/axios.config';
import { useState, useEffect } from 'react';

interface MemberResponse {
  id: string | number;
  nombre: string;
  parentesco: string;
  estado: boolean;
}

interface FormattedMember {
  id: string | number;
  nombre: string;
  parentesco: string;
  avatar: string;
}

export function useDashboardProp() {
  const [membersData, setMembersData] = useState<FormattedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get<MemberResponse[]>(`/miembros/all-casa-members`);
        const activeMembers = res.data.filter((m: MemberResponse) => m.estado);
        const formattedMembers = activeMembers.map((m: MemberResponse) => {
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
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { membersData, loading, error };
}
