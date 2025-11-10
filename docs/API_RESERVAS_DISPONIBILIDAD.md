# 📡 API de Reservas - Peticiones y Respuestas

Este documento describe las peticiones y respuestas de la API necesarias para que funcione la funcionalidad de disponibilidad de recursos en el frontend.

## 🔄 Endpoints

### 1. **Consultar Disponibilidad de un Recurso**

Cuando el usuario selecciona un recurso y una fecha, el frontend necesita saber qué horas están ocupadas.

#### Request

```http
GET /api/reservas/disponibilidad?recursoId=1&fecha=2025-12-15
```

**Query Parameters:**
- `recursoId` (number): ID del recurso a consultar
- `fecha` (string): Fecha en formato `YYYY-MM-DD`

#### Response

```json
{
  "message": "Disponibilidad consultada exitosamente",
  "data": {
    "recursoId": 1,
    "fecha": "2025-12-15",
    "reservas": [
      {
        "id": 1,
        "fechaSolicitud": "2025-12-15",
        "horaInicio": {
          "hour": 14,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "horaFin": {
          "hour": 18,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "estadoSolicitud": "APROBADA"
      },
      {
        "id": 2,
        "fechaSolicitud": "2025-12-15",
        "horaInicio": {
          "hour": 10,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "horaFin": {
          "hour": 12,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "estadoSolicitud": "PENDIENTE"
      }
    ]
  }
}
```

**Notas importantes:**
- Solo deben incluirse reservas con estado `APROBADA` o `PENDIENTE` (no `RECHAZADA`)
- Las horas deben estar en formato de 24 horas
- Si una reserva es de `14:00` a `18:00`, las horas ocupadas son: `14:00`, `15:00`, `16:00`, `17:00` (la hora de fin `18:00` NO está ocupada)

---

### 2. **Crear una Nueva Reserva**

Cuando el usuario confirma una reserva, se envía al backend.

#### Request

```http
POST /api/reservas/create
Content-Type: application/json
```

**Body:**
```json
{
  "recursoComunId": 1,
  "fechaSolicitud": "2025-12-20",
  "horaInicio": {
    "hour": 9,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "horaFin": {
    "hour": 11,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "numeroInvitados": 10
}
```

**Campos requeridos:**
- `recursoComunId` (number): ID del recurso a reservar
- `fechaSolicitud` (string): Fecha en formato `YYYY-MM-DD`
- `horaInicio` (object): Hora de inicio con `hour`, `minute`, `second`, `nano`
- `horaFin` (object): Hora de fin con `hour`, `minute`, `second`, `nano`
- `numeroInvitados` (number): Número de invitados

#### Response

```json
{
  "message": "Reserva creada exitosamente",
  "data": {
    "id": 123,
    "fechaSolicitud": "2025-12-20",
    "horaInicio": {
      "hour": 9,
      "minute": 0,
      "second": 0,
      "nano": 0
    },
    "horaFin": {
      "hour": 11,
      "minute": 0,
      "second": 0,
      "nano": 0
    },
    "numeroInvitados": 10,
    "estadoSolicitud": "PENDIENTE",
    "recursoComun": {
      "id": 1,
      "nombre": "Salón de Eventos",
      "descripcion": "Amplio salón con capacidad para 50 personas",
      "tipoRecursoComun": {
        "id": 1,
        "nombre": "Zona"
      }
    },
    "casa": {
      "id": 1,
      "numeroCasa": 3
    },
    "solicitante": {
      "nombreCompleto": "Juan Pérez",
      "telefono": 1234567890,
      "correo": "juan@example.com"
    }
  }
}
```

---

### 3. **Obtener Todas las Reservas**

Para mostrar todas las reservas del usuario en el calendario.

#### Request

```http
GET /api/reservas
```

#### Response

```json
{
  "message": "Reservas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "fechaSolicitud": "2025-12-15",
      "horaInicio": {
        "hour": 14,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "horaFin": {
        "hour": 18,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "numeroInvitados": 25,
      "estadoSolicitud": "APROBADA",
      "recursoComun": {
        "id": 1,
        "nombre": "Salón de Eventos",
        "descripcion": "Amplio salón con capacidad para 50 personas",
        "tipoRecursoComun": {
          "id": 1,
          "nombre": "Zona"
        }
      },
      "casa": {
        "id": 1,
        "numeroCasa": 3
      },
      "solicitante": {
        "nombreCompleto": "Juan Pérez",
        "telefono": 1234567890,
        "correo": "juan@example.com"
      }
    }
  ]
}
```

---

## 📋 Resumen de Endpoints

| Endpoint | Método | Descripción | Parámetros |
|----------|--------|-------------|------------|
| `/api/reservas/disponibilidad` | GET | Consultar disponibilidad de un recurso | `recursoId`, `fecha` |
| `/api/reservas/create` | POST | Crear nueva reserva | Body JSON |
| `/api/reservas` | GET | Obtener todas las reservas del usuario | - |

---

## 🔧 Ejemplo de Uso en el Frontend

```typescript
// Consultar disponibilidad
async function consultarDisponibilidad(recursoId: number, fecha: Date) {
  const fechaStr = fecha.toISOString().split('T')[0] // "2025-12-15"
  const response = await fetch(
    `/api/reservas/disponibilidad?recursoId=${recursoId}&fecha=${fechaStr}`
  )
  const data = await response.json()
  return data.data.reservas
}

// Crear reserva
async function crearReserva(reserva: {
  recursoComunId: number
  fechaSolicitud: string
  horaInicio: { hour: number; minute: number; second: number; nano: number }
  horaFin: { hour: number; minute: number; second: number; nano: number }
  numeroInvitados: number
}) {
  const response = await fetch('/api/reservas/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reserva)
  })
  return await response.json()
}
```

---

## 📝 Notas sobre Formatos

- **Fechas:** Siempre en formato `YYYY-MM-DD` (ej: `"2025-12-15"`)
- **Horas:** Objetos con `hour`, `minute`, `second`, `nano` (formato de 24 horas)
- **Estados:** `PENDIENTE`, `APROBADA`, `RECHAZADA` (en mayúsculas)
- **Conversión en frontend:** El frontend trabaja con strings `"HH:MM"` (ej: `"14:00"`) y los convierte según necesidad
