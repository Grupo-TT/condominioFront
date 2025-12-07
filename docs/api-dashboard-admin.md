# Especificación de API - Dashboard Admin

## Resumen
Este documento especifica los endpoints necesarios para el Dashboard de Administración, incluyendo parámetros, respuestas esperadas y consideraciones de rendimiento.

---

## 1. Resumen Financiero Mensual

### Endpoint
```
GET /api/admin/dashboard/monthly-data
```

### Parámetros de Query
| Parámetro | Tipo   | Requerido | Descripción                           | Ejemplo |
|-----------|--------|-----------|---------------------------------------|---------|
| `year`    | number | Sí        | Año para el cual obtener los datos    | 2024    |

### Respuesta Exitosa (200)
```json
{
  "año": 2024,
  "meses": [
    {
      "mes": "Ene",
      "entradas": 12500000,
      "salidas": 8300000
    },
    {
      "mes": "Feb",
      "entradas": 11800000,
      "salidas": 9100000
    }
    // ... 10 meses más
  ]
}
```

### Ejemplo de Uso
```typescript
const response = await fetch('/api/admin/dashboard/monthly-data?year=2024')
const data = await response.json()
```

### Notas de Implementación
- ✅ **Optimización**: Solo enviar datos del año solicitado
- ✅ Cachear respuestas por año (datos históricos no cambian)
- ✅ Meses siempre en orden cronológico
- ✅ Usar nombres de meses cortos en español (Ene, Feb, Mar, etc.)

---

## 2. Resumen del Mes Actual (Tarjetas Superiores)

### Endpoint
```
GET /api/admin/dashboard/current-month-summary
```

### Sin Parámetros
Retorna los datos financieros del mes actual.

### Respuesta Exitosa (200)
```json
{
  "entradas": 14500000,
  "salidas": 10100000,
  "balance": 4400000,
  "saldoActual": 45800000
}
```

### Campos de Respuesta
| Campo         | Tipo   | Descripción                                        |
|---------------|--------|---------------------------------------------------|
| `entradas`    | number | Entradas del mes actual                            |
| `salidas`     | number | Salidas del mes actual                             |
| `balance`     | number | Diferencia entre entradas y salidas del mes        |
| `saldoActual` | number | Saldo total actual en cuenta bancaria (acumulado)  |

---

## 3. Resumen de Propiedades

### Endpoint
```
GET /api/admin/dashboard/houses-summary
```

### Sin Parámetros
Retorna información completa sobre las propiedades del condominio.

### Respuesta Exitosa (200)
```json
{
  "total": 48,
  "estadoPago": {
    "alDia": {
      "cantidad": 32
    },
    "morosas": {
      "cantidad": 16
    }
  },
  "distribucion": {
    "arrendadas": {
      "cantidad": 29
    },
    "residenciales": {
      "cantidad": 19
    }
  }
}
```

### Campos de Respuesta
| Campo                              | Tipo   | Descripción                                    |
|------------------------------------|--------|------------------------------------------------|
| `total`                            | number | Total de propiedades en el condominio          |
| `estadoPago.alDia.cantidad`        | number | Propiedades al día con pagos                   |
| `estadoPago.morosas.cantidad`      | number | Propiedades morosas                            |
| `distribucion.arrendadas.cantidad` | number | Propiedades arrendadas                         |
| `distribucion.residenciales.cantidad` | number | Propiedades residenciales                   |

### Notas de Implementación
- El frontend calcula los porcentajes: `(cantidad / total) * 100`
- `estadoPago.alDia.cantidad + estadoPago.morosas.cantidad` debe ser igual a `total`
- `distribucion.arrendadas.cantidad + distribucion.residenciales.cantidad` debe ser igual a `total`
