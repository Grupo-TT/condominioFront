"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Componente que muestra una advertencia con degradado e iconos comparativos.
 * Alineado con los colores del sistema (#4C6C5B).
 */
export function MobileDeviceWarning() {
    const [isMobile, setIsMobile] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const isDismissed = sessionStorage.getItem("mobile-warning-dismissed");
        if (isDismissed) {
            setDismissed(true);
        }

        const checkSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem("mobile-warning-dismissed", "true");
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isMobile && !dismissed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/30 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* Degradado Superior sutil con el color primario */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#4C6C5B]/10 to-transparent pointer-events-none" />

                        <div className="p-8 md:p-10 text-center relative z-10">
                            {/* Iconos comparativos recuperados */}
                            <div className="flex items-center justify-center gap-6 mb-8">
                                <div className="relative">
                                    <div className="p-4 bg-red-50 rounded-2xl text-red-400 border border-red-100">
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-red-100">
                                        <X className="w-3 h-3 text-red-600" />
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-gray-300" />

                                <div className="relative">
                                    <div className="p-4 bg-emerald-50 rounded-2xl text-[#4C6C5B] border border-emerald-100 ring-4 ring-[#4C6C5B]/5">
                                        <Monitor className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-[#4C6C5B] rounded-full p-0.5 shadow-sm border-2 border-white">
                                        <div className="w-3 h-3 flex items-center justify-center text-[8px] font-bold text-white">✓</div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                                Acceso Recomendado en Computador
                            </h2>

                            <div className="space-y-4 mb-10">
                                <p className="text-gray-500 text-sm leading-relaxed px-4">
                                    Esta plataforma no está optimizada para móviles, por lo que <span className="font-semibold text-gray-700">no aseguramos resultados óptimos</span> en estos dispositivos.
                                </p>
                                <div className="inline-block px-4 py-2 bg-[#4C6C5B]/5 rounded-xl border border-[#4C6C5B]/10">
                                    <p className="text-[#4C6C5B] text-sm font-semibold">
                                        Por favor, accede desde un computador para una mejor experiencia.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleDismiss}
                                className="w-full h-12 text-base font-bold bg-[#4C6C5B] hover:bg-[#3d5749] text-white rounded-xl shadow-lg shadow-[#4C6C5B]/20 transition-all duration-200"
                            >
                                Entendido, continuar
                            </Button>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
