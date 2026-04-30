import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Definición de todas las rutas de la aplicación.
// Cada ruta asocia una URL con un componente.
// loadComponent hace "lazy loading": el componente se carga solo cuando se necesita,
// lo que mejora el rendimiento inicial de la app.
export const routes: Routes = [
  // Ruta raíz: redirige automáticamente al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Página de inicio de sesión (pública, sin protección)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Página de registro (pública, sin protección)
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },

  // Panel del médico — protegido: requiere token JWT válido
  {
    path: 'panel-medico',
    loadComponent: () => import('./pages/panel-medico/panel-medico.component').then(m => m.PanelMedicoComponent),
    canActivate: [authGuard] // El guard verifica que el usuario esté autenticado
  },

  // Panel del administrador — protegido
  {
    path: 'panel-admin',
    loadComponent: () => import('./pages/panel-admin/panel-admin.component').then(m => m.PanelAdminComponent),
    canActivate: [authGuard]
  },

  // Panel del enfermero — protegido
  {
    path: 'panel-enfermero',
    loadComponent: () => import('./pages/panel-enfermero/panel-enfermero.component').then(m => m.PanelEnfermeroComponent),
    canActivate: [authGuard]
  },

  // Comodín: cualquier URL que no coincida muestra la página 404
  {
    path: '**',
    loadComponent: () => import('./pages/error404/error404.component').then(m => m.Error404Component)
  }
];
