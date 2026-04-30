import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// Configuración global de la aplicación.
// Aquí se registran los servicios que estarán disponibles en toda la app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Registra el sistema de rutas con las rutas definidas en app.routes.ts
    provideRouter(routes),

    // Registra HttpClient para hacer peticiones HTTP al backend,
    // y adjunta el interceptor que agrega el token JWT automáticamente
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
