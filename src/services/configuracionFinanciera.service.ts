import { apiClient } from '../lib/config/axios.config'
import { ActualizarResponse, VisualizarResponse } from '../types/configuracionFinanciera.types';

export const valoresConstantesService = {
    async putTasaInteres(nuevoValor: number): Promise<ActualizarResponse> {
        const response = await apiClient.put('/tasa-interes/actualizar', { nuevoValor });
        const body = response.data as ActualizarResponse;
        return body;
    },
    async putPagoAdicional(nuevoValor: number): Promise<ActualizarResponse> {
        const response = await apiClient.put('/pago-adicional/actualizar', { nuevoValor });
        const body = response.data as ActualizarResponse;
        return body;
    },
    async putCargoAdministrativo(nuevoValor: number): Promise<ActualizarResponse> {
        const response = await apiClient.put('/cargo-admin/actualizar', { nuevoValor });
        const body = response.data as ActualizarResponse;
        return body;
    },
    async getConfiguraciones(): Promise<VisualizarResponse> {
        const response = await apiClient.get('/configuracion-financiera');
        const body = response.data as VisualizarResponse;
        return body;
    }
}