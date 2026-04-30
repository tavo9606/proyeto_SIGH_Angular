import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raíz de la aplicación.
// No tiene lógica propia: solo sirve como contenedor principal.
// <router-outlet> es el espacio donde Angular dibuja la página activa
// según la URL del navegador (login, panel-medico, etc.)
@Component({
  selector: 'app-root',      // Etiqueta usada en index.html: <app-root>
  standalone: true,          // Componente independiente, no necesita NgModule
  imports: [RouterOutlet],   // Importa RouterOutlet para manejar la navegación
  template: `<router-outlet></router-outlet>` // Muestra el componente de la ruta activa
})
export class AppComponent {}
