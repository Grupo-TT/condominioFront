import { Solicitud } from '@/types/solicitud.types'

export const solicitudesData: Solicitud[] = [
  {
    id: '1',
    casaId: '2',
    numeroCasa: '12',
    propietario: 'María García López',
    titulo: 'Solicitud de reparación en tubería principal',
    tipo: 'reparacion-locativa',
    fecha: '2024-02-10',
    estado: 'pendiente',
    descripcion: 'Se ha detectado una fuga de agua significativa en la tubería principal del segundo piso, específicamente en el área del baño principal.\n\nLa fuga comenzó el día 8 de febrero y ha ido empeorando progresivamente. El agua está filtrándose hacia el apartamento de abajo, causando daños en el techo del vecino.\n\nSe requiere atención inmediata de un plomero especializado para evitar mayores daños estructurales y la necesidad de reparaciones más costosas. La tubería afectada parece ser la de suministro principal, por lo que se recomienda una inspección completa del sistema de plomería del edificio.\n\nHorarios preferidos para la reparación: Lunes a Viernes de 8:00 AM a 5:00 PM.',
    tipoObra: 'Hidráulica',
    fechaInicio: '2024-02-15',
    fechaFinalizacion: '2024-02-20',
    trabajadores: [
      {
        nombre: 'Juan Carlos Pérez',
        documento: '1023456789',
        arl: 'SURA'
      },
      {
        nombre: 'Roberto Martínez',
        documento: '1034567890',
        arl: 'POSITIVA'
      }
    ]
  },
  {
    id: '2',
    casaId: '3',
    numeroCasa: '11',
    propietario: 'Carlos Rodríguez Silva',
    titulo: 'Queja por ruido excesivo en horas nocturnas',
    tipo: 'queja',
    fecha: '2024-02-15',
    estado: 'pendiente',
    descripcion: 'Múltiples reportes de ruido excesivo proveniente de la casa número 8 durante las horas nocturnas, específicamente entre las 11:00 PM y las 2:00 AM.\n\nEl ruido incluye:\n- Música a volumen muy alto\n- Voces y risas elevadas\n- Movimiento de muebles\n- Portazos constantes\n\nEsta situación se ha repetido durante las últimas tres semanas, afectando directamente a varias familias del conjunto, incluyendo residentes con niños pequeños y adultos mayores.\n\nSe ha intentado comunicación directa con los vecinos en dos ocasiones sin resultados positivos. Se solicita intervención de la administración para hacer cumplir el reglamento de convivencia que establece el respeto por el descanso de los residentes durante las horas nocturnas.'
  },
  {
    id: '3',
    casaId: '5',
    numeroCasa: '19',
    propietario: 'Pedro López González',
    titulo: 'Petición para instalación de cámaras de seguridad',
    tipo: 'peticion',
    fecha: '2024-01-20',
    estado: 'revisada',
    descripcion: 'Solicitud formal para la instalación de cámaras de seguridad adicionales en el área del estacionamiento y los accesos principales del conjunto.\n\nJustificación:\n- Ha habido varios incidentes de daños a vehículos sin identificar responsables\n- Necesidad de mayor seguridad durante las horas nocturnas\n- Protección adicional para los residentes y visitantes\n\nUbicaciones sugeridas:\n1. Entrada principal del conjunto\n2. Área de estacionamiento cubierto\n3. Pasillo del edificio principal\n4. Zona de juegos infantiles\n\nSe propone realizar una reunión con los propietarios para discutir el presupuesto y las opciones de sistemas de seguridad disponibles en el mercado.'
  },
  {
    id: '4',
    casaId: '1',
    numeroCasa: '15',
    propietario: 'Jose Pérez Hurtado',
    titulo: 'Sugerencia para mejoras en áreas comunes',
    tipo: 'sugerencia',
    fecha: '2024-02-20',
    estado: 'pendiente',
    descripcion: 'Propuesta para mejorar la iluminación y el mantenimiento de las áreas verdes del conjunto residencial.\n\nÁreas específicas a mejorar:\n\n1. Iluminación:\n- Instalar luces LED adicionales en los pasillos\n- Mejorar iluminación del estacionamiento\n- Agregar luces solares en áreas verdes\n\n2. Áreas verdes:\n- Renovación de jardines\n- Plantación de árboles nuevos\n- Mantenimiento más frecuente del césped\n\n3. Mantenimiento general:\n- Pintura de fachadas\n- Reparación de bancas y áreas de descanso\n- Limpieza profunda de fuentes de agua\n\nEsta propuesta busca mejorar la calidad de vida de todos los residentes y aumentar el valor de las propiedades del conjunto.'
  },
  {
    id: '5',
    casaId: '4',
    numeroCasa: '10',
    propietario: 'Ana Martínez Ruiz',
    titulo: 'Reparación locativa en fachada',
    tipo: 'reparacion-locativa',
    fecha: '2024-02-18',
    estado: 'aprobada',
    descripcion: 'Reparación necesaria en la fachada del edificio debido a grietas significativas y desprendimiento de pintura en la pared exterior del segundo piso.\n\nDetalles del daño:\n- Grietas horizontales y verticales de aproximadamente 2-3 cm de ancho\n- Desprendimiento de pintura en un área de aproximadamente 5 metros cuadrados\n- Humedad visible en algunas áreas\n- Riesgo potencial de desprendimiento de material\n\nEl problema comenzó a notarse después de las fuertes lluvias del mes pasado. Se requiere una inspección técnica para determinar si hay daños estructurales subyacentes y definir el alcance exacto de las reparaciones necesarias.\n\nLa reparación debe incluir: sellado de grietas, aplicación de impermeabilizante, y repintura completa de la fachada afectada para garantizar la integridad estructural y estética del edificio.',
    tipoObra: 'Obra blanca',
    fechaInicio: '2024-02-20',
    fechaFinalizacion: '2024-03-05',
    trabajadores: [
      {
        nombre: 'Luis Fernando Gómez',
        documento: '1045678901',
        arl: 'SURA'
      },
      {
        nombre: 'Carlos Alberto Ramírez',
        documento: '1056789012',
        arl: 'SURA'
      },
      {
        nombre: 'Miguel Ángel Torres',
        documento: '1067890123',
        arl: 'POSITIVA'
      }
    ]
  },
  {
    id: '6',
    casaId: '6',
    numeroCasa: '14',
    propietario: 'Laura Sánchez Torres',
    titulo: 'Queja sobre gestión de residuos',
    tipo: 'queja',
    fecha: '2024-02-12',
    estado: 'revisada',
    descripcion: 'Queja formal sobre la gestión de residuos y la frecuencia de recolección en el conjunto residencial.\n\nProblemas identificados:\n1. Frecuencia insuficiente de recolección de basura\n2. Contenedores llenos que permanecen varios días sin vaciarse\n3. Falta de organización en la separación de residuos reciclables\n4. Malos olores debido a la acumulación de desechos orgánicos\n\nImpacto:\n- Presencia de animales y plagas cerca de los contenedores\n- Olores desagradables que afectan la calidad de vida\n- Acumulación de residuos fuera de los contenedores cuando están llenos\n\nSe solicita una revisión del contrato con la empresa de recolección y considerar aumentar la frecuencia de servicio, especialmente en épocas de mayor generación de residuos.'
  },
  {
    id: '7',
    casaId: '7',
    numeroCasa: '18',
    propietario: 'Roberto Fernández Díaz',
    titulo: 'Petición para ampliación de zona de parqueadero',
    tipo: 'peticion',
    fecha: '2024-02-22',
    estado: 'pendiente',
    descripcion: 'Solicitud para la ampliación y mejoramiento de la zona de parqueaderos del conjunto residencial.\n\nMotivo:\n- El número actual de parqueaderos es insuficiente para la cantidad de vehículos de los residentes\n- Muchos residentes deben estacionar sus vehículos fuera del conjunto\n- Falta de organización en la asignación de espacios\n\nPropuesta:\n1. Evaluar la posibilidad de construir un segundo nivel de parqueadero\n2. Optimizar el espacio actual mediante mejor señalización\n3. Implementar sistema de rotación si es necesario\n4. Considerar alquiler de espacios adicionales cercanos\n\nSe solicita una reunión con la administración y una consulta con todos los propietarios para evaluar las opciones disponibles y sus costos asociados.'
  },
  {
    id: '9',
    casaId: '9',
    numeroCasa: '25',
    propietario: 'Fernando Herrera Castro',
    titulo: 'Petición para construcción de área de gimnasio',
    tipo: 'peticion',
    fecha: '2024-01-25',
    estado: 'revisada',
    descripcion: 'Solicitud para la construcción de un gimnasio comunitario en una de las áreas comunes disponibles.\n\nJustificación:\n- Beneficio para la salud y bienestar de todos los residentes\n- Aumento del valor de las propiedades\n- Espacio de convivencia adicional\n- Alternativa económica para los residentes que pagan gimnasios externos\n\nPropuesta:\n1. Ubicación: Área de 50 m² en el primer piso del edificio principal\n2. Equipamiento básico: máquinas cardiovasculares, pesas libres, espejos\n3. Sistema de horarios y acceso controlado\n4. Mantenimiento mensual estimado: $500.000\n\nConsideraciones:\n- Costo inicial de construcción y equipamiento\n- Mantenimiento y seguros\n- Reglamento de uso\n\nDespués de evaluar la propuesta, se determinó que el espacio disponible no es suficiente y los costos de mantenimiento son elevados para el presupuesto actual del conjunto.'
  },
  {
    id: '11',
    casaId: '11',
    numeroCasa: '20',
    propietario: 'Miguel Ángel González',
    titulo: 'Reparación locativa en sistema eléctrico',
    tipo: 'reparacion-locativa',
    fecha: '2024-01-15',
    estado: 'desaprobada',
    descripcion: 'Solicitud de reparación del sistema eléctrico del apartamento debido a múltiples cortocircuitos y sobrecargas.\n\nProblemas detectados:\n- Interruptores que se activan frecuentemente\n- Varios tomacorrientes sin funcionamiento\n- Instalación eléctrica antigua que no cumple con normativas actuales\n- Riesgo de incendio por sobrecarga\n\nLa reparación requiere actualización completa del sistema eléctrico incluyendo tablero principal, cableado y tomacorrientes.\n\nDespués de la evaluación técnica, se determinó que el problema es responsabilidad del propietario y no corresponde a reparación locativa, por lo que la solicitud fue rechazada.',
    tipoObra: 'Eléctrica',
    fechaInicio: '2024-01-20',
    fechaFinalizacion: '2024-01-25',
    trabajadores: []
  }
]

