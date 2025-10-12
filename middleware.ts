// middleware.ts (en la raíz del proyecto, NO dentro de src/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { shouldRedirectToCorrectRoute, getDashboardRoute } from '@/lib/utils/role-routes';

// 1. Define las rutas públicas (que NO requieren autenticación)
const publicRoutes = ['/login', '/'];

// 2. Define las rutas protegidas (que SÍ requieren autenticación)
const protectedRoutes = ['/dashboard', '/admin'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // 3. Obtener el token y el rol de las cookies
  const token = req.cookies.get('access_token')?.value;
  const userRole = req.cookies.get('user_role')?.value;
  
  // 4. Verificar si la ruta es pública o protegida
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // 5. Si es ruta protegida y NO hay token, redirigir a login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 6. Si hay token y rol, verificar redirecciones automáticas
  if (token && userRole) {
    // 6a. Verificar si necesita ser redirigido a la versión correcta de la ruta
    const correctRoute = shouldRedirectToCorrectRoute(path, userRole);
    if (correctRoute) {
      return NextResponse.redirect(new URL(correctRoute, req.url));
    }
    
    // 6b. Propietario intentando acceder a rutas de admin (que no son compartidas)
    if (userRole === 'PROPIETARIO' && path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 7. Si es ruta pública (login) y SÍ hay token, redirigir al dashboard correspondiente
  if (isPublicRoute && token && userRole && path === '/login') {
    const dashboardRoute = getDashboardRoute(userRole);
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  }

  // 8. Permitir que la petición continúe
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