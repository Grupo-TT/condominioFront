// middleware.ts (Ubicado en src/middleware.ts para que Next.js lo detecte correctamente)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { shouldRedirectToCorrectRoute, getDashboardRoute } from '@/lib/utils/role-routes';

// 1. Define las rutas públicas (que NO requieren autenticación)
const publicRoutes = ['/login', '/'];

// 2. Define las rutas protegidas (que SÍ requieren autenticación)
const protectedRoutes = ['/dashboard', '/admin'];

// 3. Define las rutas exclusivas de propietario (sin prefijo /admin)
const ownerOnlyRoutes = [
  '/dashboard',
  '/reservas',
  '/mi-casa',
  '/finanzas',
  '/solicitudes',
  '/asamblea',
  '/configuracion',
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 0. Evitar bucles infinitos para la página de mantenimiento y archivos estáticos
  if (path === '/mantenimiento' || path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  // 1. Verificar modo mantenimiento
  const maintenanceEnv = process.env.NEXT_PUBLIC_MAINTENANCE_MODE || process.env.MAINTENANCE_MODE;
  const isMaintenanceMode = maintenanceEnv === 'true';

  if (isMaintenanceMode) {
    // Si estamos en mantenimiento, "reescribir" la URL internamente a /mantenimiento
    return NextResponse.rewrite(new URL('/mantenimiento', req.url));
  }

  // 4. Obtener el token y el rol de las cookies
  const token = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value?.toUpperCase(); // Normalizar a mayúsculas

  // DEBUG: Log para verificar valores (quitar en producción)
  console.log('[Middleware]', { path, userRole, hasToken: !!token });

  // 5. Verificar si la ruta es pública o protegida
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // 6. Si es ruta protegida y NO hay token, redirigir a login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 7. Si hay token y rol, verificar redirecciones automáticas
  if (token && userRole) {
    // 7a. Propietario/Arrendatario intentando acceder a rutas de admin
    if ((userRole === 'PROPIETARIO' || userRole === 'ARRENDATARIO') && path.startsWith('/admin')) {
      console.log('[Middleware] Propietario/Arrendatario bloqueado de admin, redirigiendo...');
      const redirectUrl = new URL('/dashboard', req.url);
      redirectUrl.searchParams.set('access_denied', 'admin');
      return NextResponse.redirect(redirectUrl);
    }

    // 7b. Admin intentando acceder a rutas exclusivas de propietario
    if (userRole === 'ADMIN') {
      const isOwnerOnlyRoute = ownerOnlyRoutes.some(route =>
        path.startsWith(route) && !path.startsWith('/admin')
      );
      if (isOwnerOnlyRoute) {
        console.log('[Middleware] Admin bloqueado de ruta propietario, redirigiendo...');
        const redirectUrl = new URL('/admin/dashboard', req.url);
        redirectUrl.searchParams.set('access_denied', 'owner');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // 7c. Verificar si necesita ser redirigido a la versión correcta de la ruta (rutas compartidas)
    const correctRoute = shouldRedirectToCorrectRoute(path, userRole);
    if (correctRoute) {
      return NextResponse.redirect(new URL(correctRoute, req.url));
    }
  }

  // 8. Si es ruta pública (login) y SÍ hay token, redirigir al dashboard correspondiente
  if (isPublicRoute && token && userRole && path === '/login') {
    const dashboardRoute = getDashboardRoute(userRole);
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  }

  // 9. Permitir que la petición continúe
  return NextResponse.next();
}

// 8. Configurar en qué rutas debe ejecutarse el Middleware
// Excluimos archivos estáticos, imágenes, API routes del sistema, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};