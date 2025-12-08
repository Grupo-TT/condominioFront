'use client'

import { casaService } from "@/lib/services/casa.service";
import { useEffect, useState } from "react";

export function useObligacionesCasa(idCasa: number | string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!idCasa) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const estado = await casaService.getObligacionesByCasa(idCasa);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const deudasConAño = estado.deudasActivas.map((d: any) => {
                    let date: Date | null = null;
                    if (d.fechaGenerada) {
                        // Asumiendo formato YYYY-MM-DD del backend
                        // Usamos split para evitar problemas de zona horaria con new Date("YYYY-MM-DD")
                        const [year, month, day] = d.fechaGenerada.split('-').map(Number);
                        // Crear fecha en hora local (00:00:00)
                        date = new Date(year, month - 1, day);
                    }

                    const año = date ? date.getFullYear() : null;

                    return {
                        ...d,
                        año,
                    };
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const multas = deudasConAño.filter((d: any) => d.tipoObligacion === "MULTA");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const obligaciones = deudasConAño.filter((d: any) => d.tipoObligacion !== "MULTA");

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const multasPendientesCount = multas.filter((d: any) => d.estadoPago !== "CONDONADO").length;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const obligacionesPendientesCount = obligaciones.filter((d: any) => d.estadoPago !== "CONDONADO").length;

                setData({
                    ...estado,
                    deudasActivas: deudasConAño,
                    multas,
                    obligaciones,
                    multasPendientesCount,
                    obligacionesPendientesCount,
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Error cargando estado de cuenta:", err);
                setError(err.message || "Error al cargar la información financiera");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [idCasa]);

    return { data, loading, error };
}
