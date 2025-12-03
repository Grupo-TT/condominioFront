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

                // estado = {
                //   numeroCasa,
                //   propietario,
                //   saldoPendienteTotal,
                //   deudasActivas,
                //   ultimoPago
                // }

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

                const multasPendientesCount = estado.deudasActivas.filter(
                    (o: any) =>
                        o.tipoObligacion === "MULTA" &&
                        o.estadoPago !== "CONDONADO"
                ).length;

                const obligacionesPendientesCount = estado.deudasActivas.filter(
                    (o: any) =>
                        o.estadoPago !== "CONDONADO"
                ).length;

                setData({
                    ...estado,
                    deudasActivas: deudasConAño,
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
