// Punto de entrada principal de la aplicación Angular.
// bootstrapApplication arranca la app usando AppComponent como raíz
// y appConfig para la configuración global (rutas, HttpClient, etc.)
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Si hay un error al iniciar, lo muestra en consola
