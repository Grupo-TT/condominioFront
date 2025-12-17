import { getMovimientosMes } from "@/lib/services/cuotas.service";
import { Metricas, Movimiento } from "@/types/cuotas.types";
import { useEffect, useState } from "react";

// Flag para usar datos mock (cambiar a false cuando la API esté disponible)
const USE_MOCK_DATA = false;

// Datos mock para pruebas
const generarMovimientosMock = (mes: number, anio: number): { movimientos: Movimiento[], metricas: Metricas } => {
  const conceptosEntrada = [
    { concepto: 'Pago de administración', descripcion: 'Pago mensual de cuota de administración', categoria: 'ADMINISTRACION_CUOTAS' },
    { concepto: 'Pago cuota extraordinaria', descripcion: 'Cuota extraordinaria para mantenimiento', categoria: 'ADMINISTRACION_CUOTAS' },
    { concepto: 'Ingreso por alquiler de salón', descripcion: 'Alquiler del salón comunal para evento', categoria: 'EVENTOS_DECORACION' },
    { concepto: 'Pago de multa', descripcion: 'Pago de multa por infracción de normas', categoria: 'MULTAS' },
  ];

  const conceptosSalida = [
    { concepto: 'Pago de servicios públicos', descripcion: 'Factura de energía eléctrica zonas comunes', categoria: 'SERVICIOS_PUBLICOS', responsable: 'EPM' },
    { concepto: 'Servicio de aseo', descripcion: 'Pago mensual servicio de aseo y jardinería', categoria: 'ASEO_JARDINERIA', responsable: 'ServiAseo S.A.S' },
    { concepto: 'Mantenimiento ascensor', descripcion: 'Mantenimiento preventivo mensual ascensor', categoria: 'MANTENIMIENTO_REPARACIONES', responsable: 'Ascensores Colombia' },
    { concepto: 'Químicos piscina', descripcion: 'Compra de químicos para tratamiento de agua', categoria: 'PISCINA', responsable: 'QuimiPool' },
    { concepto: 'Servicio de vigilancia', descripcion: 'Pago mensual empresa de seguridad', categoria: 'SEGURIDAD_ACCESO', responsable: 'Seguridad 24/7' },
    { concepto: 'Nómina personal', descripcion: 'Pago de nómina del mes', categoria: 'PERSONAL_MANO_OBRA', responsable: 'Recursos Humanos' },
    { concepto: 'Reparación puerta garaje', descripcion: 'Reparación de motor puerta principal', categoria: 'MANTENIMIENTO_REPARACIONES', responsable: 'Puertas y Portones' },
    { concepto: 'Factura de agua', descripcion: 'Consumo de agua zonas comunes', categoria: 'SERVICIOS_PUBLICOS', responsable: 'Aguas del Norte' },
  ];

  const casas = ['Casa No. 1', 'Casa No. 2', 'Casa No. 5', 'Casa No. 7', 'Casa No. 10', 'Casa No. 12', 'Casa No. 15'];

  const movimientos: Movimiento[] = [];
  let totalIngresos = 0;
  let totalEgresos = 0;

  // Generar entre 15 y 25 movimientos aleatorios
  const numMovimientos = 15 + Math.floor(Math.random() * 11);

  for (let i = 0; i < numMovimientos; i++) {
    const esEntrada = Math.random() > 0.4; // 60% entradas, 40% salidas
    const dia = 1 + Math.floor(Math.random() * 28);
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    if (esEntrada) {
      const entrada = conceptosEntrada[Math.floor(Math.random() * conceptosEntrada.length)];
      const casa = casas[Math.floor(Math.random() * casas.length)];
      const monto = 150000 + Math.floor(Math.random() * 350000);
      totalIngresos += monto;

      movimientos.push({
        id: `mov-${i + 1}`,
        fecha,
        tipo: 'ENTRADA',
        concepto: `${entrada.concepto} - ${casa}`,
        descripcion: entrada.descripcion,
        monto,
        categoria: entrada.categoria,
        responsable: casa,
      });
    } else {
      const salida = conceptosSalida[Math.floor(Math.random() * conceptosSalida.length)];
      const monto = 80000 + Math.floor(Math.random() * 600000);
      totalEgresos += monto;

      movimientos.push({
        id: `mov-${i + 1}`,
        fecha,
        tipo: 'SALIDA',
        concepto: salida.concepto,
        descripcion: salida.descripcion,
        monto,
        categoria: salida.categoria,
        responsable: salida.responsable,
      });
    }
  }

  // Ordenar por fecha descendente
  movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const metricas: Metricas = {
    ingresos: totalIngresos,
    egresos: totalEgresos,
    balance: totalIngresos - totalEgresos,
    saldoActual: 5000000 + (totalIngresos - totalEgresos), // Saldo base + balance
  };

  return { movimientos, metricas };
};

export function useMovimientosMes(periodo: Date) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);

  const [trigger, setTrigger] = useState(0);

  const recargar = () => setTrigger(prev => prev + 1);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);

      const mes = periodo.getMonth() + 1;
      const anio = periodo.getFullYear();

      // Si USE_MOCK_DATA está activado, usar datos mock directamente
      if (USE_MOCK_DATA) {
        const mockData = generarMovimientosMock(mes, anio);
        setMovimientos(mockData.movimientos);
        setMetricas(mockData.metricas);
        setLoading(false);
        return;
      }

      try {
        const res = await getMovimientosMes(mes, anio);

        const metrics =
          res?.data?.metricas ??
          res?.metricas ??
          null;

        const lista =
          res?.data?.movimientos ??
          res?.data ??
          res?.movimientos ??
          res ??
          [];

        setMovimientos(lista);
        setMetricas(metrics);
      } catch (err) {
        console.error("Error cargando movimientos:", err);
        // Fallback a datos mock en caso de error
        const mockData = generarMovimientosMock(mes, anio);
        setMovimientos(mockData.movimientos);
        setMetricas(mockData.metricas);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [periodo, trigger]);

  return { movimientos, loading, metricas, recargar };
}

// Exportar función para generar mocks (usada en reporte anual)
export { generarMovimientosMock };
