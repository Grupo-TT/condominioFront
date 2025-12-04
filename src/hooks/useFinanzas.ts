'use client'

import { casaService } from "@/lib/services/casa.service";
import { useEffect, useState } from "react";

export function useObligacionesCasa(idCasa: number | string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const estado = await casaService.getObligacionesByCasa(idCasa);

                const deudasConAño = estado.deudasActivas.map((d: any) => {
                    const date = d.fechaGenerada
                        ? new Date(`${d.fechaGenerada}T00:00:00`)  // ← aquí la magia
                        : null;

                    const año = date ? date.getFullYear() : null;

                    return {
                        ...d,
                        año,
                    };
                });

                const multas = deudasConAño.filter(d => d.tipoObligacion === "MULTA");
                const obligaciones = deudasConAño.filter(d => d.tipoObligacion !== "MULTA");

                const multasPendientesCount = multas.filter(d => d.estadoPago !== "CONDONADO").length;
                const obligacionesPendientesCount = obligaciones.filter(d => d.estadoPago !== "CONDONADO").length;

                setData({
                    ...estado,
                    deudasActivas: deudasConAño,
                    multas,
                    obligaciones,
                    multasPendientesCount,
                    obligacionesPendientesCount,
                });

            } catch (error) {
                console.error("Error cargando estado de cuenta:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [idCasa]);

    return { data, loading };
}
