# Especificación de API: Módulo de Movimientos

## 1. Endpoints

### 2.1. Obtener Movimientos por Mes (Recomendado - Principal)

```
GET /api/movimientos?mes=1&año=2024
```

**Parámetros de Query:**
- `mes` (number, requerido): Mes (1-12)
- `año` (number, requerido): Año (ej: 2024)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "movimientos": [
      {
        "id": 1,
        "fecha": "2024-01-15",
        "tipo": "ENTRADA",
        "concepto": "Pago de administración - Casa No.5",
        "descripcion": "Pago mensual de administración - Casa No.5",
        "monto": 150000,
        "categoria": "ADMINISTRACION_CUOTAS",
        "responsable": "Juan Pérez - Casa No.5",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 2,
        "fecha": "2024-01-14",
        "tipo": "SALIDA",
        "concepto": "Pago de servicios públicos",
        "descripcion": "Pago de energía eléctrica y agua",
        "monto": 450000,
        "categoria": "SERVICIOS_PUBLICOS",
        "responsable": null,
        "createdAt": "2024-01-14T08:15:00.000Z",
        "updatedAt": "2024-01-14T08:15:00.000Z"
      }
    ],
    "metricas": {
      "ingresos": 300000,
      "egresos": 450000,
      "balance": -150000,
      "saldoActual": 1250000
    }
  }
}
```

**Nota:** Este endpoint retorna tanto los movimientos como las métricas del mes en una sola respuesta. Es el endpoint principal recomendado para la vista de movimientos.


---

### 2.3. Crear Movimiento

```
POST /api/movimientos
```

**Body (JSON):**
```json
{
  "fecha": "2024-01-20",
  "tipo": "SALIDA",
  "concepto": "Mantenimiento de áreas comunes",
  "descripcion": "Reparación de ascensor",
  "monto": 320000,
  "categoria": "MANTENIMIENTO_REPARACIONES",
  "responsable": "Luis Fernández"
}
```

**Nota:** El campo `responsable` es opcional. Si no se envía o es `null`, el backend debe guardarlo como `null` o string vacío.

**Respuesta:**
- Retorna un objeto con `success: true` y `data` que contiene el objeto Movimiento creado con su ID asignado.

**Validaciones:**
- `fecha`: requerido, formato válido
- `tipo`: requerido, debe ser "ENTRADA" o "SALIDA"
- `concepto`: requerido, no vacío
- `descripcion`: opcional
- `monto`: requerido, número > 0
- `categoria`: requerido, debe ser un valor válido (ver sección 3)
- `responsable`: (proveedor) opcional



---


### 2.5. Actualizar Movimiento

```
PUT /api/movimientos/:id
```

**Body (JSON) - igual que crear, todos los campos:**
```json
{
  "fecha": "2024-01-20",
  "tipo": "SALIDA",
  "concepto": "Mantenimiento de áreas comunes",
  "descripcion": "Reparación de ascensor y mantenimiento preventivo",
  "monto": 350000,
  "categoria": "MANTENIMIENTO_REPARACIONES",
  "responsable": "Luis Fernández"
}
```

**Respuesta:**
- Retorna un objeto con `success: true` y `data` que contiene el objeto Movimiento actualizado.

---

### 2.6. Eliminar Movimiento

```
DELETE /api/movimientos/:id
```

**Respuesta:**
- Retorna un objeto con `success: true` y `message` indicando que el movimiento fue eliminado correctamente.
- Si el movimiento no existe, retorna `success: false` y `error` con el mensaje correspondiente.


---

## 3. Valores de Categorías

El backend debe aceptar y validar estos valores de categoría:

```typescript
const CATEGORIAS_VALIDAS = [
  'ADMINISTRACION_CUOTAS',
  'SERVICIOS_PUBLICOS',
  'ASEO_JARDINERIA',
  'MANTENIMIENTO_REPARACIONES',
  'MULTAS',
  'PISCINA',
  'SEGURIDAD_ACCESO',
  'EVENTOS_DECORACION',
  'PERSONAL_MANO_OBRA',
  'OTROS'
]
```

**Idea:**
- O simplemente que sea un campo string y que el front se encargue de eso, osea enviando al backend el dato de ASEO_JARDINERIA, etc.


## 4. Cálculo de Métricas

### Ingresos del Mes


### Egresos del Mes


### Balance del Mes
```javascript
balance = ingresos - egresos
```

### Saldo Actual (Saldo Acumulado)
 Suma acumulada de todos los movimientos hasta el final del mes seleccionado.

entonces como se deben tener en cuenta esas métricas para cada mes, y el saldo histórico, para meses pasados, sera lo que quedo en caja a final de ese mes. aunque claro, si es un mes actual, pues debe ir actualizado ese valor según los registros (entrada/salidas) que se agregan al mes.

y la idea de guardar esos datos, es por tener un seguimiento de los demás meses.

**Ejemplo:**
- Si el mes seleccionado es enero 2024, el saldo actual es la suma de todos los movimientos hasta el 31 de enero 2024.
- Para meses pasados, el saldo es histórico (no cambia).
- Para el mes actual, se actualiza en tiempo real.

---



## 10. Notas Importantes

1. El campo `responsable` puede ser `null` o string vacío. El backend debe aceptar ambos.
2. Las métricas deben calcularse en el backend, no en el frontend.
3. El saldo actual es acumulado hasta el final del mes seleccionado.
4. El endpoint principal retorna movimientos y métricas juntos para optimizar el rendimiento.

---

## 11. Ejemplo de Flujo Completo

### Cargar Vista de Movimientos
1. Frontend hace request: `GET /api/movimientos?mes=1&año=2024`
2. Backend retorna movimientos y métricas del mes
3. Frontend muestra tabla con movimientos y tarjetas con métricas

### Crear Nuevo Movimiento
1. Frontend hace request: `POST /api/movimientos` con los datos del formulario
2. Backend crea el movimiento y retorna el objeto creado
3. Frontend recarga los movimientos: `GET /api/movimientos?mes=1&año=2024`
4. Backend retorna movimientos actualizados con nuevas métricas

---

**Fin del documento**

