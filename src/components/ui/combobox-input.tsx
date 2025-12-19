'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxInputProps {
    value: string;
    onChange: (value: string) => void;
    options: ComboboxOption[];
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    id?: string;
    disabled?: boolean;
    invalid?: boolean;
}

export function ComboboxInput({
    value,
    onChange,
    options,
    placeholder = 'Escribe o selecciona...',
    emptyMessage = 'No hay opciones disponibles',
    className,
    id,
    disabled = false,
    invalid = false,
}: ComboboxInputProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Sync internal state with external value
    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Filter options based on input
    const filteredOptions = React.useMemo(() => {
        if (!inputValue) return options;
        const searchTerm = inputValue.toLowerCase();
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm)
        );
    }, [inputValue, options]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        if (!open) setOpen(true);
    };

    const handleSelect = (selectedValue: string) => {
        const option = options.find((o) => o.value === selectedValue);
        if (option) {
            setInputValue(option.label);
            onChange(option.label);
        }
        setOpen(false);
        // Return focus to input after selection
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setOpen(false);
        } else if (e.key === 'ArrowDown' && !open) {
            setOpen(true);
        }
    };

    const handleContainerClick = () => {
        if (!open) {
            setOpen(true);
        }
        inputRef.current?.focus();
    };

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <div
                    ref={containerRef}
                    className="relative w-full cursor-text"
                    onClick={handleContainerClick}
                >
                    <input
                        ref={inputRef}
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background',
                            'placeholder:text-muted-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            invalid && 'border-red-500 focus-visible:ring-red-500',
                            className
                        )}
                    />
                    <ChevronDown
                        className={cn(
                            'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform',
                            open && 'rotate-180'
                        )}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => {
                    // Don't close if clicking inside the input container
                    if (containerRef.current?.contains(e.target as Node)) {
                        e.preventDefault();
                    }
                }}
            >
                <Command shouldFilter={false}>
                    <CommandList>
                        {filteredOptions.length === 0 ? (
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={handleSelect}
                                        className="cursor-pointer"
                                    >
                                        <span className="flex-1">{option.label}</span>
                                        {inputValue === option.label && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
