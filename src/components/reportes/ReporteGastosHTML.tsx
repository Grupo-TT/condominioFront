import { Movimiento, Metricas } from '@/types/cuotas.types';

export interface DatosMensuales {
  mes: number;
  nombreMes: string;
  ingresos: number;
  egresos: number;
}

export interface DatosReporte {
  movimientos: Movimiento[];
  metricas: Metricas;
  periodo: { mes: number; anio: number };
  tipoReporte: 'mensual' | 'anual';
  condominioNombre?: string;
  datosMensuales?: DatosMensuales[];
}

const categoriaLabels: Record<string, string> = {
  ADMINISTRACION_CUOTAS: 'Administración / Cuotas',
  SERVICIOS_PUBLICOS: 'Servicios Públicos',
  ASEO_JARDINERIA: 'Aseo y Jardinería',
  MANTENIMIENTO_REPARACIONES: 'Mantenimiento y Reparaciones',
  PISCINA: 'Piscina',
  SEGURIDAD_ACCESO: 'Seguridad / Acceso',
  EVENTOS_DECORACION: 'Eventos / Decoración',
  PERSONAL_MANO_OBRA: 'Personal / Mano de Obra',
  MULTAS: 'Multas',
  OTROS: 'Otros',
};

const categoriaColores: Record<string, string> = {
  ADMINISTRACION_CUOTAS: '#3b82f6',
  SERVICIOS_PUBLICOS: '#f97316',
  ASEO_JARDINERIA: '#22c55e',
  MANTENIMIENTO_REPARACIONES: '#ef4444',
  PISCINA: '#06b6d4',
  SEGURIDAD_ACCESO: '#8b5cf6',
  EVENTOS_DECORACION: '#ec4899',
  PERSONAL_MANO_OBRA: '#14b8a6',
  MULTAS: '#f59e0b',
  OTROS: '#6b7280',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.includes('T')
    ? dateStr.split('T')[0].split('-').map(Number)
    : dateStr.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  return fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1] || '';
}

function calcularResumenCategorias(movimientos: Movimiento[]): { categoria: string; total: number; porcentaje: number; cantidad: number }[] {
  const totalesPorCategoria: Record<string, { total: number; cantidad: number }> = {};
  let totalGeneral = 0;

  movimientos.forEach((mov) => {
    const cat = mov.categoria || 'OTROS';
    if (!totalesPorCategoria[cat]) {
      totalesPorCategoria[cat] = { total: 0, cantidad: 0 };
    }
    totalesPorCategoria[cat].total += mov.monto;
    totalesPorCategoria[cat].cantidad += 1;
    totalGeneral += mov.monto;
  });

  return Object.entries(totalesPorCategoria)
    .map(([categoria, data]) => ({
      categoria,
      total: data.total,
      cantidad: data.cantidad,
      porcentaje: totalGeneral > 0 ? (data.total / totalGeneral) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function generarHTMLReporte(datos: DatosReporte): string {
  const { movimientos, metricas, periodo, tipoReporte, condominioNombre = 'Condominio Flor Digital', datosMensuales } = datos;

  const titulo = tipoReporte === 'mensual'
    ? `Reporte de Movimientos`
    : `Reporte Anual de Movimientos`;

  const subtitulo = tipoReporte === 'mensual'
    ? `${getNombreMes(periodo.mes)} ${periodo.anio}`
    : `Año ${periodo.anio}`;

  const fechaGeneracion = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const entradas = movimientos.filter(m => m.tipo === 'ENTRADA');
  const salidas = movimientos.filter(m => m.tipo === 'SALIDA');
  const resumenCategorias = calcularResumenCategorias(movimientos);

  // Calcular variación (simulada para reportes mensuales)
  const variacionBalance = metricas.balance >= 0 ? '+' : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - ${subtitulo}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #1a1a1a;
      background: #fff;
      padding: 32px 40px;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: 24px;
    }
    .header-left h1 {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .header-left .subtitle {
      font-size: 12px;
      color: #666;
    }
    .header-right {
      text-align: right;
      font-size: 10px;
      color: #888;
    }
    .header-right .condominio {
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    
    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .metric-card {
      padding: 14px 16px;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      min-height: 85px;
    }
    .metric-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: auto;
    }
    .metric-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 8px;
      margin-bottom: 2px;
    }
    .metric-sub {
      font-size: 9px;
      color: #888;
    }
    .metric-positive { color: #16a34a; }
    .metric-negative { color: #dc2626; }
    
    /* Bar Chart */
    .chart-container {
      margin-bottom: 28px;
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
    }
    .chart-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 180px;
      padding: 0 8px;
      gap: 8px;
    }
    .chart-month {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      gap: 4px;
    }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 150px;
      width: 100%;
      justify-content: center;
    }
    .chart-bar {
      width: 12px;
      min-height: 2px;
      border-radius: 2px 2px 0 0;
    }
    .chart-bar-income {
      background: #22c55e;
    }
    .chart-bar-expense {
      background: #ef4444;
    }
    .chart-label {
      font-size: 8px;
      color: #666;
      text-transform: uppercase;
    }
    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 12px;
      font-size: 9px;
    }
    .chart-legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
    }
    .chart-legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }
    
    /* Section Titles */
    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
    }
    
    /* Categories Summary */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .category-card {
      padding: 12px 14px;
      background: #fafafa;
      border-radius: 6px;
    }
    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .category-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .category-name {
      font-size: 10px;
      color: #444;
      flex: 1;
    }
    .category-amount {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .category-percent {
      font-size: 10px;
      color: #888;
      margin-left: 8px;
    }
    .category-bar-container {
      width: 100%;
      height: 4px;
      background: #e5e5e5;
      border-radius: 2px;
      overflow: hidden;
    }
    .category-bar {
      height: 100%;
      border-radius: 2px;
    }
    
    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 24px;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
      color: #444;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    th:last-child { text-align: right; }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #eee;
      color: #333;
    }
    td:last-child { text-align: right; }
    tr:hover { background: #fafafa; }
    .text-right { text-align: right; }
    .amount-positive { color: #16a34a; font-weight: 500; }
    .amount-negative { color: #dc2626; font-weight: 500; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 500;
    }
    .badge-entrada { background: #dcfce7; color: #166534; }
    .badge-salida { background: #fee2e2; color: #991b1b; }
    .text-muted { color: #888; }
    
    /* Footer */
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 9px;
      color: #888;
    }
    .footer p { margin-bottom: 2px; }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 32px;
      color: #888;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <h1>${titulo}</h1>
      <p class="subtitle">${subtitulo}</p>
    </div>
    <div class="header-right">
      <p class="condominio">${condominioNombre}</p>
      <p>Generado: ${fechaGeneracion}</p>
    </div>
  </header>

  <!-- Métricas -->
  <section class="metrics-grid">
    <div class="metric-card">
      <p class="metric-label">Ingresos</p>
      <p class="metric-value">${formatCurrency(metricas.ingresos)}</p>
      <p class="metric-sub">${entradas.length} transacciones</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">Egresos</p>
      <p class="metric-value">${formatCurrency(metricas.egresos)}</p>
      <p class="metric-sub">${salidas.length} transacciones</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">Balance del período</p>
      <p class="metric-value ${metricas.balance >= 0 ? 'metric-positive' : 'metric-negative'}">${variacionBalance}${formatCurrency(Math.abs(metricas.balance))}</p>
      <p class="metric-sub">${metricas.balance >= 0 ? 'Superávit' : 'Déficit'}</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">Saldo Acumulado</p>
      <p class="metric-value">${formatCurrency(metricas.saldoActual)}</p>
      <p class="metric-sub">Al cierre del período</p>
    </div>
  </section>

  ${tipoReporte === 'anual' && datosMensuales ? `
  <!-- Gráfica de Barras Mensual -->
  <section>
    <h2 class="section-title">Ingresos vs Egresos por Mes</h2>
    <div class="chart-container">
      <div class="chart-wrapper">
        ${(() => {
        const maxValue = Math.max(...datosMensuales.map(d => Math.max(d.ingresos, d.egresos)));
        return datosMensuales.map(d => {
          const incomeHeight = maxValue > 0 ? (d.ingresos / maxValue) * 140 : 0;
          const expenseHeight = maxValue > 0 ? (d.egresos / maxValue) * 140 : 0;
          return `
              <div class="chart-month">
                <div class="chart-bars">
                  <div class="chart-bar chart-bar-income" style="height: ${incomeHeight}px" title="Ingresos: ${formatCurrency(d.ingresos)}"></div>
                  <div class="chart-bar chart-bar-expense" style="height: ${expenseHeight}px" title="Egresos: ${formatCurrency(d.egresos)}"></div>
                </div>
                <span class="chart-label">${d.nombreMes.substring(0, 3)}</span>
              </div>
            `;
        }).join('');
      })()}
      </div>
      <div class="chart-legend">
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background: #22c55e"></span>
          <span>Ingresos</span>
        </div>
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background: #ef4444"></span>
          <span>Egresos</span>
        </div>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Resumen por Categorías -->
  <section>
    <h2 class="section-title">Distribución por Categorías</h2>
    <div class="categories-grid">
      ${resumenCategorias.map(({ categoria, total, porcentaje }) => `
        <div class="category-card">
          <div class="category-header">
            <span class="category-dot" style="background-color: ${categoriaColores[categoria] || '#6b7280'}"></span>
            <span class="category-name">${categoriaLabels[categoria] || categoria}</span>
            <span class="category-amount">${formatCurrency(total)}</span>
            <span class="category-percent">${porcentaje.toFixed(1)}%</span>
          </div>
          <div class="category-bar-container">
            <div class="category-bar" style="width: ${porcentaje}%; background-color: ${categoriaColores[categoria] || '#6b7280'}"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Tabla de Movimientos -->
  <section>
    <h2 class="section-title">Detalle de Movimientos</h2>
    ${tipoReporte === 'anual' && datosMensuales ? (() => {
      // Agrupar movimientos por mes para reporte anual
      const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      return nombresMeses.map((nombreMes, index) => {
        const mes = index + 1;
        const movimientosMes = movimientos.filter(m => {
          const fechaMov = new Date(m.fecha);
          return fechaMov.getMonth() + 1 === mes;
        });

        if (movimientosMes.length === 0) return '';

        const totalIngresos = movimientosMes.filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.monto, 0);
        const totalEgresos = movimientosMes.filter(m => m.tipo === 'SALIDA').reduce((acc, m) => acc + m.monto, 0);

        return `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f5f5f5; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px;">
              <span style="font-weight: 600; font-size: 11px; color: #333;">${nombreMes} ${periodo.anio}</span>
              <div style="display: flex; gap: 16px; font-size: 9px;">
                <span style="color: #16a34a;">+ ${formatCurrency(totalIngresos)}</span>
                <span style="color: #dc2626;">- ${formatCurrency(totalEgresos)}</span>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 70px">Fecha</th>
                  <th style="width: 130px">Categoría</th>
                  <th>Descripción</th>
                  <th style="width: 60px">Tipo</th>
                  <th style="width: 80px">Responsable</th>
                  <th style="width: 90px">Monto</th>
                </tr>
              </thead>
              <tbody>
                ${movimientosMes.map((mov) => `
                  <tr>
                    <td>${formatDate(mov.fecha)}</td>
                    <td>${categoriaLabels[mov.categoria || 'OTROS'] || 'Sin categoría'}</td>
                    <td>${mov.descripcion || mov.concepto || '-'}</td>
                    <td><span class="badge ${mov.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-salida'}">${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}</span></td>
                    <td class="text-muted">${mov.responsable || '-'}</td>
                    <td class="${mov.tipo === 'ENTRADA' ? 'amount-positive' : 'amount-negative'}">${mov.tipo === 'ENTRADA' ? '+' : '-'}${formatCurrency(mov.monto)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }).join('');
    })() : `
    <table>
      <thead>
        <tr>
          <th style="width: 80px">Fecha</th>
          <th style="width: 140px">Categoría</th>
          <th>Descripción</th>
          <th style="width: 70px">Tipo</th>
          <th style="width: 90px">Responsable</th>
          <th style="width: 100px">Monto</th>
        </tr>
      </thead>
      <tbody>
        ${movimientos.length > 0 ? movimientos.map((mov) => `
          <tr>
            <td>${formatDate(mov.fecha)}</td>
            <td>${categoriaLabels[mov.categoria || 'OTROS'] || 'Sin categoría'}</td>
            <td>${mov.descripcion || mov.concepto || '-'}</td>
            <td><span class="badge ${mov.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-salida'}">${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}</span></td>
            <td class="text-muted">${mov.responsable || '-'}</td>
            <td class="${mov.tipo === 'ENTRADA' ? 'amount-positive' : 'amount-negative'}">${mov.tipo === 'ENTRADA' ? '+' : '-'}${formatCurrency(mov.monto)}</td>
          </tr>
        `).join('') : `
          <tr>
            <td colspan="6" class="empty-state">No hay movimientos registrados en este período</td>
          </tr>
        `}
      </tbody>
    </table>
    `}
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p><strong>${condominioNombre}</strong></p>
    <p>Reporte generado automáticamente • Este documento es de carácter informativo</p>
  </footer>
</body>
</html>`;
}
