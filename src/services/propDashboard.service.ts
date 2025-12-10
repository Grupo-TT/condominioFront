import { apiClient } from '../lib/config/axios.config'
import type {
    OwnerInfoResponse,
    OwnerInfoData,
    AccountStatusResponse,
    AccountStatusData,
    OwnerSolicitudesResponse,
    OwnerSolicitudItem,
} from '@/types/propietarioDashboard.types'

interface MemberResponse {
    id: number;
    nombre: string;
    parentesco: string;
    estado?: boolean;
}

export interface FormattedMember {
    id: number;
    nombre: string;
    parentesco: string;
    avatar: string;
}

export const propDashboardService = {
    // GET /dashboard-propietario/info
    async getOwnerInfo(): Promise<OwnerInfoData> {
        const response = await apiClient.get<OwnerInfoResponse>(`/dashboard-propietario/info`);
        return response.data.data;
    },

    // GET /dashboard-propietario/account-status
    async getAccountStatus(): Promise<AccountStatusData> {
        const response = await apiClient.get<AccountStatusResponse>(`/dashboard-propietario/account-status`);
        return response.data.data;
    },

    // GET /dashboard-propietario/solicitudes
    async getOwnerSolicitudes(): Promise<OwnerSolicitudItem[]> {
        const response = await apiClient.get<OwnerSolicitudesResponse>(`/dashboard-propietario/solicitudes`);
        return response.data.data;
    },

    // GET /miembros/all-casa-members
    async getMembers(): Promise<FormattedMember[]> {
        const res = await apiClient.get<MemberResponse[]>(`/miembros/all-casa-members`);
        const members = res.data || [];

        const formattedMembers = members
            .filter((m: MemberResponse) => m.estado !== false)
            .map((m: MemberResponse) => {
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
    }
}
