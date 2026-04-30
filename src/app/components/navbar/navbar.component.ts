import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

// Componente de barra de navegación — reutilizable en todos los paneles.
// Muestra el logo, nombre del hospital, título/subtítulo del panel
// y el menú del usuario con opción de cerrar sesión.
@Component({
  selector: 'app-navbar',   // Se usa como <app-navbar> en los templates HTML
  standalone: true,
  imports: [CommonModule],  // CommonModule provee directivas como *ngIf
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  // @Input permite recibir datos desde el componente padre (los paneles).
  // Ejemplo de uso: <app-navbar titulo="Panel Médico"></app-navbar>
  @Input() titulo = '';      // Título principal (ej: "Panel Administrativo")
  @Input() subtitulo = '';   // Subtítulo debajo del logo (ej: "Panel Médico - SGIH")

  abierto = false; // Controla si el menú desplegable del usuario está visible

  // Obtiene el nombre del usuario desde localStorage para mostrarlo en el menú
  usuario = localStorage.getItem('usuario') || 'Usuario';

  constructor(private authService: AuthService) {}

  // Alterna la visibilidad del menú desplegable al hacer clic en el avatar
  toggleMenu(): void { this.abierto = !this.abierto; }

  // Llama al servicio de autenticación para cerrar sesión y redirigir al login
  cerrarSesion(): void { this.authService.logout(); }
}
