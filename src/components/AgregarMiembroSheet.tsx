"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FormInput } from "@/components/forms/FormInput";
import { Button, ButtonArrow } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { CreateMiembroHogar, UpdateMiembroHogar } from "@/types/casa.types";
import { miembrosService } from "@/lib/services/casa.service";
import { toast } from "sonner";

interface AgregarMiembroSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  miembroParaEditar?: UpdateMiembroHogar | null;
  idCasa: number;
  onSave?: () => void | Promise<void>;
}

const parentescos = [
  { value: "Esposa", label: "Esposa" },
  { value: "Esposo", label: "Esposo" },
  { value: "Hijo", label: "Hijo" },
  { value: "Hija", label: "Hija" },
  { value: "Padre", label: "Padre" },
  { value: "Madre", label: "Madre" },
  { value: "Hermano", label: "Hermano" },
  { value: "Hermana", label: "Hermana" },
  { value: "Abuelo", label: "Abuelo" },
  { value: "Abuela", label: "Abuela" },
  { value: "Tio", label: "Tío" },
  { value: "Tia", label: "Tía" },
  { value: "Sobrino", label: "Sobrino" },
  { value: "Sobrina", label: "Sobrina" },
  { value: "Nieto", label: "Nieto" },
  { value: "Nieta", label: "Nieta" },
];

export function AgregarMiembroSheet({
  open,
  onOpenChange,
  miembroParaEditar,
  idCasa,
  onSave,
}: AgregarMiembroSheetProps) {
  const [formNombre, setFormNombre] = useState("");
  const [formParentesco, setFormParentesco] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formTipoDocumento, setFormTipoDocumento] = useState("");
  const [formDocumento, setFormDocumento] = useState("");
  const [parentescoComboboxOpen, setParentescoComboboxOpen] = useState(false);
  const [parentescoSearchTerm, setParentescoSearchTerm] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  // Cargar datos del miembro cuando se abre en modo edición
  useEffect(() => {
    if (open && miembroParaEditar) {
      setFormNombre(miembroParaEditar.nombre);
      setFormParentesco(miembroParaEditar.parentesco);
      setFormTelefono(miembroParaEditar.telefono?.toString() || "");
      setFormTipoDocumento(miembroParaEditar.tipoDocumento);
      setFormDocumento(miembroParaEditar.numeroDocumento.toString() || "");
    } else if (open && !miembroParaEditar) {
      // Limpiar formulario cuando se abre en modo agregar
      setFormNombre("");
      setFormParentesco("");
      setFormTelefono("");
      setFormTipoDocumento("");
      setFormDocumento("");
      setParentescoSearchTerm("");
      setErrors({});
      setShowFormErrors(false);
    }
  }, [open, miembroParaEditar]);

  const [errors, setErrors] = useState<{
    nombre?: string;
    parentesco?: string;
    telefono?: string;
    tipoDocumento?: string;
    documento?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formNombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formParentesco) {
      newErrors.parentesco = "El parentesco es obligatorio";
    }

    if (formTelefono && !/^[0-9]{10}$/.test(formTelefono.replace(/\s/g, ""))) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    if (!formTipoDocumento) {
      newErrors.tipoDocumento = "El tipo de documento es obligatorio";
    }

    if (!formDocumento.trim()) {
      newErrors.documento = "El número de documento es obligatorio";
    } else if (!/^[0-9]{7,12}$/.test(formDocumento.replace(/\s/g, ""))) {
      newErrors.documento = "El documento debe tener entre 7 y 12 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Limpiar formulario al cerrar
      setFormNombre("");
      setFormParentesco("");
      setFormTelefono("");
      setFormTipoDocumento("");
      setFormDocumento("");
      setParentescoSearchTerm("");
      setErrors({});
      setShowFormErrors(false);
    }
  };

  // Filtrar parentescos por término de búsqueda
  const parentescosFiltrados = parentescos.filter((parentesco) =>
    parentesco.label.toLowerCase().includes(parentescoSearchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowFormErrors(true);
    if (validateForm()) {
      try {
        if (miembroParaEditar) {
          const updatePayload: UpdateMiembroHogar = {
            id: miembroParaEditar.id,
            idCasa: miembroParaEditar.idCasa, // ya existe
            nombre: formNombre,
            numeroDocumento: Number(formDocumento),
            telefono: formTelefono ? Number(formTelefono) : undefined,
            tipoDocumento: formTipoDocumento,
            parentesco: formParentesco,
          };
          await miembrosService.updateMember(updatePayload.id, updatePayload);
          toast.success('Miembro actualizado', { description: 'Los cambios han sido guardados correctamente.' });
        } else {
          const createPayload: CreateMiembroHogar = {
            idCasa,
            nombre: formNombre,
            numeroDocumento: Number(formDocumento),
            telefono: formTelefono ? Number(formTelefono) : undefined,
            tipoDocumento: formTipoDocumento,
            parentesco: formParentesco,
          };
          await miembrosService.createMember(createPayload);
          toast.success('Miembro agregado', { description: 'El nuevo miembro ha sido registrado.' });
        }
        handleClose(false);
        // Notificar al padre para que refresque la lista
        if (onSave) {
          await onSave();
        }
      } catch (error) {
        console.error("Error al guardar el miembro del hogar:", error);
        // Extraer mensaje de error del backend si está disponible
        let errorMessage = 'No se pudo guardar el miembro. Intenta de nuevo.';
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }
        }
        toast.error('Error al guardar', { description: errorMessage });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <TooltipProvider>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
          style={{
            width: "600px",
            maxWidth: "none",
          }}
        >
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                <HugeiconsIcon
                  icon={User03Icon}
                  size={28}
                  style={{ color: "#4C6C5A" }}
                />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  {miembroParaEditar
                    ? "Modificar Miembro del Hogar"
                    : "Agregar Miembro del Hogar"}
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {miembroParaEditar
                    ? "Modifica la información del miembro del hogar."
                    : "Completa la información del nuevo miembro del hogar."}
                </SheetDescription>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              <form
                id="agregar-miembro-form"
                onSubmit={handleSubmit}
                className="space-y-6 px-6 pt-6"
              >
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <FormInput
                      name="nombre"
                      label="Nombre Completo"
                      value={formNombre}
                      onChange={(value) => {
                        setFormNombre(value);
                        if (showFormErrors && !value.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            nombre: "El nombre es obligatorio",
                          }));
                        } else {
                          setErrors((prev) => ({ ...prev, nombre: undefined }));
                        }
                      }}
                      placeholder="Ej: María González"
                      required
                      invalid={!!errors.nombre}
                      error={errors.nombre}
                      showError={showFormErrors}
                      inputFilter="letters-only"
                    />

                    <div className="space-y-2">
                      <Label
                        htmlFor="parentesco"
                        className="text-sm font-medium"
                      >
                        Parentesco <span className="text-red-500">*</span>
                      </Label>
                      <Popover
                        open={parentescoComboboxOpen}
                        onOpenChange={setParentescoComboboxOpen}
                        modal={false}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            mode="input"
                            placeholder={!formParentesco}
                            aria-expanded={parentescoComboboxOpen}
                            className={cn(
                              "w-full justify-between h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md",
                              showFormErrors &&
                              errors.parentesco &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            )}
                          >
                            {formParentesco ? (
                              <span className="font-medium">
                                {parentescos.find(
                                  (p) => p.value === formParentesco
                                )?.label || formParentesco}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                Seleccionar parentesco
                              </span>
                            )}
                            <ButtonArrow />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Buscar parentesco..."
                              value={parentescoSearchTerm}
                              onValueChange={setParentescoSearchTerm}
                            />
                            <CommandList>
                              <ScrollArea viewportClassName="max-h-[300px]">
                                <CommandEmpty>
                                  No se encontró parentesco.
                                </CommandEmpty>
                                <CommandGroup>
                                  {parentescosFiltrados.map((parentesco) => {
                                    const isSelected =
                                      formParentesco === parentesco.value;
                                    return (
                                      <CommandItem
                                        key={parentesco.value}
                                        value={parentesco.value}
                                        onSelect={() => {
                                          const newValue =
                                            parentesco.value === formParentesco
                                              ? ""
                                              : parentesco.value;
                                          setFormParentesco(newValue);
                                          setParentescoComboboxOpen(false);
                                          if (showFormErrors) {
                                            setErrors((prev) => ({
                                              ...prev,
                                              parentesco: undefined,
                                            }));
                                          }
                                        }}
                                        className="flex items-center py-3"
                                      >
                                        <span className="font-medium">
                                          {parentesco.label}
                                        </span>
                                        {isSelected && (
                                          <Check className="ml-auto h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                                <ScrollBar />
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <FormInput
                      name="telefono"
                      label="Teléfono"
                      value={formTelefono}
                      onChange={(value) => {
                        setFormTelefono(value);
                        if (
                          showFormErrors &&
                          value &&
                          !/^[0-9]{10}$/.test(value.replace(/\s/g, ""))
                        ) {
                          setErrors((prev) => ({
                            ...prev,
                            telefono: "El teléfono debe tener 10 dígitos",
                          }));
                        } else {
                          setErrors((prev) => ({
                            ...prev,
                            telefono: undefined,
                          }));
                        }
                      }}
                      placeholder="Ej: 3001234567"
                      type="tel"
                      invalid={!!errors.telefono}
                      error={errors.telefono}
                      showError={showFormErrors}
                      inputFilter="numbers-only"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    Documento de Identidad
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="tipoDocumento"
                        className="text-sm font-medium"
                      >
                        Tipo de Documento{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formTipoDocumento}
                        onValueChange={(value) => {
                          setFormTipoDocumento(value);
                          if (showFormErrors) {
                            setErrors((prev) => ({
                              ...prev,
                              tipoDocumento: undefined,
                            }));
                          }
                        }}
                        required
                      >
                        <SelectTrigger
                          id="tipoDocumento"
                          className={cn(
                            showFormErrors &&
                            errors.tipoDocumento &&
                            "border-red-500 focus:border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CEDULA_DE_CIUDADANIA">
                            Cédula de Ciudadanía
                          </SelectItem>
                          <SelectItem value="TARJETA_DE_IDENTIDAD">
                            Tarjeta de Identidad
                          </SelectItem>
                          <SelectItem value="CEDULA_DE_EXTRANJERIA">
                            Cédula de Extranjería
                          </SelectItem>
                          <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <FormInput
                      name="documento"
                      label="Número de Documento"
                      value={formDocumento}
                      onChange={(value) => {
                        setFormDocumento(value);
                        if (showFormErrors) {
                          if (!value.trim()) {
                            setErrors((prev) => ({
                              ...prev,
                              documento:
                                "El número de documento es obligatorio",
                            }));
                          } else if (
                            !/^[0-9]{6,12}$/.test(value.replace(/\s/g, ""))
                          ) {
                            setErrors((prev) => ({
                              ...prev,
                              documento:
                                "El documento debe tener entre 6 y 12 dígitos",
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              documento: undefined,
                            }));
                          }
                        }
                      }}
                      placeholder="Ej: 1234567"
                      required
                      invalid={!!errors.documento}
                      error={errors.documento}
                      showError={showFormErrors}
                      inputFilter="numbers-only"
                    />
                  </div>
                </div>
              </form>
            </div>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
              <Button
                variant="outline"
                className="flex-1 h-10 font-medium"
                onClick={() => handleClose(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="agregar-miembro-form"
                className="flex-1 h-10 font-medium"
              >
                {miembroParaEditar ? "Guardar Cambios" : "Agregar Miembro"}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </TooltipProvider>
    </Sheet>
  );
}
