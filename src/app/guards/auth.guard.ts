import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard de autenticación — actúa como un "portero" de las rutas protegidas.
// Se ejecuta antes de que el usuario pueda entrar a /panel-medico,
// /panel-admin o /panel-enfermero.
// Si el usuario no tiene token (no está autenticado), lo redirige al login.
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verifica si existe un token JWT en localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Tiene token → permite el acceso a la ruta
    return true;
  }

  // No tiene token → redirige al login y bloquea el acceso
  router.navigate(['/login']);
  return false;
};
