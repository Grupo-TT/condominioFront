// src/lib/utils/role-routes.ts

/**
 * Lista de rutas que tienen versiones diferentes para cada rol.
 * Cada ruta aquí tendrá dos versiones:
 * - ADMIN: /admin/[ruta]
 * - PROPIETARIO: /[ruta]
 * 
 * Para agregar una nueva ruta compartida, solo agrégala a este array.
 */
export const SHARED_ROUTES = [
  'dashboard',
  'perfil',
  'configuracion',
  'reportes',
  // Agrega más rutas compartidas aquí según necesites
] as const;

export type SharedRoute = typeof SHARED_ROUTES[number];

/**
 * Retorna la ruta del dashboard según el rol del usuario
 */
export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'PROPIETARIO':
      return '/dashboard';
    default:
      return '/dashboard'; // Fallback por defecto
  }
}

/**
 * Obtiene la ruta correcta para un usuario según su rol
 * @param routeName - Nombre de la ruta (sin /admin ni /)
 * @param role - Rol del usuario (ADMIN o PROPIETARIO)
 * @returns La ruta completa correcta para ese rol
 * 
 * @example
 * getCorrectRoute('dashboard', 'ADMIN') // '/admin/dashboard'
 * getCorrectRoute('perfil', 'PROPIETARIO') // '/perfil'
 */
export function getCorrectRoute(routeName: string, role: string): string {
  // Limpiar el nombre de la ruta (quitar / inicial si existe)
  const cleanRouteName = routeName.startsWith('/') ? routeName.slice(1) : routeName;
  
  // Si empieza con /admin/, extraer el nombre base
  const baseRouteName = cleanRouteName.startsWith('admin/') 
    ? cleanRouteName.slice(6) 
    : cleanRouteName;
  
  switch (role) {
    case 'ADMIN':
      return `/admin/${baseRouteName}`;
    case 'PROPIETARIO':
      return `/${baseRouteName}`;
    default:
      return `/${baseRouteName}`;
  }
}

/**
 * Verifica si una ruta es compartida (tiene versión para ambos roles)
 * @param path - Ruta completa (ej: '/dashboard' o '/admin/dashboard')
 * @returns true si la ruta está en la lista de rutas compartidas
 */
export function isSharedRoute(path: string): boolean {
  // Extraer el nombre base de la ruta
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseRouteName = cleanPath.startsWith('admin/') 
    ? cleanPath.slice(6) 
    : cleanPath;
  
  // Verificar si la ruta base está en las rutas compartidas
  return SHARED_ROUTES.includes(baseRouteName as SharedRoute);
}

/**
 * Obtiene la ruta base sin el prefijo /admin
 * @param path - Ruta completa
 * @returns Nombre base de la ruta
 * 
 * @example
 * getBaseRouteName('/admin/dashboard') // 'dashboard'
 * getBaseRouteName('/perfil') // 'perfil'
 */
export function getBaseRouteName(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath.startsWith('admin/') ? cleanPath.slice(6) : cleanPath;
}

/**
 * Verifica si un usuario debería ser redirigido a otra versión de la ruta
 * @param currentPath - Ruta actual del usuario
 * @param userRole - Rol del usuario
 * @returns La ruta a la que debería redirigirse, o null si está en la correcta
 * 
 * @example
 * shouldRedirectToCorrectRoute('/dashboard', 'ADMIN') // '/admin/dashboard'
 * shouldRedirectToCorrectRoute('/admin/perfil', 'PROPIETARIO') // '/perfil'
 * shouldRedirectToCorrectRoute('/dashboard', 'PROPIETARIO') // null (ya está correcto)
 */
export function shouldRedirectToCorrectRoute(
  currentPath: string, 
  userRole: string
): string | null {
  // Si no es una ruta compartida, no hay redirección
  if (!isSharedRoute(currentPath)) {
    return null;
  }
  
  const baseRouteName = getBaseRouteName(currentPath);
  const correctRoute = getCorrectRoute(baseRouteName, userRole);
  
  // Si ya está en la ruta correcta, no redirigir
  if (currentPath === correctRoute) {
    return null;
  }
  
  // Necesita ser redirigido
  return correctRoute;
}

/**
 * Verifica si un usuario puede acceder a una ruta específica
 */
export function canAccessRoute(userRole: string, path: string): boolean {
  // Las rutas /admin/* solo son accesibles para ADMIN
  if (path.startsWith('/admin')) {
    return userRole === 'ADMIN';
  }
  
  // Las rutas del propietario son accesibles para propietarios
  return userRole === 'PROPIETARIO' || userRole === 'ADMIN';
}

