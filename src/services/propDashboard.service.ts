import { apiClient } from '../lib/config/axios.config'

interface MemberResponse {
    id: number;
    nombre: string;
    parentesco: string;
    estado?: boolean;
}

export const propDashboardService = {
    async getMembers() {
        try {
            const res = await apiClient.get<MemberResponse[]>(`/miembros/all-casa-members`);
            const members = res.data || [];

            const formattedMembers = members.map((m: MemberResponse) => {
                const nombres = m.nombre.split(' ');
                let avatar = '';
                if (nombres.length >= 2) {
                    avatar = nombres[0][0] + nombres[1][0];
                } else if (nombres.length === 1) {
                    avatar = nombres[0][0];
                }

                return {
                    id: m.id,
                    nombre: m.nombre,
                    parentesco: m.parentesco,
                    avatar: avatar.toUpperCase(),
                };
            });

            return formattedMembers;
        } catch (error) {
            console.error("Error al obtener los miembros:", error);
            throw error;
        }
    }
}
