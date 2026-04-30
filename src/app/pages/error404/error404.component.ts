import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Componente de página de error 404.
// Se muestra cuando el usuario accede a una URL que no existe.
// El comodín '**' en app.routes.ts redirige aquí cualquier ruta desconocida.
@Component({
  selector: 'app-error404',
  standalone: true,
  templateUrl: './error404.component.html'
})
export class Error404Component {
  constructor(private router: Router) {}

  // Redirige al login al hacer clic en el botón "Volver al inicio"
  irLogin(): void { this.router.navigate(['/login']); }
}
