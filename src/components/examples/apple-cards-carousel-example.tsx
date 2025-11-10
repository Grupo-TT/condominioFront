"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselExample() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Recursos del Condominio
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

// Ejemplo de datos para las tarjetas
const data = [
  {
    category: "Zona Común",
    title: "Salón de Eventos",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069",
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Salón de Eventos
          </span>{" "}
          Amplio espacio ideal para celebraciones, reuniones familiares y eventos corporativos.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400">
              <li>Capacidad para 100 personas</li>
              <li>Cocina equipada</li>
              <li>Sistema de audio</li>
              <li>Aire acondicionado</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Horario disponible:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Lunes a Domingo de 8:00 AM a 10:00 PM</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Costo de reserva:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">$50.000 por día</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Zona Común",
    title: "Piscina",
    src: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=2070",
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Piscina
          </span>{" "}
          Disfruta de nuestra piscina climatizada con área para niños y adultos.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400">
              <li>Piscina semi-olímpica 25m</li>
              <li>Piscina para niños</li>
              <li>Vestidores y duchas</li>
              <li>Área de descanso</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Horario disponible:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Lunes a Domingo de 6:00 AM a 8:00 PM</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Costo de reserva:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Gratis para residentes</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Zona Común",
    title: "Gimnasio",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Gimnasio
          </span>{" "}
          Equipamiento completo para entrenamientos cardiovasculares y de fuerza.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400">
              <li>Máquinas cardiovasculares</li>
              <li>Pesas libres</li>
              <li>Máquinas de musculación</li>
              <li>Zona de stretching</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Horario disponible:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Lunes a Domingo de 5:00 AM a 11:00 PM</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Costo de reserva:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Gratis para residentes</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Objeto",
    title: "Carpa para Eventos",
    src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=2070",
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Carpa para Eventos
          </span>{" "}
          Carpa profesional para eventos al aire libre con capacidad para 50 personas.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400">
              <li>Dimensiones: 6m x 8m</li>
              <li>Resistente al agua</li>
              <li>Paredes laterales opcionales</li>
              <li>Iluminación incluida</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Disponibilidad:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Máximo 3 días consecutivos</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Costo de reserva:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">$30.000 por día</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "Zona Común",
    title: "Cancha Deportiva",
    src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070",
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            Cancha Deportiva
          </span>{" "}
          Cancha multifuncional para fútbol, básquetbol y voleibol.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400">
              <li>Superficie sintética</li>
              <li>Iluminación nocturna</li>
              <li>Marcaciones para múltiples deportes</li>
              <li>Gradas para espectadores</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Horario disponible:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Lunes a Domingo de 6:00 AM a 10:00 PM</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Costo de reserva:</h3>
            <p className="text-neutral-600 dark:text-neutral-400">$20.000 por hora</p>
          </div>
        </div>
      </div>
    ),
  },
];

