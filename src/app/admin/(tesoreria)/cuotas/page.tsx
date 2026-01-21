
'use client';

import * as React from 'react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { SquareMinus, SquarePlus, Search, X, Settings } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MoneyReceiveFlow01Icon,
  Home01Icon,
  FileDollarIcon,
  WalletAdd01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { CuotaCasa, Obligacion } from '@/types/cuotas.types';
import { pagoSchema, PagoFormData } from '@/lib/validations/cuotas.validation';
import { FormFieldWithTooltip } from '@/components/forms';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnimatedTabs } from '@/components/animated-tabs';
import { ConfiguracionCuotasDialog } from '@/components/configuracion-cuotas-dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCuotas } from '@/hooks/useCuotas';
import { Skeleton } from '@/components/ui/skeleton';
import { ObligacionCombobox } from '@/components/obligacion-combobox';
import { toast } from 'sonner';
import axios from 'axios';
import { enviarPazYSalvo } from '@/lib/services/cuotas.service';
import { NumericFormat } from 'react-number-format';

const ZERO_DEBT_THRESHOLD = 1; // pesos
const isCasaAlDia = (saldoPendiente: number) =>
  Math.abs(saldoPendiente) <= ZERO_DEBT_THRESHOLD;

// Función para formatear el tipo de obligación
const formatTipoObligacion = (tipo: string | undefined): string => {
  if (!tipo) return '';
  const formatMap: Record<string, string> = {
    'ADMINISTRACION': 'Cuota de Administración',
    'MULTA': 'Multa',
    'EXTRAORDINARIA': 'Cuota Extraordinaria',
    'PARQUEADERO': 'Parqueadero',
    'CUOTA_INICIAL': 'Cuota Inicial',
  };
  return formatMap[tipo.toUpperCase()] || tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

// Componente para la sub-tabla de obligaciones
function ObligacionesSubTable({
  obligaciones,
  casa,
  onObligacionClick,
  onViewDetail,
}: {
  obligaciones: Obligacion[];
  casa: CuotaCasa;
  onObligacionClick: (casa: CuotaCasa, obligacion: Obligacion) => void;
  onViewDetail: (obligacion: Obligacion, casa: CuotaCasa) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo<ColumnDef<Obligacion>[]>(
    () => [
      {
        accessorKey: 'titulo',
        header: ({ column }) => (
          <DataGridColumnHeader title="Obligación" column={column} />
        ),
        cell: (info) => {
          const row = info.row.original;
          const titulo = row.titulo || row.motivo || '';
          return (
            <div className="min-w-0 flex-1">
              <button
                onClick={() => onViewDetail(row, casa)}
                className="group font-semibold text-gray-900 hover:text-green-700 transition-all duration-200 cursor-pointer text-left truncate inline-block max-w-full"
              >
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 group-hover:after:w-full">
                  {titulo}
                </span>
              </button>
              {row.tipoObligacion && (
                <div className="text-sm text-gray-500 truncate">{formatTipoObligacion(row.tipoObligacion)}</div>
              )}
            </div>
          );
        },
        enableSorting: true,
        size: 300,
      },
      {
        accessorKey: 'valorTotal',
        header: ({ column }) => (
          <DataGridColumnHeader title="Valor Total" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as number;
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value);
        },
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: 'valorPendiente',
        header: ({ column }) => (
          <DataGridColumnHeader title="Saldo Pendiente" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as number;
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value);
        },
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: 'montoPagado',
        header: ({ column }) => (
          <DataGridColumnHeader title="Abonado" column={column} />
        ),
        cell: (info) => {
          const value = info.getValue() as number;
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value);
        },
        enableSorting: true,
        size: 150,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 items-center justify-center border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => onObligacionClick(casa, row.original)}
                >
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={MoneyReceiveFlow01Icon}
                      size={20}
                      style={{
                        width: '20px',
                        height: '20px',
                        paddingBottom: '2px',
                        color: '#4C6C5B',
                      }}
                    />
                    <span style={{ paddingTop: '1px', paddingBottom: '0px' }}>
                      Registrar
                    </span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Registrar pago
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  mode="icon"
                  className="h-8 w-8 border-gray-400"
                  onClick={() => onViewDetail(row.original, casa)}
                >
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={20}
                    strokeWidth={2}
                    className="text-gray-600"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Ver detalles
              </TooltipContent>
            </Tooltip>
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
    ],
    [casa, onObligacionClick, onViewDetail]
  );

  const table = useReactTable({
    data: obligaciones,
    columns,
    pageCount: Math.ceil(obligaciones.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row: Obligacion) => String(row.id),
  });

  return (
    <div
      className="bg-muted/30 p-4 [&_thead]:bg-gray-100 [&_thead_th]:text-gray-700 [&_thead_th]:font-medium [&_table]:rounded-lg [&_table]:overflow-hidden"
      style={{
        animation: 'slideDown 0.2s ease-out',
        transformOrigin: 'top',
      }}
    >
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div>
        <DataGrid
          table={table}
          recordCount={obligaciones.length}
          tableLayout={{
            cellBorder: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
          }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer border={false}>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination
              className="pb-1.5"
              rowsPerPageLabel="Filas por página"
              info="{from} - {to} de {count}"
              previousPageLabel="Ir a la página anterior"
              nextPageLabel="Ir a la página siguiente"
            />
          </div>
        </DataGrid>
      </div>
    </div>
  );
}

export default function CuotasPage() {
  useDocumentTitle('Cuotas y Pagos | Flor Digital');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCasa, setSelectedCasa] = useState<CuotaCasa | null>(null);
  const [selectedObligacion, setSelectedObligacion] =
    useState<Obligacion | null>(null);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<
    'todas' | 'al-dia' | 'pendientes'
  >('todas');
  const [sendingPazYSalvoCasaId, setSendingPazYSalvoCasaId] =
    useState<number | null>(null);

  // Estados para el sheet de detalle de obligación
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [detailObligacion, setDetailObligacion] = useState<Obligacion | null>(null);
  const [detailCasa, setDetailCasa] = useState<CuotaCasa | null>(null);

  // Estados para el sheet de abono en cascada
  const [isAbonoSheetOpen, setIsAbonoSheetOpen] = useState(false);
  const [abonoAmount, setAbonoAmount] = useState(0);

  const { casas, loading, error, fetchCasas, handleRegistrarPago, handleAbonoCasa } =
    useCuotas();
  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredCasas = useMemo(() => {
    if (!searchTerm && filterType === 'todas') {
      return casas;
    }

    const searchLower = searchTerm.toLowerCase();

    return casas.filter((casa) => {
      // Filtrar por tipo
      if (filterType === 'al-dia' && !isCasaAlDia(casa.saldoPendiente)) {
        return false;
      }
      if (filterType === 'pendientes' && isCasaAlDia(casa.saldoPendiente)) {
        return false;
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        return (
          casa.propietario?.nombreCompleto
            ?.toLowerCase()
            .includes(searchLower) ||
          casa.numeroCasa.toString().toLowerCase().includes(searchLower) ||
          casa.saldoPendiente.toString().includes(searchLower)
        );
      }

      return true;
    });
  }, [casas, searchTerm, filterType]);

  // Verificar si hay resultados
  const hasResults = filteredCasas.length > 0;
  // Formulario con validaciones
  const form = useForm<PagoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pagoSchema) as any,
    mode: "onChange",
    defaultValues: {
      obligacionId: '',
      tipoObligacion: '',
      monto: 0,
    },
  });



  // Función para abrir el sheet desde una obligación específica
  const handleObligacionClick = useCallback(
    (casa: CuotaCasa, obligacion: Obligacion) => {
      setSelectedCasa(casa);
      setSelectedObligacion(obligacion); // Preseleccionar la obligación
      form.reset({
        obligacionId: String(obligacion.id), // Asegurar que sea string
        tipoObligacion: obligacion.tipoObligacion!,
        monto: obligacion.valorPendiente,
      });
      setShowAllErrors(false);
      setIsSheetOpen(true);
    },
    [form]
  );

  // Función para abrir el sheet de detalle de obligación
  const handleViewObligacionDetail = useCallback(
    (obligacion: Obligacion, casa: CuotaCasa) => {
      setDetailObligacion(obligacion);
      setDetailCasa(casa);
      setIsDetailSheetOpen(true);
    },
    []
  );

  // Función para abrir el sheet de abono único (cascada)
  const handleAbonoClick = useCallback(
    (casa: CuotaCasa) => {
      setSelectedCasa(casa);
      setAbonoAmount(0);
      setIsAbonoSheetOpen(true);
    },
    []
  );

  // Función para procesar el abono en cascada
  const handleAbonoSubmit = async () => {
    if (!selectedCasa || abonoAmount <= 0) return;

    if (abonoAmount > selectedCasa.saldoPendiente) {
      toast.error('El monto supera la deuda total de la casa');
      return;
    }

    try {
      await handleAbonoCasa({
        idCasa: selectedCasa.numeroCasa,
        montoAbono: abonoAmount,
      });

      toast.success('Abono registrado exitosamente', {
        description: 'El abono ha sido distribuido correctamente en las obligaciones.',
        duration: 5000,
      });

      setIsAbonoSheetOpen(false);
      setAbonoAmount(0);
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string })?.message ||
        error.message ||
        'Error al registrar el abono.'
        : error instanceof Error
          ? error.message
          : 'Error al registrar el abono.';

      toast.error(errorMessage, {
        description: 'No se pudo completar la operación.',
        duration: 5000,
      });
    }
  };

  const handleFormSubmit = async (data: PagoFormData) => {
    // Validación adicional: verificar que el monto no supere el saldo pendiente
    const obligacion = selectedCasa?.obligacionesPendientes.find(
      (o) => String(o.id) === String(data.obligacionId)
    );

    if (obligacion && data.monto > obligacion.valorPendiente) {
      form.setError('monto', {
        type: 'manual',
        message: 'El valor ingresado supera la deuda actual.',
      });
      return;
    }

    if (!selectedCasa) {
      return;
    }

    const payload = {
      soporte: selectedCasa.numeroCasa.toString(),
      idObligacion: Number(data.obligacionId),
      tipoObligacion: data.tipoObligacion,
      montoAPagar: data.monto,
    };

    try {
      await handleRegistrarPago(payload);

      // Mostrar toast de éxito
      toast.success('Pago registrado exitosamente', {
        description: 'El pago ha sido aplicado correctamente.',
        duration: 5000,
      });

      setIsSheetOpen(false);
      form.reset();
      setSelectedObligacion(null);
    } catch (error: unknown) {
      // Extraer mensaje de error usando axios.isAxiosError
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string })?.message ||
        error.message ||
        'Error al registrar el pago. Por favor, inténtalo de nuevo.'
        : error instanceof Error
          ? error.message
          : 'Error al registrar el pago. Por favor, inténtalo de nuevo.';

      // Mostrar toast de error
      toast.error(errorMessage, {
        description: 'No se pudo completar la operación.',
        duration: 5000,
      });
    }
  };

  // Función para cancelar
  const handleCancelar = () => {
    setIsSheetOpen(false);
    setIsAbonoSheetOpen(false);
    setSelectedCasa(null);
    setSelectedObligacion(null);
    form.reset();
    setAbonoAmount(0);
    console.log("Acción de pago cancelada.");
    setShowAllErrors(false);
  };

  useEffect(() => {
    fetchCasas();
  }, [fetchCasas]);

  // Limpiar filas expandidas cuando sus casas ya no tienen obligaciones pendientes
  // Esto soluciona el bug donde el menú desplegado se queda mostrando "no data" 
  // después de pagar la última obligación de una casa
  useEffect(() => {
    if (Object.keys(expandedRows).length === 0) return;

    const newExpandedRows: ExpandedState = {};
    let hasChanges = false;

    for (const [rowId, isExpanded] of Object.entries(expandedRows)) {
      if (isExpanded) {
        // Buscar la casa correspondiente
        const casa = casas.find(c => c.numeroCasa.toString() === rowId);
        // Mantener expandida solo si tiene obligaciones pendientes
        if (casa && casa.obligacionesPendientes && casa.obligacionesPendientes.length > 0) {
          newExpandedRows[rowId] = true;
        } else {
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      setExpandedRows(newExpandedRows);
    }
  }, [casas, expandedRows]);

  // Mostrar toast de error cuando haya un error de carga
  useEffect(() => {
    if (error) {
      toast.error(error, {
        description: 'No se pudieron cargar los datos.',
        duration: 5000,
      });
    }
  }, [error]);

  // Cálculo de la distribución del abono para la vista previa
  const abonoDistribution = useMemo(() => {
    if (!selectedCasa || abonoAmount <= 0) return [];

    // Ordenar obligaciones por ID (de la más vieja a la más nueva)
    const sortedObligaciones = [...selectedCasa.obligacionesPendientes].sort((a, b) => a.id - b.id);

    let remainingAmount = abonoAmount;
    return sortedObligaciones.map(ob => {
      const applyToThis = Math.min(remainingAmount, ob.valorPendiente);
      const newSaldo = ob.valorPendiente - applyToThis;
      remainingAmount -= applyToThis;

      return {
        ...ob,
        abonoAplicado: applyToThis,
        nuevoSaldo: newSaldo,
        isFullyPaid: newSaldo === 0
      };
    }).filter(distribution => distribution.abonoAplicado > 0);
  }, [selectedCasa, abonoAmount]);

  const columns = useMemo<ColumnDef<CuotaCasa>[]>(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              onClick={row.getToggleExpandedHandler()}
              mode="icon"
              size="sm"
              variant="ghost"
            >
              {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
            </Button>
          ) : null;
        },
        size: 25,
        enableResizing: false,
        meta: {
          expandedContent: (row: CuotaCasa) => (
            <ObligacionesSubTable
              obligaciones={row.obligacionesPendientes}
              casa={row}
              onObligacionClick={handleObligacionClick}
              onViewDetail={handleViewObligacionDetail}
            />
          ),
          skeleton: <Skeleton className="h-6 w-6" />,
        },
      },
      {
        accessorKey: 'numeroCasa',
        id: 'numeroCasa',
        header: ({ column }) => (
          <DataGridColumnHeader title="Número de Casa" column={column} />
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-gray-900">
              Casa No. {row.original.numeroCasa}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.propietario?.nombreCompleto ?? "Sin propietario"}
            </div>
          </div>
        ),
        size: 250,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: (
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ),
        },
      },
      {
        accessorKey: 'saldoPendiente',
        id: 'saldoPendiente',
        header: ({ column }) => (
          <DataGridColumnHeader title="Saldo Pendiente" column={column} />
        ),
        cell: ({ row }) => {
          const saldo = row.original.saldoPendiente;
          return (
            <div
              className={`font-semibold ${saldo > 0 ? 'text-red-600' : 'text-green-600'
                }`}
            >
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(saldo)}
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-5 w-24" />,
        },
      },
      {
        accessorKey: 'obligacionesPendientes',
        id: 'obligacionesPendientes',
        header: ({ column }) => (
          <DataGridColumnHeader title="Pagos Pendientes" column={column} />
        ),
        cell: ({ row }) => {
          const cantidad = row.original.obligacionesPendientes.length;
          return (
            <Badge
              variant={
                cantidad === 0
                  ? 'success'
                  : cantidad <= 2
                    ? 'warning'
                    : 'destructive'
              }
              appearance="outline"
              size="md"
            >
              {cantidad} {cantidad === 1 ? 'pago' : 'pagos'}
            </Badge>
          );
        },
        size: 140,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-16 rounded-full" />,
        },
      },
      {
        accessorKey: 'ultimoPago',
        id: 'ultimoPago',
        header: ({ column }) => (
          <DataGridColumnHeader title="Último Pago" column={column} />
        ),
        cell: ({ row }) => {
          const fechaStr = row.original.ultimoPago;
          const fecha = fechaStr ? new Date(fechaStr) : null;
          return (
            <div className="text-sm text-gray-600">
              {fecha && !isNaN(fecha.getTime())
                ? fecha.toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                : 'Sin pagos'}
            </div>
          );
        },
        size: 130,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="primary"
                    className="gap-2 items-center justify-center"
                    onClick={() => handleAbonoClick(row.original)}
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={MoneyReceiveFlow01Icon}
                        size={20}
                        style={{
                          width: '20px',
                          height: '20px',
                          paddingBottom: '2px',
                        }}
                      />
                      <span style={{ paddingTop: '2px', paddingBottom: '0px' }}>
                        Abonar
                      </span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Registrar pago
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  {(() => {
                    const canSendPazYSalvo = isCasaAlDia(
                      row.original.saldoPendiente
                    );
                    const isSendingPazYSalvo =
                      sendingPazYSalvoCasaId === row.original.numeroCasa;
                    const isPazYSalvoDisabled =
                      !canSendPazYSalvo || isSendingPazYSalvo;

                    return (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`gap-2 items-center justify-center ml-2 ${!canSendPazYSalvo ? 'opacity-50' : ''
                          } ${isSendingPazYSalvo ? 'cursor-wait' : ''}`}
                        disabled={isPazYSalvoDisabled}
                        aria-busy={isSendingPazYSalvo}
                        onClick={async () => {
                          if (isPazYSalvoDisabled) return;
                          setSendingPazYSalvoCasaId(row.original.numeroCasa);

                          const sendPromise = async () => {
                            const startTime = Date.now();
                            const minDuration = 2500; // 2.5 segundos mínimo

                            try {
                              const response = await enviarPazYSalvo(row.original.numeroCasa);

                              // Esperar el tiempo restante si la operación fue muy rápida
                              const elapsed = Date.now() - startTime;
                              if (elapsed < minDuration) {
                                await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
                              }

                              return response?.message || 'Paz y salvo enviado exitosamente';
                            } catch (err) {
                              // Esperar el tiempo restante incluso en error
                              const elapsed = Date.now() - startTime;
                              if (elapsed < minDuration) {
                                await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
                              }

                              const errorMessage = axios.isAxiosError(err)
                                ? (err.response?.data as { message?: string })?.message || err.message || 'Error al enviar el paz y salvo'
                                : err instanceof Error
                                  ? err.message
                                  : 'Error al enviar el paz y salvo';
                              throw new Error(errorMessage);
                            } finally {
                              setSendingPazYSalvoCasaId(null);
                            }
                          };

                          toast.promise(sendPromise(), {
                            loading: 'Enviando paz y salvo...',
                            success: 'Paz y salvo enviado exitosamente',
                            error: (err) => err.message || 'Error al enviar el paz y salvo',
                          });
                        }}
                      >
                        <HugeiconsIcon
                          icon={FileDollarIcon}
                          size={20}
                          style={{
                            width: '20px',
                            height: '20px',
                            paddingBottom: '2px',
                          }}
                        />
                      </Button>
                    );
                  })()}
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isCasaAlDia(row.original.saldoPendiente)
                    ? 'Enviar Paz y salvo'
                    : 'No se puede enviar el paz y salvo porque la casa aún tiene deudas'}
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        ),
        size: 120,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-9 w-24" />,
        },
      },
    ],
    [handleAbonoClick, handleObligacionClick, handleViewObligacionDetail, sendingPazYSalvoCasaId]
  );

  const table = useReactTable({
    columns,
    data: filteredCasas,
    pageCount: Math.ceil((filteredCasas?.length || 0) / pagination.pageSize),
    getRowId: (row: CuotaCasa) => row.numeroCasa.toString(),
    getRowCanExpand: (row) =>
      Boolean(
        row.original.obligacionesPendientes &&
        row.original.obligacionesPendientes.length > 0
      ),
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
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
                <BreadcrumbPage>Cuotas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        {/* Contenido con padding */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Cuotas
              </h1>
              <p className="text-gray-500 mt-1">
                Administra los pagos de administración y otras obligaciones
                financieras.
              </p>
            </div>
          </div>

          {/* Filtros y controles */}
          <AnimatedTabs
            value={filterType}
            onValueChange={(value) =>
              setFilterType(value as 'todas' | 'al-dia' | 'pendientes')
            }
            tabs={[
              {
                value: 'todas',
                label: 'Todas',
                content:
                  !loading && !hasResults ? (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <HugeiconsIcon
                            icon={MoneyReceiveFlow01Icon}
                            size={24}
                            className="text-gray-400"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-base font-semibold text-gray-700">
                            {searchTerm
                              ? 'No se encontraron resultados'
                              : 'No hay cuotas registradas'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchTerm
                              ? `No hay casas que coincidan con "${searchTerm}"`
                              : 'No hay registros de cuotas disponibles en este momento'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DataGrid
                      table={table}
                      recordCount={loading ? 10 : filteredCasas?.length || 0}
                      isLoading={loading}
                      loadingMode="skeleton"
                      tableLayout={{
                        headerBackground: false,
                        rowBorder: true,
                        rowRounded: false,
                      }}
                    >
                      <div className="w-full space-y-2.5">
                        <DataGridContainer border={false}>
                          <ScrollArea>
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </DataGridContainer>
                        <DataGridPagination
                          rowsPerPageLabel="Filas por página"
                          info="{from} - {to} de {count}"
                          previousPageLabel="Ir a la página anterior"
                          nextPageLabel="Ir a la página siguiente"
                        />
                      </div>
                    </DataGrid>
                  ),
              },
              {
                value: 'al-dia',
                label: 'Al Día',
                content:
                  !loading && !hasResults ? (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <HugeiconsIcon
                            icon={MoneyReceiveFlow01Icon}
                            size={24}
                            className="text-gray-400"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-base font-semibold text-gray-700">
                            {searchTerm
                              ? 'No se encontraron resultados'
                              : 'No hay casas al día'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchTerm
                              ? `No hay casas al día que coincidan con "${searchTerm}"`
                              : 'No hay casas con todas sus cuotas al día registradas'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DataGrid
                      table={table}
                      recordCount={loading ? 10 : filteredCasas?.length || 0}
                      isLoading={loading}
                      loadingMode="skeleton"
                      tableLayout={{
                        headerBackground: false,
                        rowBorder: true,
                        rowRounded: false,
                      }}
                    >
                      <div className="w-full space-y-2.5">
                        <DataGridContainer border={false}>
                          <ScrollArea>
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </DataGridContainer>
                        <DataGridPagination
                          rowsPerPageLabel="Filas por página"
                          info="{from} - {to} de {count}"
                          previousPageLabel="Ir a la página anterior"
                          nextPageLabel="Ir a la página siguiente"
                        />
                      </div>
                    </DataGrid>
                  ),
              },
              {
                value: 'pendientes',
                label: 'Pendientes',
                content:
                  !loading && !hasResults ? (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <HugeiconsIcon
                            icon={MoneyReceiveFlow01Icon}
                            size={24}
                            className="text-gray-400"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-base font-semibold text-gray-700">
                            {searchTerm
                              ? 'No se encontraron resultados'
                              : 'No hay pagos pendientes'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchTerm
                              ? `No hay casas con pagos pendientes que coincidan con "${searchTerm}"`
                              : 'No hay casas con pagos pendientes registradas'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DataGrid
                      table={table}
                      recordCount={loading ? 10 : filteredCasas?.length || 0}
                      isLoading={loading}
                      loadingMode="skeleton"
                      tableLayout={{
                        headerBackground: false,
                        rowBorder: true,
                        rowRounded: false,
                      }}
                    >
                      <div className="w-full space-y-2.5">
                        <DataGridContainer border={false}>
                          <ScrollArea>
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </DataGridContainer>
                        <DataGridPagination
                          rowsPerPageLabel="Filas por página"
                          info="{from} - {to} de {count}"
                          previousPageLabel="Ir a la página anterior"
                          nextPageLabel="Ir a la página siguiente"
                        />
                      </div>
                    </DataGrid>
                  ),
              },
            ]}
            rightContent={
              <>
                <div className="relative w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar casas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
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
                <TooltipProvider>
                  <Tooltip>
                    <ConfiguracionCuotasDialog>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                    </ConfiguracionCuotasDialog>
                    <TooltipContent
                      side="top"
                      align="end"
                      alignOffset={-20}
                      sideOffset={5}
                    >
                      <p>Configurar valores constantes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            }
          />
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '520px', maxWidth: 'none' }}
        >
          <TooltipProvider>
            {/* Header con icono */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-50">
                  <HugeiconsIcon icon={WalletAdd01Icon} size={24} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                    Registrar Pago
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500">
                    Registra un nuevo pago para la casa seleccionada.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <form
              id="pago-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(handleFormSubmit, () => {
                  setShowAllErrors(true);
                })(e);
              }}
              className="flex flex-col h-full"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 px-4">
                  {/* Información de la casa */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700 block">
                      Casa seleccionada
                    </span>
                    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <HugeiconsIcon
                              icon={Home01Icon}
                              className="w-6 h-6 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              Casa No. {selectedCasa?.numeroCasa}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {selectedCasa?.propietario?.nombreCompleto ??
                                "Sin Propietario"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selector de obligación */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="obligacion"
                      className="text-sm font-medium text-gray-700"
                    >
                      Obligación a pagar
                    </Label>
                    <Controller
                      name="obligacionId"
                      control={form.control}
                      render={({ field }) => (
                        <ObligacionCombobox
                          obligaciones={
                            selectedCasa?.obligacionesPendientes || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                          onObligacionSelect={(obligacion) => {
                            setSelectedObligacion(obligacion);
                            form.setValue('monto', obligacion.valorPendiente);
                            form.setValue("tipoObligacion", obligacion.tipoObligacion!);

                          }}
                        />
                      )}
                    />
                  </div>

                  <input type="hidden" {...form.register("tipoObligacion")} />

                  {/* Monto a pagar */}
                  <Controller
                    name="monto"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor="monto"
                          className="text-sm font-medium text-gray-700"
                        >
                          Monto a pagar
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <FormFieldWithTooltip
                          label=""
                          invalid={fieldState.invalid}
                          error={
                            showAllErrors
                              ? fieldState.error?.message
                              : undefined
                          }
                          className="-mt-3"
                        >
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              $
                            </span>
                            <NumericFormat
                              id="monto"
                              name="monto"
                              placeholder="0"
                              value={field.value ?? ''}
                              onValueChange={(values) => {
                                const { floatValue } = values;
                                field.onChange(floatValue ?? 0);
                              }}
                              thousandSeparator="."
                              decimalSeparator=","
                              decimalScale={0}
                              allowNegative={false}
                              className={`flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 ${fieldState.invalid
                                ? 'border-red-500 focus:border-red-500'
                                : ''
                                }`}
                            />
                          </div>
                        </FormFieldWithTooltip>
                      </div>
                    )}
                  />

                  {selectedObligacion && (
                    <div className="text-sm text-gray-500">
                      Saldo pendiente:{' '}
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(selectedObligacion.valorPendiente)}
                    </div>
                  )}
                </div>
              </div>
            </form>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleCancelar}
                  className="flex-1 h-10 font-medium"
                  type="button"
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                form='pago-form'
                type="submit"
                onClick={() => {
                  setShowAllErrors(true);
                }}
                className="flex-1 h-10 font-medium"
              >
                Registrar Pago
              </Button>
            </SheetFooter>
          </TooltipProvider>
        </SheetContent>
      </Sheet>

      {/* Sheet de Abono Único (Cascada) */}
      <Sheet open={isAbonoSheetOpen} onOpenChange={setIsAbonoSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '550px', maxWidth: 'none' }}
        >
          <TooltipProvider>
            {/* Header con icono mejorado */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-50">
                  <HugeiconsIcon icon={MoneyReceiveFlow01Icon} size={24} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-base font-semibold text-gray-900 mb-0.5">
                    Abono en Cascada
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500">
                    Se aplica automáticamente a la deuda más antigua.
                  </SheetDescription>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-6 py-6">
                {/* Información de la casa - Diseño estandarizado */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 block text-left">
                    Casa seleccionada
                  </span>
                  <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>

                    {/* Content */}
                    <div className="relative z-10 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                          <HugeiconsIcon
                            icon={Home01Icon}
                            className="w-6 h-6 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            Casa No. {selectedCasa?.numeroCasa}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {selectedCasa?.propietario?.nombreCompleto ?? "Sin Propietario"}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Saldo Pendiente</span>
                          <span className="text-lg font-bold text-red-600">
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              maximumFractionDigits: 0
                            }).format(selectedCasa?.saldoPendiente || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monto a abonar */}
                <div className="space-y-3">
                  <Label
                    htmlFor="abono-monto"
                    className="text-sm font-medium text-gray-700 block text-left"
                  >
                    Monto a abonar
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl font-medium focus-within:text-primary transition-colors">
                      $
                    </span>
                    <NumericFormat
                      id="abono-monto"
                      placeholder="0"
                      value={abonoAmount || ''}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        setAbonoAmount(floatValue ?? 0);
                      }}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={0}
                      allowNegative={false}
                      className={`flex h-14 w-full rounded-xl border bg-white px-4 py-2 text-2xl font-bold shadow-xs transition-all placeholder:text-gray-200 focus-visible:outline-none focus-visible:ring-2 pl-10 ${selectedCasa && abonoAmount > selectedCasa.saldoPendiente
                        ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100'
                        : 'border-gray-200 focus-visible:border-primary focus-visible:ring-primary/10'
                        }`}
                    />
                  </div>
                  {selectedCasa && abonoAmount > selectedCasa.saldoPendiente && (
                    <p className="text-sm font-medium text-red-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                      <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                      El monto supera la deuda total de la casa.
                    </p>
                  )}
                  {selectedCasa && selectedCasa.saldoPendiente > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-green-700 h-auto p-0 font-semibold"
                        onClick={() => setAbonoAmount(selectedCasa.saldoPendiente)}
                      >
                        Abonar saldo total
                      </Button>
                    </div>
                  )}
                </div>

                {/* Vista previa de distribución */}
                {abonoDistribution.length > 0 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <span className="text-sm font-medium text-gray-700 block text-left">
                      Aplicación del pago
                    </span>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium h-10">
                            <tr>
                              <th className="pl-4 font-semibold">Obligación</th>
                              <th className="font-semibold text-right">Abono</th>
                              <th className="pr-4 font-semibold text-right">Nuevo Saldo</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {abonoDistribution.map((item) => (
                              <tr key={item.id} className="h-12 hover:bg-gray-50/30 transition-colors">
                                <td className="pl-4">
                                  <div className="flex flex-col">
                                    <span className={`font-medium ${item.isFullyPaid ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                      {item.titulo || item.motivo}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase">{formatTipoObligacion(item.tipoObligacion)}</span>
                                  </div>
                                </td>
                                <td className="text-right font-bold text-primary">
                                  +{new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    maximumFractionDigits: 0
                                  }).format(item.abonoAplicado)}
                                </td>
                                <td className="pr-4 text-right">
                                  {item.isFullyPaid ? (
                                    <Badge variant="outline" className="bg-gray-100 border-gray-300 text-green-800 px-3 py-1 rounded-md text-xs font-bold">
                                      Pagado
                                    </Badge>
                                  ) : (
                                    <span className="font-medium text-gray-600">
                                      {new Intl.NumberFormat('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                        maximumFractionDigits: 0
                                      }).format(item.nuevoSaldo)}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleCancelar}
                  className="flex-1 h-10 font-medium"
                  type="button"
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={handleAbonoSubmit}
                disabled={abonoAmount <= 0 || (selectedCasa !== null && abonoAmount > selectedCasa.saldoPendiente)}
                className="flex-1 h-10 font-medium"
              >
                Confirmar Abono
              </Button>
            </SheetFooter>
          </TooltipProvider>
        </SheetContent>
      </Sheet>

      {/* Sheet de detalle de obligación */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '480px', maxWidth: 'none' }}
        >
          {detailObligacion && detailCasa && (
            <>
              {/* Header con icono */}
              <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <HugeiconsIcon
                      icon={FileDollarIcon}
                      size={24}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                      Detalles de Obligación
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                      Información completa de la obligación pendiente
                    </SheetDescription>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-6 space-y-6">
                  {/* Título y descripción */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</div>
                    <h3 className="text-lg font-bold text-gray-900">{detailObligacion.titulo || detailObligacion.motivo}</h3>
                    {detailObligacion.tipoObligacion && (
                      <Badge variant="outline" size="sm">{formatTipoObligacion(detailObligacion.tipoObligacion)}</Badge>
                    )}
                  </div>

                  {/* Detalles en grid */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* ID Obligación */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">ID Obligación</div>
                        <div className="text-sm font-medium text-gray-900">#{detailObligacion.id}</div>
                      </div>

                      {/* Estado */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Estado</div>
                        <Badge
                          variant={detailObligacion.valorPendiente === 0 ? 'success' : detailObligacion.montoPagado > 0 ? 'warning' : 'destructive'}
                          appearance="outline"
                          size="sm"
                        >
                          {detailObligacion.valorPendiente === 0 ? 'PAGADO' : detailObligacion.montoPagado > 0 ? 'ABONADO' : 'PENDIENTE'}
                        </Badge>
                      </div>

                      {/* Valor Original (monto base) */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Valor Original</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.monto ?? 0)}
                        </div>
                      </div>

                      {/* Valor Total (con intereses y mora) */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Valor Total</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.valorTotal)}
                        </div>
                      </div>

                      {/* Monto Pagado */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Monto Abonado</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.montoPagado)}
                        </div>
                      </div>
                    </div>

                    {/* Intereses y Mora - en tarjetas */}
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                      {/* Tarjeta Intereses */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="text-xs text-gray-500 font-medium mb-1">Intereses</div>
                        <div className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.interes ?? 0)}
                        </div>
                      </div>

                      {/* Tarjeta Mora */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="text-xs text-gray-500 font-medium mb-1">Mora</div>
                        <div className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.mora ?? 0)}
                        </div>
                      </div>
                    </div>

                    {/* Saldo Pendiente - destacado */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="text-xs text-gray-500 font-medium mb-1">Saldo Pendiente</div>
                        <div className="text-xl font-bold text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(detailObligacion.valorPendiente)}
                        </div>
                      </div>
                    </div>

                    {/* Propietario / Casa */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Propietario</div>
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Home01Icon} size={16} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {detailCasa.propietario?.nombreCompleto || 'Sin propietario'}
                            </div>
                            <div className="text-xs text-gray-500">Casa No. {detailCasa.numeroCasa}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con acciones */}
              <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                <Button
                  onClick={() => setIsDetailSheetOpen(false)}
                  className="flex-1 h-10 font-medium"
                  variant="outline"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailSheetOpen(false);
                    handleObligacionClick(detailCasa, detailObligacion);
                  }}
                  className="flex-1 h-10 font-medium"
                >
                  <HugeiconsIcon icon={MoneyReceiveFlow01Icon} size={18} className="mr-2" />
                  Registrar Pago
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
