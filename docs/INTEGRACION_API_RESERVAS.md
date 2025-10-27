# 📡 Integración con API de Reservas

Este documento explica cómo está configurada la integración con la API de reservas y cómo usarla.

## 🏗️ Arquitectura

```
API Response → Adaptador → Colores → Estado → UI
    ↓              ↓           ↓        ↓      ↓
  JSON          transforma   aplica   React   Render
 backend        estructura   orange/  State
                              purple
```

## 📁 Archivos Creados

### 1. **`src/services/reservas-adapter.ts`**
Transforma la estructura de la API al formato de la aplicación.

**Funciones principales:**
- `transformReservaFromAPI()` - Transforma una reserva
- `transformReservasFromAPI()` - Transforma un array de reservas

**Lo que hace:**
- ✅ Combina `fechaSolicitud` + `horaInicio`/`horaFin` → `startDate`/`endDate` ISO
- ✅ Convierte `estadoSolicitud` ("PENDIENTE") → `estado` ("pendiente")
- ✅ Mapea `recursoComun.tipoRecursoComun.nombre` → `tipoRecurso` ("Zona" | "Objeto")
- ✅ Convierte `solicitante` → `user` (formato IUser)
- ✅ Extrae `casa.numeroCasa` → `casaNumero`

### 2. **`src/utils/reservas-utils.ts`**
Asigna colores automáticamente según el tipo de recurso.

**Funciones principales:**
- `getReservaColor(tipoRecurso)` - Devuelve 'orange' o 'purple'
- `addColorToReservas(reservas)` - Añade colores a un array

**Lógica de colores:**
- 🟠 `orange` → `tipoRecurso: 'Zona'`
- 🟣 `purple` → `tipoRecurso: 'Objeto'`
- ⚪ `gray` → fallback si no hay tipo

### 3. **`src/hooks/use-reservas.ts`**
Hook personalizado que consume la API.

**Lo que hace:**
1. Hace `fetch('/api/reservas')`
2. Transforma la respuesta con el adaptador
3. Aplica colores automáticamente
4. Devuelve `{ reservas, loading, error, refetch }`

## 🚀 Cómo Usar

### Opción 1: Con el Hook (Recomendado)

```typescript
import { useReservas } from '@/hooks/use-reservas'

export default function ReservasPage() {
  const { reservas, loading, error } = useReservas()

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <CalendarProvider events={reservas}>
      <ReservasList reservas={reservas} />
    </CalendarProvider>
  )
}
```

### Opción 2: Manual (si necesitas más control)

```typescript
import { transformReservasFromAPI } from '@/services/reservas-adapter'
import { addColorToReservas } from '@/utils/reservas-utils'

async function loadReservas() {
  const response = await fetch('/api/reservas')
  const data = await response.json()
  
  // 1. Transformar estructura
  const transformed = transformReservasFromAPI(data)
  
  // 2. Aplicar colores
  const withColors = addColorToReservas(transformed)
  
  return withColors
}
```

## 📊 Mapeo de Datos

### Estado de Solicitud
| API | App |
|-----|-----|
| `PENDIENTE` | `pendiente` |
| `APROBADA` / `APROBADO` | `aprobada` |
| `RECHAZADA` / `RECHAZADO` | `rechazada` |

### Tipo de Recurso
| API (tipoRecursoComun.nombre) | App |
|--------------------------------|-----|
| "Zona", "Espacio", "Área" | `Zona` |
| Cualquier otro | `Objeto` |

### Fechas
```typescript
API:
  fechaSolicitud: "2025-10-23"
  horaInicio: { hour: 9, minute: 0, second: 0, nano: 0 }
  horaFin: { hour: 11, minute: 0, second: 0, nano: 0 }

↓ Transformación ↓

App:
  startDate: "2025-10-23T09:00:00.000Z"
  endDate: "2025-10-23T11:00:00.000Z"
```

## 🔧 Configuración

### Cambiar URL de la API

Edita `src/hooks/use-reservas.ts`:

```typescript
const response = await fetch('/api/reservas') // ← Cambia esta URL
```

### Agregar Headers de Autenticación

```typescript
const response = await fetch('/api/reservas', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Agregar Parámetros de Query

```typescript
const response = await fetch('/api/reservas?mes=10&anio=2025')
```

## ✅ Checklist de Migración

Cuando estés listo para usar la API real:

- [ ] Verificar que la URL del endpoint sea correcta
- [ ] Agregar headers de autenticación si es necesario
- [ ] Reemplazar el contenido de `page.tsx` con `page-with-api.tsx.example`
- [ ] Probar que los colores se muestren correctamente (naranja/morado)
- [ ] Verificar que los estados (pendiente/aprobada/rechazada) funcionen
- [ ] Probar el manejo de errores
- [ ] Verificar el estado de carga

## 🐛 Troubleshooting

### "Las reservas no tienen color"
✅ Verifica que estés llamando a `addColorToReservas()` después de transformar

### "El tipo de recurso no se reconoce"
✅ Verifica que `tipoRecursoComun.nombre` contenga "Zona" u "Objeto"

### "Las fechas no se muestran correctamente"
✅ Verifica que `fechaSolicitud` esté en formato "YYYY-MM-DD"

### "Estados no se muestran"
✅ Verifica que `estadoSolicitud` sea "PENDIENTE", "APROBADA" o "RECHAZADA"

## 📝 Notas Importantes

1. **El backend NO necesita enviar el campo `color`** - Se calcula automáticamente
2. **El campo `tipoRecurso` es obligatorio** para que funcionen los colores
3. **Los estados deben ser consistentes** con los valores esperados
4. **Las horas se convierten automáticamente** a la zona horaria local del navegador

## 🔗 Archivos Relacionados

- `src/data/reservas.mock.ts` - Definiciones de tipos e interfaces
- `src/components/reservas-list.tsx` - Componente de lista de reservas
- `src/calendar/components/*` - Componentes del calendario
- `src/app/admin/bienes-comunes/reservas/page.tsx` - Página actual (con mocks)
- `src/app/admin/bienes-comunes/reservas/page-with-api.tsx.example` - Ejemplo con API

