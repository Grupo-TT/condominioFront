"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle, ChevronDown, BarChart3 } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Book02Icon, UserCheck02Icon, Delete02Icon, PencilEdit02Icon, FullScreenIcon } from '@hugeicons/core-free-icons';
import { useAsamblea } from '@/hooks/useAsamblea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Asamblea } from '@/types/asamblea.types';
import { AnimatedTabs } from '@/components/animated-tabs';
import { TimeSelector } from '@/components/time-selector';
import { Input } from '@/components/ui/input';
import { FormFieldWithTooltip } from '@/components/forms/FormField';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, X } from 'lucide-react';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ButtonArrow } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";

// Esquema de validación para nueva asamblea
const asambleaSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  fecha: z.string().min(1, "La fecha es requerida"),
  horaInicio: z.string().min(1, "La hora es requerida"),
  lugar: z.string().min(1, "El lugar es requerido"),
});

type AsambleaFormData = z.infer<typeof asambleaSchema>;

export default function AsambleaPage() {
  const { loading, asambleas, fetchAsambleas, fetchAsistentes, createAsamblea, updateAsamblea, deleteAsamblea, getAsistentesByAsamblea, markAsistencia } = useAsamblea();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [selectedAsamblea, setSelectedAsamblea] = useState<Asamblea | null>(null);
  const [isAttendanceSheetOpen, setIsAttendanceSheetOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'futuras' | 'pasadas'>('futuras');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('todos');
  const [yearComboboxOpen, setYearComboboxOpen] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState('');

  const selectedAttendance = useMemo(() => {
    if (!selectedAsamblea) return [];
    return getAsistentesByAsamblea();
  }, [selectedAsamblea, getAsistentesByAsamblea]);

  const attendanceStats = useMemo(() => {
    const total = selectedAttendance.length;
    const presentes = selectedAttendance.filter((a) => a.asistio).length;
    const ausentes = total - presentes;
    const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;
    return { total, presentes, ausentes, porcentaje };
  }, [selectedAttendance]);

  const filteredAttendance = useMemo(() => {
    const term = (attendanceSearch || '').toLowerCase();
    return selectedAttendance.filter((asistente) =>
      (asistente.nombre || '').toLowerCase().includes(term) ||
      String(asistente.id).includes(term)
    );
  }, [attendanceSearch, selectedAttendance]);

  const presentAttendees = useMemo(() => selectedAttendance.filter((asistente) => asistente.asistio), [selectedAttendance]);

  const descriptionThreshold = 195;
  const shouldTruncateDescription = useMemo(() => {
    if (!selectedAsamblea) return false;
    return selectedAsamblea.descripcion.length > descriptionThreshold;
  }, [selectedAsamblea]);

  const displayedDescription = useMemo(() => {
    if (!selectedAsamblea) return '';
    if (showFullDescription || !shouldTruncateDescription) {
      return selectedAsamblea.descripcion;
    }
    return `${selectedAsamblea.descripcion.slice(0, descriptionThreshold).trim()}...`;
  }, [selectedAsamblea, showFullDescription, shouldTruncateDescription]);

  const form = useForm<AsambleaFormData>({
    resolver: zodResolver(asambleaSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      fecha: '',
      horaInicio: '',
      lugar: '',
    },
  });

  useEffect(() => {
    fetchAsambleas();
  }, [fetchAsambleas]);

  useEffect(() => {
    setShowFullDescription(false);
  }, [selectedAsamblea]);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const handleSubmit = async (data: AsambleaFormData) => {
    try {
      if (isEditing && selectedAsamblea) {
        await updateAsamblea(selectedAsamblea.id, { ...data, estado: selectedAsamblea.estado });
      } else {
        await createAsamblea(data);
      }
      setIsSheetOpen(false);
      form.reset();
      setShowErrors(false);
      setIsEditing(false);
      setSelectedAsamblea(null);
    } catch (error) {
      console.error('Error guardando asamblea:', error);
    }
  };

  const handleEditAsamblea = (asamblea: Asamblea) => {
    setSelectedAsamblea(asamblea);
    setIsEditing(true);
    setIsSheetOpen(true);
    setShowErrors(false);
    form.reset({
      titulo: asamblea.titulo,
      descripcion: asamblea.descripcion,
      fecha: asamblea.fecha,
      horaInicio: asamblea.horaInicio,
      lugar: asamblea.lugar,
    });
  };

  const handleOpenAttendanceSheet = async (asamblea: Asamblea) => {
    setSelectedAsamblea(asamblea);
    setIsAttendanceSheetOpen(true);
    setAttendanceSearch('');
    try {
      await fetchAsistentes(asamblea.id);
    } catch {
      toast.error('No se pudo cargar la asistencia');
    }
  };

  const handleOpenDetailSheet = (asamblea: Asamblea) => {
    setSelectedAsamblea(asamblea);
    setIsDetailSheetOpen(true);
    setAttendanceSearch('');
  };

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
    setShowErrors(false);
    setIsEditing(false);
    setSelectedAsamblea(null);
    form.reset();
  };

  // Generar años disponibles de asambleas pasadas
  const availableYears = useMemo(() => {
    const pastAssemblies = asambleas.filter(asamblea => {
      const asambleaDate = new Date(asamblea.fecha);
      const now = new Date();
      return asambleaDate < now;
    });

    const years = new Set(pastAssemblies.map(asamblea => new Date(asamblea.fecha).getFullYear()));
    return Array.from(years).sort((a, b) => b - a); // Más reciente primero
  }, [asambleas]);

  // Filtrar asambleas por fecha, búsqueda y año
  const filteredAsambleas = asambleas.filter((asamblea) => {
    const now = new Date();
    const asambleaDate = new Date(asamblea.fecha);
    const isFuture = asambleaDate >= now;
    const isPast = asambleaDate < now;

    // Filtrar por tab activo
    if (activeTab === 'futuras' && !isFuture) return false;
    if (activeTab === 'pasadas' && !isPast) return false;

    // Filtrar por año (solo para asambleas pasadas)
    if (activeTab === 'pasadas' && yearFilter !== 'todos') {
      const assemblyYear = asambleaDate.getFullYear();
      if (assemblyYear.toString() !== yearFilter) return false;
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        asamblea.titulo.toLowerCase().includes(searchLower) ||
        asamblea.descripcion.toLowerCase().includes(searchLower) ||
        asamblea.lugar.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const cardsScrollAreaHeight = 'calc(100vh - 270px)';
  const today = new Date();
  const minSelectableDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleMarkAttendance = async (idAsamblea: number, numeroCasa: number, asistio: boolean) => {
    if (selectedAsamblea) {
      await markAsistencia(idAsamblea, numeroCasa, asistio);
    }
  };

  const handleDeleteAsamblea = async () => {
    if (selectedAsamblea) {
      await deleteAsamblea(selectedAsamblea.id);
      setIsDeleteDialogOpen(false);
      setSelectedAsamblea(null);
    }
  };

  const handleOpenDeleteDialog = (asamblea: Asamblea) => {
    setSelectedAsamblea(asamblea);
    setIsDeleteDialogOpen(true);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return 'bg-blue-100 text-blue-800';
      case 'EN_CURSO': return 'bg-green-100 text-green-800';
      case 'REALIZADA': return 'bg-gray-100 text-gray-800';
      case 'CANCELADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return 'Programada';
      case 'EN_CURSO': return 'En Curso';
      case 'REALIZADA': return 'Realizada';
      case 'CANCELADA': return 'Cancelada';
      default: return estado;
    }
  };

  const formatPrettyDate = (dateString: string) => {
    const date = new Date(`${dateString}`);
    if (isNaN(date.getTime())) return dateString;
    const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short' });
    const month = monthFormatter.format(date);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${capitalizedMonth} ${day}, ${year}`;
  };

  const formatPrettyTime = (timeString?: string) => {
    if (!timeString || typeof timeString !== "string") {
      return "Hora no disponible";
    }

    const parts = timeString.split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return timeString;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${hour12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const renderAsambleaDetails = (
    asamblea: Asamblea,
    options?: {
      showViewButton?: boolean;
      onViewDetails?: () => void;
    }
  ) => {
    const details = [
      {
        icon: Calendar,
        label: 'Fecha programada',
        value: formatPrettyDate(asamblea.fecha),
      },
      {
        icon: Clock,
        label: 'Hora de la asamblea',
        value: formatPrettyTime(asamblea.horaInicio),
      },
      {
        icon: MapPin,
        label: 'Lugar de reunión',
        value: asamblea.lugar,
      },
    ];

    return (
      <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50/60 p-3 relative">
        {options?.showViewButton && options.onViewDetails && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={options.onViewDetails}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors duration-150 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                aria-label="Ver detalles de la asamblea"
              >
                <HugeiconsIcon icon={FullScreenIcon} size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Ver detalles</TooltipContent>
          </Tooltip>
        )}
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="grid grid-cols-[28px_160px_minmax(0,1fr)] items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-gray-600">
              {label}
            </span>
            <span className="text-sm text-gray-900 leading-tight pl-6">
              {value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const groupAsambleasByYear = (items: Asamblea[]): { year: number; list: Asamblea[] }[] => {
    const groups = new Map<number, Asamblea[]>();

    items.forEach((item) => {
      const year = new Date(item.fecha).getFullYear();
      const list = groups.get(year) ?? [];
      list.push(item);
      groups.set(year, list);
    });

    return Array.from(groups.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, list]) => ({ year, list }));
  };

  const renderAsambleaCard = (
    asamblea: Asamblea,
    options?: { showAttendance?: boolean; variant?: 'future' | 'past' }
  ) => {
    const asambleaDate = new Date(`${asamblea.fecha}`);
    const now = new Date();
    const isFutureAssembly = asambleaDate >= now;
    const canEdit = true;
    const canDelete = true;
    const isPastCard = options?.variant === 'past';
    const attendees = options?.showAttendance ? getAsistentesByAsamblea() : null;
    const totalAttendees = attendees?.length ?? 0;
    const attendedCount = attendees ? attendees.filter((a) => a.asistio).length : 0;
    const attendanceRate = attendees && totalAttendees > 0
      ? Math.round((attendedCount / totalAttendees) * 100)
      : null;

    return (
      <Card key={asamblea.id} className="flex flex-col min-h-[320px] hover:shadow-md transition-shadow gap-1 py-3">
        <CardHeader className="px-4 pt-2 pb-1 gap-0">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <CardTitle className="flex flex-1 items-center gap-3 text-lg font-semibold text-gray-900 min-w-0 overflow-hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 shadow-sm">
                <HugeiconsIcon icon={Book02Icon} size={18} strokeWidth={1.8} />
              </span>
              <span className="truncate leading-tight">
                {asamblea.titulo}
              </span>
            </CardTitle>
            <Badge className={cn("shrink-0", getEstadoColor(asamblea.estado))}>
              {getEstadoLabel(asamblea.estado)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-5 pt-0 pb-3 gap-2">
          <div className="min-h-[48px]">
            <p className="mt-1 text-sm text-gray-600 leading-snug line-clamp-2">
              {asamblea.descripcion}
            </p>
          </div>

          <div className="text-sm text-gray-600 flex-1">
            {renderAsambleaDetails(asamblea, {
              showViewButton: !isPastCard,
              onViewDetails: () => handleOpenDetailSheet(asamblea),
            })}
          </div>

          {options?.showAttendance && (
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <HugeiconsIcon icon={UserCheck02Icon} size={20} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tasa de asistencia
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {attendanceRate !== null ? 'Seguimiento de participación' : 'Sin datos de asistencia'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900 leading-tight">
                  {attendanceRate !== null ? `${attendanceRate}%` : 'N/A'}
                </p>
                {attendanceRate !== null && (
                  <p className="text-xs text-gray-500">
                    {attendedCount} de {totalAttendees} asistentes
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto flex gap-2 pt-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 h-11 rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-700 text-sm font-medium border-transparent"
                  onClick={() => (isPastCard ? handleOpenDetailSheet(asamblea) : handleOpenAttendanceSheet(asamblea))}
                >
                  {isPastCard ? 'Ver detalle' : 'Gestionar Asistencia'}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{isPastCard ? 'Ver detalle de la asamblea' : 'Gestionar asistencia'}</TooltipContent>
            </Tooltip>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "w-10 h-10 rounded-md border-gray-200 shadow-sm",
                      !canEdit && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Editar asamblea"
                    onClick={() => canEdit && handleEditAsamblea(asamblea)}
                    disabled={!canEdit}
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} size={21} strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Editar asamblea</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => canDelete && handleOpenDeleteDialog(asamblea)}
                    disabled={!canDelete}
                    className={cn(
                      "w-10 h-10 rounded-md border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 shadow-sm",
                      !canDelete && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-red-600"
                    )}
                    aria-label="Eliminar asamblea"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={21} strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Eliminar asamblea</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          {/* ... */}
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">
                  Dashboard Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Asambleas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Asambleas
              </h1>
              <p className="text-gray-500 mt-1">
                Programa y gestiona las asambleas del condominio, incluyendo la asistencia de los propietarios.
              </p>
            </div>
          </div>

          {/* Tabs y controles */}
          <AnimatedTabs
            className="flex flex-1 flex-col space-y-4 overflow-hidden"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'futuras' | 'pasadas')}
            tabs={[
              {
                value: 'futuras',
                label: 'Programadas',
                content: (
                  <ScrollArea style={{ height: cardsScrollAreaHeight }} className="pr-2" viewportClassName="pr-1">
                    {loading || filteredAsambleas.length > 0 ? (
                      <div className="space-y-8 pt-2">
                        {groupAsambleasByYear(filteredAsambleas).map(({ year, list }) => (
                          <div key={`future-${year}`} className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                {year}
                              </h3>
                              <div className="h-px flex-1 ml-4 bg-linear-to-r from-gray-200 to-transparent" />
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {list.map((asamblea) => renderAsambleaCard(asamblea))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Sin resultados */
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <Users className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No se encontraron asambleas futuras
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {searchTerm
                            ? `No hay asambleas futuras que coincidan con "${searchTerm}"`
                            : 'No hay asambleas programadas para fechas futuras'
                          }
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                ),
              },
              {
                value: 'pasadas',
                label: 'Pasadas',
                content: (
                  <ScrollArea style={{ height: cardsScrollAreaHeight }} className="pr-2" viewportClassName="pr-1">
                    <div className="space-y-6 pt-2">
                      {/* Lista de asambleas pasadas */}
                      {loading || filteredAsambleas.length > 0 ? (
                        <div className="space-y-8">
                          {groupAsambleasByYear(filteredAsambleas).map(({ year, list }) => (
                            <div key={`past-${year}`} className="space-y-4">
                              <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                  {year}
                                </h3>
                                <div className="h-px flex-1 ml-4 bg-linear-to-r from-gray-200 to-transparent" />
                              </div>
                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {list.map((asamblea) => renderAsambleaCard(asamblea, { showAttendance: true, variant: 'past' }))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Sin resultados */
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="text-gray-400 mb-2">
                            <Users className="w-12 h-12 mx-auto" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No se encontraron asambleas pasadas
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {searchTerm
                              ? `No hay asambleas pasadas que coincidan con "${searchTerm}"${yearFilter !== 'todos' ? ` en el año ${yearFilter}` : ''}`
                              : yearFilter !== 'todos'
                                ? `No hay asambleas pasadas en el año ${yearFilter}`
                                : 'No hay asambleas realizadas en fechas anteriores'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ),
              },
            ]}
            rightContent={
              <>
                {activeTab === 'pasadas' && (
                  <Popover open={yearComboboxOpen} onOpenChange={setYearComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        mode="input"
                        placeholder={yearFilter === 'todos'}
                        className="w-[180px] h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        {yearFilter !== 'todos' ? (
                          <span className="flex items-center gap-2.5">
                            <span className="ms-0.5 size-1.5 rounded-full bg-blue-500"></span>
                            <span className="truncate text-sm">
                              {yearFilter}
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Filtrar por año</span>
                        )}
                        <ButtonArrow />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[180px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar año..." />
                        <CommandList>
                          <CommandEmpty>No se encontró año.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="todos"
                              onSelect={() => {
                                setYearFilter('todos')
                                setYearComboboxOpen(false)
                              }}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className="ms-1 size-1.5 rounded-full bg-gray-400"></span>
                                <span className="truncate">Todos</span>
                              </span>
                              {yearFilter === 'todos' && <CommandCheck />}
                            </CommandItem>
                            {availableYears.map((year) => (
                              <CommandItem
                                key={year}
                                value={year.toString()}
                                onSelect={() => {
                                  setYearFilter(year.toString())
                                  setYearComboboxOpen(false)
                                }}
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="ms-1 size-1.5 rounded-full bg-blue-500"></span>
                                  <span className="truncate">{year}</span>
                                </span>
                                {yearFilter === year.toString() && <CommandCheck />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <div className="relative w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar asambleas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  {searchTerm !== '' && (
                    <Button
                      onClick={handleClearSearch}
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  )}
                </div>
                <Button className="gap-2" onClick={handleOpenSheet}>
                  <Plus className="w-4 h-4" />
                  Programar Asamblea
                </Button>
              </>
            }
          />
        </div>
      </div>

      {/* Sheet para programar nueva asamblea */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{
            width: "500px",
            maxWidth: "none",
          }}
        >
          <SheetHeader className="px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 shadow-sm">
                <HugeiconsIcon icon={Book02Icon} size={22} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  {isEditing ? 'Editar Asamblea' : 'Programar Nueva Asamblea'}
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {isEditing ? 'Modifica los detalles de la asamblea.' : 'Crea una nueva asamblea para el condominio.'}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <form
              id="asamblea-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 px-6 pt-6 pb-4"
            >
              <div className="space-y-5">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Información general</h4>
                  <p className="text-sm text-gray-500">Define el título y la descripción de la asamblea.</p>
                </div>

                <div className="space-y-4">
                  <Controller
                    name="titulo"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormFieldWithTooltip
                        label="Título de la Asamblea"
                        required
                        invalid={fieldState.invalid && showErrors}
                        error={form.formState.errors.titulo?.message}
                        className="space-y-1"
                      >
                        <input
                          {...field}
                          id="asamblea-titulo"
                          type="text"
                          placeholder="Ej: Asamblea Ordinaria 2024"
                          className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            fieldState.invalid && showErrors && "border-red-500 focus-visible:ring-red-500"
                          )}
                        />
                      </FormFieldWithTooltip>
                    )}
                  />

                  <Controller
                    name="descripcion"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormFieldWithTooltip
                        label="Descripción"
                        required
                        invalid={fieldState.invalid && showErrors}
                        error={form.formState.errors.descripcion?.message}
                        className="space-y-1"
                      >
                        <Textarea
                          {...field}
                          id="asamblea-descripcion"
                          autoFocus={false}
                          placeholder="Describe el propósito y temas a tratar en la asamblea"
                          className="min-h-[90px]"
                        />
                      </FormFieldWithTooltip>
                    )}
                  />
                </div>

                <Separator className="my-2" />

                <div className="pt-2">
                  <h4 className="text-base font-semibold text-gray-900">Detalles de programación</h4>
                  <p className="text-sm text-gray-500">Selecciona la fecha, hora y lugar del encuentro.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller
                      name="fecha"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormFieldWithTooltip
                          label="Fecha"
                          required
                          invalid={fieldState.invalid && showErrors}
                          error={form.formState.errors.fecha?.message}
                        >
                          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                id="asamblea-fecha"
                                variant="outline"
                                type="button"
                                className="h-10 w-full justify-between rounded-md border border-input bg-background px-3 text-sm font-normal"
                              >
                                <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="truncate">
                                    {field.value
                                      ? (() => {
                                        const formatted = new Date(`${field.value}`).toLocaleDateString('es-ES', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        });
                                        return formatted.replace(/^\p{L}/u, (char) => char.toUpperCase());
                                      })()
                                      : 'Selecciona una fecha'}
                                  </span>
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                                onSelect={(date) => {
                                  field.onChange(date ? date.toISOString().split('T')[0] : '');
                                  setDatePickerOpen(false);
                                }}
                                disabled={(date) => date < minSelectableDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormFieldWithTooltip>
                      )}
                    />

                    <Controller
                      name="horaInicio"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormFieldWithTooltip
                          label="Hora"
                          required
                          invalid={fieldState.invalid && showErrors}
                          error={form.formState.errors.horaInicio?.message}
                        >
                          <TimeSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormFieldWithTooltip>
                      )}
                    />
                  </div>

                  <Controller
                    name="lugar"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormFieldWithTooltip
                        label="Lugar"
                        required
                        invalid={fieldState.invalid && showErrors}
                        error={form.formState.errors.lugar?.message}
                      >
                        <div className="relative">
                          <div className="text-muted-foreground pointer-events-none absolute top-2.5 left-0 flex items-center justify-center pl-3">
                            <MapPin className="h-4 w-4" />
                            <span className="sr-only">Ubicación</span>
                          </div>
                          <Textarea
                            {...field}
                            id="asamblea-lugar"
                            rows={1}
                            placeholder="Ej: Salón Comunitario"
                            className={cn(
                              "peer h-11 min-h-[44px] resize-y w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              fieldState.invalid && showErrors && "border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                        </div>
                      </FormFieldWithTooltip>
                    )}
                  />
                </div>
              </div>
            </form>
          </div>

          <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
            <Button
              variant="outline"
              className="flex-1 h-10 font-medium"
              onClick={() => {
                setIsSheetOpen(false);
                form.reset();
                setShowErrors(false);
              }}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="asamblea-form"
              className="flex-1 h-10 font-medium"
              onClick={() => setShowErrors(true)}
            >
              {isEditing ? 'Guardar Cambios' : 'Programar Asamblea'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Sheet para gestión de asistencia */}
      <Sheet open={isAttendanceSheetOpen} onOpenChange={setIsAttendanceSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{
            width: "720px",
            maxWidth: "none",
          }}
        >
          <SheetHeader className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 shadow-sm">
                <HugeiconsIcon icon={Book02Icon} size={24} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  Gestión de Asistencia
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {selectedAsamblea?.titulo}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-0">
              {selectedAsamblea && (
                <div className="space-y-4">
                  <div className="sticky top-0 z-10 bg-white pb-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[{
                        label: 'Registrados',
                        value: attendanceStats.total,
                        sublabel: 'Personas inscritas',
                        icon: Users,
                      },
                      {
                        label: 'Asistieron',
                        value: attendanceStats.presentes,
                        sublabel: `${attendanceStats.presentes === 1 ? 'Persona' : 'Personas'} presentes`,
                        icon: CheckCircle,
                      },
                      {
                        label: 'Asistencia',
                        value: `${attendanceStats.porcentaje}%`,
                        sublabel: `${attendanceStats.ausentes} ausentes`,
                        icon: BarChart3,
                      },
                      ].map(({ label, value, sublabel, icon: Icon }) => (
                        <div
                          key={label}
                          className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 flex flex-col justify-between h-full gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{label}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-left">
                            <p className="text-xl font-semibold text-gray-900">{value}</p>
                            <p className="text-xs text-gray-500">{sublabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar asistente (nombre o casa)"
                          value={attendanceSearch}
                          onChange={(e) => setAttendanceSearch(e.target.value)}
                          className="pl-9 h-10 rounded-xl bg-gray-50 border border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lista de asistentes */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Lista de Asistentes</h3>
                    <div className="space-y-2">
                      {filteredAttendance.map((asistente) => {
                        const safeName = (asistente.nombre || '').replace(/\s+/g, '-');
                        const switchId = `asistencia-${asistente.id}-${safeName}`;
                        const itemKey = `${asistente.nombre}-${safeName}`;
                        return (
                          <div
                            key={itemKey}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                {(asistente.nombre || '')
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{asistente.nombre}</p>
                                <p className="text-xs text-gray-500">Casa {asistente.id}</p>
                              </div>
                            </div>
                            <div className="inline-flex items-center gap-3 w-[160px] justify-end">
                              <Label
                                htmlFor={switchId}
                                className={cn(
                                  "text-sm font-medium whitespace-nowrap text-right",
                                  asistente.asistio ? "text-gray-700" : "text-gray-400"
                                )}
                              >
                                {asistente.asistio ? 'Asistió' : 'Ausente'}
                              </Label>
                              <Switch
                                id={switchId}
                                checked={asistente.asistio}
                                onCheckedChange={(checked) => handleMarkAttendance(Number(selectedAsamblea.id), asistente.id, checked)}
                                aria-label={`Cambiar asistencia de ${asistente.nombre}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredAttendance.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No se encontraron asistentes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="mt-auto" />
        </SheetContent>
      </Sheet>

      {/* Sheet de detalle de asamblea */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: "600px", maxWidth: "none" }}
        >
          <SheetHeader className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 shadow-sm">
                <HugeiconsIcon icon={Book02Icon} size={22} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">Detalle de la Asamblea</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {selectedAsamblea?.titulo}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-2 pb-10 space-y-5">
              {selectedAsamblea && (
                <>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Descripción</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {displayedDescription}{' '}
                        {shouldTruncateDescription && (
                          <button
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:underline transition-colors cursor-pointer"
                            onClick={() => setShowFullDescription((prev) => !prev)}
                          >
                            {showFullDescription ? 'Mostrar menos' : 'Mostrar más'}
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white bg-white/90 p-4 shadow-inner">
                      <div className="grid gap-4 md:grid-cols-2">
                        {[{
                          icon: Calendar,
                          label: 'Fecha programada',
                          value: formatPrettyDate(selectedAsamblea.fecha),
                        },
                        {
                          icon: Clock,
                          label: 'Hora de la asamblea',
                          value: formatPrettyTime(selectedAsamblea.horaInicio),
                        }].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-600">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
                              <span className="text-sm font-semibold text-gray-900">{value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 block">Lugar de reunión</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedAsamblea.lugar}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{
                      label: 'Registrados',
                      value: attendanceStats.total,
                      sublabel: 'Personas inscritas',
                      icon: Users,
                    },
                    {
                      label: 'Asistieron',
                      value: attendanceStats.presentes,
                      sublabel: `${attendanceStats.presentes === 1 ? 'Persona' : 'Personas'} presentes`,
                      icon: CheckCircle,
                    },
                    {
                      label: 'Asistencia',
                      value: `${attendanceStats.porcentaje}%`,
                      sublabel: `${attendanceStats.ausentes} ausentes`,
                      icon: BarChart3,
                    },
                    ].map(({ label, value, sublabel, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 flex flex-col justify-between h-full gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{label}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <p className="text-xl font-semibold text-gray-900">{value}</p>
                          <p className="text-xs text-gray-500">{sublabel}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Asistentes presentes</h3>
                        <p className="text-xs text-gray-500">Solo se listan quienes marcaron asistencia</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-gray-600 border-gray-200">
                          {presentAttendees.length} {presentAttendees.length === 1 ? 'asistente' : 'asistentes'}
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 rounded-md border-gray-200 shadow-sm"
                              aria-label="Editar asistencia"
                              onClick={() => {
                                setIsDetailSheetOpen(false);
                                if (selectedAsamblea) {
                                  handleOpenAttendanceSheet(selectedAsamblea);
                                }
                              }}
                            >
                              <HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={1.8} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar asistencia</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    {presentAttendees.length > 0 ? (
                      <div className="space-y-2">
                        {presentAttendees.map((asistente) => {
                          const safeName = (asistente.nombre || '').replace(/\s+/g, '-');
                          const itemKey = `${asistente.id}-${safeName}`;
                          return (
                            <div key={itemKey} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                  {asistente.nombre
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{asistente.nombre}</p>
                                  <p className="text-xs text-gray-500">Casa {asistente.id}</p>
                                </div>
                              </div>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Asistió</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                        <Users className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                        <p>No se registraron asistentes presentes.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <SheetFooter className="mt-auto" />
        </SheetContent>
      </Sheet>

      {/* Diálogo de confirmación para eliminar asamblea */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Asamblea?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la asamblea <span className="font-semibold">{selectedAsamblea?.titulo}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAsamblea}
              className="bg-red-600 hover:bg-red-800 text-white transition-colors"
            >
              Eliminar Asamblea
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
