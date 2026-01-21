'use client';

import Image from 'next/image';

export default function MantenimientoPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video de fondo */}
            <div className="fixed inset-0 -z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/gradient-bg.mp4" type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                </video>
                {/* Overlay para oscurecer un poco y que se lea bien la tarjeta */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Tarjeta de mantenimiento */}
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/75 backdrop-blur-md border border-white/30 rounded-[2rem] p-8 md:p-12 text-center shadow-lg">
                    {/* Logo */}
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#445D4E] mb-8 shadow-sm">
                        <Image
                            src="/logoFondo.svg"
                            alt="Flor Digital Logo"
                            width={40}
                            height={40}
                            className="rounded-sm"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                        Estamos en Mantenimiento
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
                        Estamos trabajando arduamente para mejorar tu experiencia en el portal.
                        Volveremos muy pronto con novedades.
                    </p>

                    <div className="pt-8 border-t border-gray-100/50">
                        <p className="text-sm text-gray-400 font-medium tracking-wide">
                            &copy; {new Date().getFullYear()} Flor Digital - Condominio
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
