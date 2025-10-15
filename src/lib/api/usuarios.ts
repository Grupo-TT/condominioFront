import { api } from "./client";

import { Usuario } from "@/types/usuario.types";

export const usuariosApi = {
    async crearUsuario(usuario: Usuario) {
        const response = await api.post("/persona/register", usuario);
        return response.data;
    },
};
