'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardHeading, CardToolbar } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { FormFieldWithTooltip } from '@/components/forms';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { configuracionValorSchema, ConfiguracionValorFormData } from '@/lib/validations/configuracion.validation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet01Icon, AnalyticsUpIcon, Legal02Icon } from '@hugeicons/core-free-icons';

interface CollapsibleConfigCardProps {
  title: string;
  subtitle: string;
  currentValue: number;
  unit: '$' | '%';
  onChange: (value: number, date?: string) => void;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  showDateField?: boolean;
}

function CollapsibleConfigCard({ 
  title,
  subtitle,
  currentValue, 
  unit,
  onChange,
  icon,
  iconBgColor,
  iconColor,
  showDateField = false
}: CollapsibleConfigCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  
  const form = useForm<ConfiguracionValorFormData>({
    resolver: zodResolver(configuracionValorSchema),
    mode: 'onChange',
    defaultValues: {
      valor: undefined,
      fechaAplicacion: undefined,
    }
  });

  const handleSave = (data: ConfiguracionValorFormData) => {
    if (showDateField && !data.fechaAplicacion) {
      // Mostrar todos los errores si falta la fecha
      setShowAllErrors(true);
      return;
    }
    onChange(data.valor, data.fechaAplicacion?.toISOString() || undefined);
    form.reset();
    setShowAllErrors(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setShowAllErrors(false);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setShowAllErrors(true);
    form.handleSubmit(handleSave)();
  };

  const formatValue = (value: number) => {
    if (unit === '$') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(value);
    } else if (unit === '%') {
      return `${value}%`;
    }
    return value.toString();
  };

  return (
    <Card className="w-full gap-4 py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="h-auto py-0 px-4">
          <div className="flex items-center gap-3 w-full">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBgColor, iconColor)}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-muted-foreground text-xs font-medium">{title}</div>
              <div className="text-foreground font-semibold text-xl mt-0.5">{formatValue(currentValue)}</div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs flex-shrink-0">
                Editar
                {isOpen ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="text-muted-foreground text-xs mt-1.5 pl-[52px]">{subtitle}</div>
        </CardHeader>
        <CollapsibleContent>
          <TooltipProvider>
            <CardContent className="text-sm space-y-2.5 pt-3 pb-2.5 px-4">
              <Controller
                name="valor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor={`value-${title}`} className="text-xs">
                      Nuevo Valor
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <FormFieldWithTooltip
                      label=""
                      invalid={fieldState.invalid}
                      error={showAllErrors ? fieldState.error?.message : undefined}
                      className="-mt-3"
                    >
                      <div className="relative">
                        {unit === '$' && (
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10">
                            $
                          </span>
                        )}
                        <Input
                          id={`value-${title}`}
                          type="number"
                          value={field.value?.toString() || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || value === '-') {
                              field.onChange(undefined);
                            } else {
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue) && numValue >= 0) {
                                field.onChange(numValue);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevenir entrada de signo negativo
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          placeholder="0"
                          className={cn(
                            "w-full h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                            unit === '$' && "pl-8",
                            unit === '%' && "pr-8",
                            fieldState.invalid && "border-red-500 focus:border-red-500"
                          )}
                          min="0"
                          step={unit === '%' ? '0.1' : '1000'}
                        />
                        {unit === '%' && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm z-10">
                            %
                          </span>
                        )}
                      </div>
                    </FormFieldWithTooltip>
                  </div>
                )}
              />
              {showDateField && (
                <Controller
                  name="fechaAplicacion"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor={`date-${title}`} className="text-xs">
                        Fecha de Aplicación
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <DatePicker
                        id={`date-${title}`}
                        value={field.value}
                        onSelect={field.onChange}
                        placeholder="Selecciona una fecha"
                        className="w-full h-9"
                        minDate={new Date()}
                      />
                    </div>
                  )}
                />
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="h-8 text-xs px-6" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 text-xs px-6" 
                  onClick={handleSubmit}
                  disabled={!form.formState.isValid || (showDateField && !form.watch('fechaAplicacion'))}
                >
                  Guardar
                </Button>
              </div>
            </CardContent>
          </TooltipProvider>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

interface ConfiguracionCuotasDialogProps {
  children?: React.ReactNode;
}

export function ConfiguracionCuotasDialog({ children }: ConfiguracionCuotasDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Estados para los valores de configuración
  const [valorAdmin, setValorAdmin] = useState(150000);
  const [tasaInteresMora, setTasaInteresMora] = useState(2.5);
  const [penalidadNoPago, setPenalidadNoPago] = useState(50000);

  const handleSaveValorAdmin = (value: number, date?: string) => {
    setValorAdmin(value);
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardar valor de administración:', { value, fechaAplicacion: date });
  };

  const handleSaveTasaInteres = (value: number) => {
    setTasaInteresMora(value);
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardar tasa de interés:', value);
  };

  const handleSavePenalidad = (value: number) => {
    setPenalidadNoPago(value);
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardar penalidad:', value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Valores Constantes
          </DialogTitle>
          <DialogDescription>
            Configura los valores base para los cálculos de cuotas y penalizaciones.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-3">
          <CollapsibleConfigCard
            title="Valor de Administración"
            subtitle="Monto mensual base para el pago de administración"
            currentValue={valorAdmin}
            unit="$"
            onChange={handleSaveValorAdmin}
            icon={<HugeiconsIcon icon={Wallet01Icon} size={20} />}
            iconBgColor="bg-[#E3E4EA]"
            iconColor="text-[#595D75]"
            showDateField={true}
          />
          
          <CollapsibleConfigCard
            title="Tasa de Interés por Mora"
            subtitle="Porcentaje de interés aplicado a pagos atrasados"
            currentValue={tasaInteresMora}
            unit="%"
            onChange={handleSaveTasaInteres}
            icon={<HugeiconsIcon icon={AnalyticsUpIcon} size={20} />}
            iconBgColor="bg-[#F1E8D6]"
            iconColor="text-[#A39170]"
          />
          
          <CollapsibleConfigCard
            title="Penalidad por No Pagar Administración"
            subtitle="Cargo adicional por mora en el pago de administración"
            currentValue={penalidadNoPago}
            unit="$"
            onChange={handleSavePenalidad}
            icon={<HugeiconsIcon icon={Legal02Icon} size={20} />}
            iconBgColor="bg-[#E6EFEA]"
            iconColor="text-[#4C6C5A]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

