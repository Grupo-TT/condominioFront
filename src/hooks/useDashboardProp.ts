import { useState, useEffect, useCallback } from 'react';
import { propDashboardService, FormattedMember } from '@/services/propDashboard.service';
import { reservasService } from '@/services/propietario.reservas.service';
import type {
  OwnerInfoUI,
  AccountStatusUI,
  SolicitudUI,
  OwnerInfoData,
  AccountStatusData,
  OwnerSolicitudItem
} from '@/types/propietarioDashboard.types';
import type { MisReservasItem } from '@/types/propietario.reservas.types';
import { formatTime, parseFecha } from '@/utils/hora-utils';

// Reservation UI type for dashboard
export interface ReservationUI {
  id: string;
  title: string;
  timeRange: string;
  month: string;
  day: string;
  daysUntil: string;
  resource: string;
  resourceType: 'zona' | 'objeto';
  attendees: number;
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'finalizada';
  bgColor: string;
  footerColor: string;
  resourceBgColor: string;
}

// Helper to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper to format date
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Helper to adapt owner info
const adaptOwnerInfo = (data: OwnerInfoData): OwnerInfoUI => ({
  numeroCasa: data.numeroCasa,
  tipoUso: data.tipoUso === 'RESIDENCIAL' ? 'Residencial' : 'Arrendada',
  cantidadMiembros: data.cantidadMiembros,
  cantidadMascotas: data.cantidadMascotas,
});

// Helper to adapt account status
const adaptAccountStatus = (data: AccountStatusData): AccountStatusUI => ({
  saldoPendiente: formatCurrency(data.saldoPendiente),
  estadoCasa: data.estadoCasa,
  ultimoPago: data.ultimoPago ? {
    fecha: formatDate(data.ultimoPago.fecha),
    concepto: data.ultimoPago.concepto,
    valor: formatCurrency(data.ultimoPago.valor),
    tipoAbono: data.ultimoPago.tipoAbono,
  } : null,
});

// Helper to adapt solicitudes
const adaptSolicitud = (item: OwnerSolicitudItem): SolicitudUI => {
  const tipoMap: Record<string, SolicitudUI['tipo']> = {
    'REPARACION_LOCATIVA': 'reparacion-locativa',
    'QUEJA': 'queja',
    'PETICION': 'peticion',
    'SUGERENCIA': 'sugerencia',
  };

  const estadoMap: Record<string, SolicitudUI['estado']> = {
    'PENDIENTE': 'pendiente',
    'APROBADA': 'aprobada',
    'RECHAZADA': 'rechazada',
    'REVISADA': 'revisada',
  };

  return {
    id: String(item.id),
    titulo: item.titulo,
    tipo: tipoMap[item.tipo] || 'peticion',
    fecha: item.fecha,
    estado: estadoMap[item.estado] || 'pendiente',
    descripcion: item.descripcion,
  };
};

// Helper to get color palette for reservations
const getReservationColors = (index: number) => {
  const palettes = [
    { bgColor: '#feeecd', footerColor: '#efe1c7', resourceBgColor: '#fef9f0' },
    { bgColor: 'rgb(237 233 254)', footerColor: 'rgba(196 181 253 / 0.8)', resourceBgColor: 'rgb(245 243 255)' },
    { bgColor: '#e0f2fe', footerColor: '#bae6fd', resourceBgColor: '#f0f9ff' },
    { bgColor: '#dcfce7', footerColor: '#bbf7d0', resourceBgColor: '#f0fdf4' },
  ];
  return palettes[index % palettes.length];
};

// Helper to calculate days until reservation
const getDaysUntil = (dateStr: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reservationDate = new Date(dateStr);
  reservationDate.setHours(0, 0, 0, 0);

  const diffTime = reservationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays < 0) return 'Pasada';
  return `En ${diffDays} días`;
};

// Helper to adapt reservations for dashboard
const adaptReservation = (item: MisReservasItem, index: number): ReservationUI => {
  const fecha = parseFecha(item.fechaReserva);
  const colors = getReservationColors(index);

  return {
    id: String(item.id),
    title: item.nombre,
    timeRange: `${formatTime(item.horaInicio)} - ${formatTime(item.horaFin)}`,
    month: fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''),
    day: fecha.getDate().toString(),
    daysUntil: getDaysUntil(item.fechaReserva),
    resource: item.descripcion || item.nombre,
    resourceType: item.tipoRecursoComun.toLowerCase() as 'zona' | 'objeto',
    attendees: item.numeroInvitados,
    status: item.estadoSolicitud.toLowerCase() as ReservationUI['status'],
    ...colors,
  };
};

export function useDashboardProp() {
  // Members state
  const [membersData, setMembersData] = useState<FormattedMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Owner info state
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoUI | null>(null);
  const [loadingOwnerInfo, setLoadingOwnerInfo] = useState(true);

  // Account status state
  const [accountStatus, setAccountStatus] = useState<AccountStatusUI | null>(null);
  const [loadingAccountStatus, setLoadingAccountStatus] = useState(true);

  // Reservations state
  const [reservations, setReservations] = useState<ReservationUI[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  // Solicitudes state
  const [solicitudes, setSolicitudes] = useState<SolicitudUI[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  // Error state
  const [error, setError] = useState<Error | null>(null);

  // Store idCasa for reservations
  const [idCasa, setIdCasa] = useState<number | null>(null);

  // Fetch owner info
  const fetchOwnerInfo = useCallback(async () => {
    try {
      setLoadingOwnerInfo(true);
      const data = await propDashboardService.getOwnerInfo();
      setOwnerInfo(adaptOwnerInfo(data));
    } catch (err) {
      console.error("Error fetching owner info:", err);
      setError(err instanceof Error ? err : new Error('Error al obtener información del propietario'));
    } finally {
      setLoadingOwnerInfo(false);
    }
  }, []);

  // Fetch account status
  const fetchAccountStatus = useCallback(async () => {
    try {
      setLoadingAccountStatus(true);
      const data = await propDashboardService.getAccountStatus();
      setAccountStatus(adaptAccountStatus(data));
    } catch (err) {
      console.error("Error fetching account status:", err);
      setError(err instanceof Error ? err : new Error('Error al obtener estado de cuenta'));
    } finally {
      setLoadingAccountStatus(false);
    }
  }, []);

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      setLoadingMembers(true);
      const data = await propDashboardService.getMembers();
      setMembersData(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err instanceof Error ? err : new Error('Error al obtener miembros'));
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  // Fetch reservations
  const fetchReservations = useCallback(async (casaId: number) => {
    try {
      setLoadingReservations(true);
      const data = await reservasService.getMisReservas(casaId);
      // Filter only upcoming/approved reservations and limit to 5
      const upcomingReservations = data
        .filter((r: MisReservasItem) =>
          r.estadoSolicitud === 'APROBADA' || r.estadoSolicitud === 'PENDIENTE'
        )
        .slice(0, 5)
        .map((r: MisReservasItem, index: number) => adaptReservation(r, index));
      setReservations(upcomingReservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError(err instanceof Error ? err : new Error('Error al obtener reservas'));
    } finally {
      setLoadingReservations(false);
    }
  }, []);

  // Fetch solicitudes
  const fetchSolicitudes = useCallback(async () => {
    try {
      setLoadingSolicitudes(true);
      const data = await propDashboardService.getOwnerSolicitudes();
      // Limit to 6 most recent solicitudes for dashboard
      const recentSolicitudes = data.slice(0, 6).map(adaptSolicitud);
      setSolicitudes(recentSolicitudes);
    } catch (err) {
      console.error("Error fetching solicitudes:", err);
      setError(err instanceof Error ? err : new Error('Error al obtener solicitudes'));
    } finally {
      setLoadingSolicitudes(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchOwnerInfo();
    fetchAccountStatus();
    fetchMembers();
    fetchSolicitudes();
  }, [fetchOwnerInfo, fetchAccountStatus, fetchMembers, fetchSolicitudes]);

  // Fetch reservations when idCasa is available
  useEffect(() => {
    if (idCasa) {
      fetchReservations(idCasa);
    }
  }, [idCasa, fetchReservations]);

  // Combined loading state
  const loading = loadingMembers || loadingOwnerInfo || loadingAccountStatus;

  return {
    // Data
    membersData,
    ownerInfo,
    accountStatus,
    reservations,
    solicitudes,

    // Loading states
    loading,
    loadingMembers,
    loadingOwnerInfo,
    loadingAccountStatus,
    loadingReservations,
    loadingSolicitudes,

    // Error
    error,

    // Actions
    setIdCasa,
    refetch: {
      ownerInfo: fetchOwnerInfo,
      accountStatus: fetchAccountStatus,
      members: fetchMembers,
      reservations: fetchReservations,
      solicitudes: fetchSolicitudes,
    }
  };
}
