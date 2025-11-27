"use client";

import { useMemo, useState, useRef } from "react";
import {
  Search,
  X,
  Plus,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  PawPrint,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, ButtonArrow } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon } from "@hugeicons/core-free-icons";
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { AgregarMiembroSheet } from "./AgregarMiembroSheet";
import { AgregarMascotaSheet } from "./AgregarMascotaSheet";
import { useMiembros } from "@/hooks/useMiembro";
import { MiembroHogar, UpdateMiembroHogar } from "@/types/casa.types";
import { miembrosService } from "@/lib/services/casa.service";
import { toast } from "sonner";

// Función para determinar el género según el tipo de miembro (parentesco)
const getGenderFromTipoMiembro = (
  tipoMiembro: string
): "masculino" | "femenino" | "neutro" => {
  const tipo = tipoMiembro.toUpperCase();

  // Tipos femeninos
  if (
    tipo.includes("HIJA") ||
    tipo.includes("ESPOSA") ||
    tipo.includes("MADRE") ||
    tipo.includes("HERMANA") ||
    tipo.includes("ABUELA") ||
    tipo.includes("TIA") ||
    tipo.includes("SOBRINA") ||
    tipo.includes("NIETA")
  ) {
    return "femenino";
  }

  // Tipos masculinos
  if (
    tipo.includes("HIJO") ||
    tipo.includes("ESPOSO") ||
    tipo.includes("PADRE") ||
    tipo.includes("HERMANO") ||
    tipo.includes("ABUELO") ||
    tipo.includes("TIO") ||
    tipo.includes("SOBRINO") ||
    tipo.includes("NIETO")
  ) {
    return "masculino";
  }

  return "neutro";
};

const formatTipoDocumento = (tipo: string) => {
  if (!tipo) return "";
  return tipo
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export function MiembrosTab() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const casaNumero = user.idCasa;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<
    "todos" | "Activo" | "Inactivo"
  >("todos");
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isAgregarMiembroSheetOpen, setIsAgregarMiembroSheetOpen] =
    useState(false);
  const [isAgregarMascotaSheetOpen, setIsAgregarMascotaSheetOpen] =
    useState(false);
  const [miembroParaEditar, setMiembroParaEditar] =
    useState<UpdateMiembroHogar | null>(null);
  const [agregarMenuOpen, setAgregarMenuOpen] = useState(false);
  const { miembros, refetch } = useMiembros(casaNumero);

  // Filtrar miembros
  const miembrosFiltrados = useMemo(() => {
    let filtrados = miembros;

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      filtrados = filtrados.filter((m) => m.estado === estadoFilter);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtrados = filtrados.filter(
        (m) =>
          m.nombre.toLowerCase().includes(searchLower) ||
          m.telefono?.toLowerCase().includes(searchLower) ||
          m.numeroDocumento?.toLowerCase().includes(searchLower)
      );
    }

    return filtrados;
  }, [searchTerm, estadoFilter, miembros]);

  const handleClearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  // Columnas para tabla de miembros
  const columns: ColumnDef<MiembroHogar>[] = useMemo(
    () => [
      {
        accessorKey: "nombre",
        id: "miembro",
        header: ({ column }) => (
          <div className="pl-[52px]">
            <DataGridColumnHeader title="Miembro" column={column} />
          </div>
        ),
        cell: ({ row }) => {
          const genero = getGenderFromTipoMiembro(row.original.parentesco);
          const colorConfig =
            genero === "femenino"
              ? { bg: "bg-pink-100", text: "text-pink-600" }
              : genero === "masculino"
              ? { bg: "bg-blue-100", text: "text-blue-600" }
              : { bg: "bg-gray-100", text: "text-gray-600" };

          return (
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${colorConfig.bg} rounded-full flex items-center justify-center`}
              >
                <HugeiconsIcon
                  icon={User03Icon}
                  size={20}
                  className={colorConfig.text}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900">
                  {row.original.nombre}
                </div>
                <div className="text-sm text-gray-500">
                  {row.original.parentesco}
                </div>
              </div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "telefono",
        id: "telefono",
        header: ({ column }) => (
          <DataGridColumnHeader title="Teléfono" column={column} />
        ),
        cell: ({ row }) => (
          <div
            className={
              row.original.telefono
                ? "text-gray-900"
                : "text-gray-500 opacity-50"
            }
          >
            {row.original.telefono || "No disponible"}
          </div>
        ),
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: "documento",
        id: "documento",
        header: ({ column }) => (
          <DataGridColumnHeader title="Documento" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-gray-900">
            {row.original.tipoDocumento && row.original.numeroDocumento ? (
              `${formatTipoDocumento(row.original.tipoDocumento)} - ${row.original.numeroDocumento}`
            ) : row.original.numeroDocumento ? (
              row.original.numeroDocumento
            ) : (
              <span className="text-gray-500 opacity-50">No disponible</span>
            )}
          </div>
        ),
        enableSorting: true,
        size: 200,
      },
      {
        accessorKey: "estado",
        id: "estado",
        header: ({ column }) => (
          <DataGridColumnHeader title="Estado" column={column} />
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.estado === "Activo" ? "success" : "secondary"}
            className={
              row.original.estado === "Activo"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }
          >
            {row.original.estado}
          </Badge>
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="acciones"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className={
                        row.original.estado === "Activo"
                          ? "text-red-600 focus:text-red-600 focus:bg-red-50"
                          : "text-green-700 focus:text-green-700 focus:bg-green-50"
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {row.original.estado === "Activo" ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {row.original.estado === "Activo"
                        ? "Deshabilitar"
                        : "Habilitar"}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {row.original.estado === "Activo"
                          ? `¿Deshabilitar miembro "${row.original.nombre}"?`
                          : `¿Habilitar miembro "${row.original.nombre}"?`}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {row.original.estado === "Activo"
                          ? `El miembro "${row.original.nombre}" quedará inactivo.`
                          : `El miembro "${row.original.nombre}" quedará activo.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            await miembrosService.editMemberStastus(
                              Number(row.original.id)
                            );
                            if (refetch) await refetch();
                            toast.success(`Estado actualizado correctamente`);
                          } catch (error) {
                            console.error("Error al actualizar estado:", error);
                            toast.error("No se pudo actualizar el estado");
                          }
                        }}
                        className={
                          row.original.estado === "Activo"
                            ? "bg-red-600 hover:bg-red-700"
                            : "text-white hover:opacity-90"
                        }
                        style={
                          row.original.estado === "Activo"
                            ? undefined
                            : { backgroundColor: "#4C6C5B" }
                        }
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <DropdownMenuItem
                  onClick={() => {
                    setMiembroParaEditar({
                      ...row.original,
                      numeroDocumento: Number(
                        row.original.numeroDocumento ?? 0
                      ),
                      telefono: Number(row.original.telefono ?? 0),
                      id: Number(row.original.id),
                    });
                    setIsAgregarMiembroSheetOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modificar
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Eliminar miembro &quot;{row.original.nombre}&quot;?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El miembro será
                        eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          // Aquí iría la lógica para eliminar
                          console.log("Eliminar miembro", row.original.nombre);
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 50,
        enableSorting: false,
      },
    ],
    [refetch]
  );

  const table = useReactTable({
    data: miembrosFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  const hasMiembros = miembrosFiltrados.length > 0;

  return (
    <>
      <div className="pb-6 space-y-4">
        {/* Controles: Searchbar, filtro por estado y botón agregar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Buscar miembros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                ref={searchInputRef}
              />
              {searchTerm !== "" && (
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
            <Popover
              open={estadoComboboxOpen}
              onOpenChange={setEstadoComboboxOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  mode="input"
                  placeholder={estadoFilter === "todos"}
                  className="w-[180px] h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {estadoFilter !== "todos" ? (
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "ms-1 size-1.5 rounded-full",
                          estadoFilter === "Activo"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        )}
                      ></span>
                      <span className="truncate">
                        {estadoFilter === "Activo" ? "Activos" : "Inactivos"}
                      </span>
                    </span>
                  ) : (
                    <span>Filtrar por estado</span>
                  )}
                  <ButtonArrow />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar estado..." />
                  <CommandList>
                    <CommandEmpty>No se encontró estado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="todos"
                        onSelect={() => {
                          setEstadoFilter("todos");
                          setEstadoComboboxOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="ms-1 size-1.5 rounded-full bg-gray-400"></span>
                          <span className="truncate">Todos</span>
                        </span>
                        {estadoFilter === "todos" && <CommandCheck />}
                      </CommandItem>
                      <CommandItem
                        value="Activo"
                        onSelect={() => {
                          setEstadoFilter("Activo");
                          setEstadoComboboxOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="ms-1 size-1.5 rounded-full bg-green-500"></span>
                          <span className="truncate">Activos</span>
                        </span>
                        {estadoFilter === "Activo" && <CommandCheck />}
                      </CommandItem>
                      <CommandItem
                        value="Inactivo"
                        onSelect={() => {
                          setEstadoFilter("Inactivo");
                          setEstadoComboboxOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="ms-1 size-1.5 rounded-full bg-gray-500"></span>
                          <span className="truncate">Inactivos</span>
                        </span>
                        {estadoFilter === "Inactivo" && <CommandCheck />}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Popover open={agregarMenuOpen} onOpenChange={setAgregarMenuOpen}>
            <PopoverTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
              <div className="flex gap-3">
                {/* Botón Miembro */}
                <button
                  onClick={() => {
                    setMiembroParaEditar(null);
                    setIsAgregarMiembroSheetOpen(true);
                    setAgregarMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors min-w-[100px]"
                >
                  <HugeiconsIcon
                    icon={User03Icon}
                    className="w-7 h-7 text-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Miembro
                  </span>
                </button>

                {/* Botón Mascota */}
                <button
                  onClick={() => {
                    setIsAgregarMascotaSheetOpen(true);
                    setAgregarMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-colors min-w-[100px]"
                >
                  <PawPrint className="w-7 h-7 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">
                    Mascota
                  </span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tabla de miembros */}
        {hasMiembros ? (
          <DataGrid
            table={table}
            recordCount={miembrosFiltrados.length}
            isLoading={false}
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
                sizes={[5, 10, 25, 50]}
              />
            </div>
          </DataGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm
                ? "No se encontraron resultados"
                : "No hay miembros registrados"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? `No hay miembros que coincidan con "${searchTerm}"`
                : "No se han registrado miembros para esta vivienda."}
            </p>
          </div>
        )}
      </div>

      <AgregarMiembroSheet
        open={isAgregarMiembroSheetOpen}
        onOpenChange={(open) => {
          setIsAgregarMiembroSheetOpen(open);
          if (!open) {
            setMiembroParaEditar(null);
          }
        }}
        miembroParaEditar={miembroParaEditar}
        idCasa={casaNumero}
      />
      <AgregarMascotaSheet
        open={isAgregarMascotaSheetOpen}
        onOpenChange={setIsAgregarMascotaSheetOpen}
      />
    </>
  );
}
