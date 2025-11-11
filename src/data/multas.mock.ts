import { Multa } from '@/types/cuotas.types'

export const multasData: Multa[] = [
  {
    id: '1',
    casaId: '2',
    casa: '12',
    propietario: 'María García López',
    titulo: 'Mascota sin correa en área común',
    motivo: 'Se observó el día 10 de febrero a las 15:30 horas que el propietario paseaba su mascota (perro de raza Golden Retriever) sin correa ni bozal en el área de parque infantil, lo cual representa un riesgo para los niños que utilizan esta zona. \n\n Varios residentes presentaron quejas formales ante la administración. Esta es la segunda vez que se reporta esta situación en el mes.',
    monto: 75000,
    fecha: '2024-02-10',
    estadoPago: 'PENDIENTE',
    tipoPago: 'DINERO'
  },
  {
    id: '2',
    casaId: '3',
    casa: '11',
    propietario: 'Carlos Rodríguez Silva',
    titulo: 'Estacionamiento en lugar no autorizado',
    motivo: 'Infracción cometida en el parqueadero de visitantes, donde el propietario estacionó su vehículo (Toyota Corolla, placa ABC-123) durante más de 72 horas consecutivas ocupando un espacio destinado exclusivamente para visitantes temporales. Esta acción impidió que varios visitantes pudieran hacer uso de las instalaciones y generó múltiples quejas por parte de otros residentes del conjunto.',
    monto: 50000,
    fecha: '2024-02-15',
    estadoPago: 'CONDONADO',
    tipoPago: 'DINERO'
  },
  {
    id: '3',
    casaId: '5',
    casa: '19',
    propietario: 'Pedro López González',
    titulo: 'Daños en área común',
    motivo: 'Se identificaron daños considerables en la pared del ascensor principal del edificio, específicamente rayones profundos y manchas de pintura que requieren restauración profesional. Las cámaras de seguridad confirmaron que el daño fue causado durante una mudanza realizada por el propietario sin la debida protección. El propietario aceptó la responsabilidad y acordó pagar mediante labor social, realizando tareas de mantenimiento en áreas comunes.',
    monto: 100000,
    fecha: '2024-01-20',
    estadoPago: 'CONDONADO',
    tipoPago: 'LABOR_SOCIAL'
  },
  {
    id: '4',
    casaId: '1',
    casa: '15',
    propietario: 'Jose Pérez Hurtado',
    titulo: 'Ruido excesivo en horario nocturno',
    motivo: 'Múltiples reportes de vecinos de las casas contiguas (números 14 y 16) por ruido excesivo proveniente de una reunión social que se extendió desde las 23:00 horas hasta las 02:00 de la madrugada. El volumen de la música y las conversaciones superaron los niveles permitidos según el reglamento de convivencia. Esta es la tercera infracción similar en lo que va del año. El propietario fue notificado verbalmente en dos ocasiones previas.',
    monto: 60000,
    fecha: '2024-02-20',
    estadoPago: 'PENDIENTE',
    tipoPago: 'DINERO'
  },
  {
    id: '5',
    casaId: '4',
    casa: '10',
    propietario: 'Ana Martínez Ruiz',
    titulo: 'Botes de basura en área común',
    motivo: 'Se observaron múltiples botes de basura y escombros dejados en el pasillo común frente a la unidad residencial por más de 48 horas, específicamente desde el día 16 hasta el 18 de febrero. Esta situación generó malos olores, presencia de insectos y obstrucción parcial del paso. El reglamento interno establece que los residuos deben depositarse únicamente en los horarios y lugares designados para la recolección.',
    monto: 45000,
    fecha: '2024-02-18',
    estadoPago: 'PENDIENTE',
    tipoPago: 'DINERO'
  },
  {
    id: '6',
    casaId: '6',
    casa: '14',
    propietario: 'Laura Sánchez Torres',
    titulo: 'Animal sin supervisión',
    motivo: 'Durante la tarde del 12 de febrero, se encontró un perro de raza mediana deambulando sin supervisión en el jardín común y área de juegos infantiles. Varios residentes identificaron al animal como perteneciente a la casa número 14. El perro estuvo sin supervisión por aproximadamente 2 horas, causando molestias a familias con niños pequeños que utilizaban el área. La propietaria se disculpó y pagó la multa mediante labor social.',
    monto: 55000,
    fecha: '2024-02-12',
    estadoPago: 'CONDONADO',
    tipoPago: 'LABOR_SOCIAL'
  },
]
