// Mock de comunicados para pruebas
export interface ComunicadoMock {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: number
  estado: 'enviado' | 'pendiente' | 'error'
}

export const comunicadosMock: ComunicadoMock[] = [
  {
    id: '1',
    asunto: 'Recordatorio de pago de cuota mensual',
    mensaje: 'Estimados propietarios, les recordamos que el pago de la cuota mensual vence el próximo 15 de cada mes. Por favor, realicen su pago a tiempo para evitar recargos. Pueden realizar el pago a través de transferencia bancaria o en efectivo en la administración.',
    fechaEnvio: '2024-01-15T10:30:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '2',
    asunto: 'Mantenimiento programado del ascensor',
    mensaje: 'Informamos que el próximo lunes 20 de enero se realizará mantenimiento preventivo del ascensor del edificio A. El servicio estará suspendido de 8:00 AM a 2:00 PM. Agradecemos su comprensión.',
    fechaEnvio: '2024-01-10T14:20:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '3',
    asunto: 'Asamblea General Ordinaria',
    mensaje: 'Se convoca a todos los propietarios a la Asamblea General Ordinaria que se llevará a cabo el día sábado 25 de enero a las 3:00 PM en el salón comunal. Temas a tratar: presupuesto 2024, elección de comité de convivencia, y varios.',
    fechaEnvio: '2024-01-08T09:00:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '4',
    asunto: 'Nuevas normas de convivencia para mascotas',
    mensaje: 'Se informa a la comunidad que a partir del 1 de febrero entrarán en vigencia las nuevas normas de convivencia para mascotas. Los propietarios deben registrar a sus mascotas en la administración y cumplir con los horarios establecidos para paseos en zonas comunes.',
    fechaEnvio: '2024-01-05T16:45:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '5',
    asunto: 'Corte de agua programado',
    mensaje: 'El día jueves 18 de enero se realizará un corte de agua programado por parte de la empresa de acueducto para realizar trabajos de mantenimiento en la red principal. El corte será de 6:00 AM a 12:00 PM. Les recomendamos almacenar agua con anticipación.',
    fechaEnvio: '2024-01-03T11:15:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '6',
    asunto: 'Feliz Año Nuevo 2024',
    mensaje: 'La administración del condominio les desea un feliz año nuevo 2024. Que este nuevo año esté lleno de salud, prosperidad y armonía para todos los residentes y sus familias. ¡Gracias por ser parte de nuestra comunidad!',
    fechaEnvio: '2024-01-01T00:05:00',
    destinatarios: 25,
    estado: 'enviado',
  },
]
