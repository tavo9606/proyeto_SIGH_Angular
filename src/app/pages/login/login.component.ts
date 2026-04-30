import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Componente de la página de inicio de sesión.
// Muestra un formulario con usuario, rol y contraseña.
// Al enviarlo, llama al backend y redirige al panel según el rol.
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,  // Para usar *ngIf en el template
    FormsModule    // Para usar [(ngModel)] y vincular inputs al objeto 'form'
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Objeto que se vincula con los campos del formulario mediante [(ngModel)]
  form = { usuario: '', rol: '', password: '' };

  error = '';        // Mensaje de error que se muestra si el login falla
  cargando = false;  // Deshabilita el botón mientras espera respuesta del servidor

  constructor(private authService: AuthService, private router: Router) {}

  // Se ejecuta al enviar el formulario (evento ngSubmit)
  handleSubmit(): void {
    this.error = '';

    // Validación básica: el rol es obligatorio
    if (!this.form.rol) { this.error = '⚠️ Debes seleccionar un rol'; return; }

    this.cargando = true;

    // Llama al servicio de autenticación con los datos del formulario
    this.authService.login(this.form).subscribe({
      // Si el login es exitoso: redirige al panel correspondiente al rol
      next: (data) => {
        this.cargando = false;
        this.authService.navegarSegunRol(data.rol);
      },
      // Si hay error (credenciales incorrectas, servidor caído, etc.)
      error: (err) => {
        this.cargando = false;
        this.error = '❌ ' + (err.error?.error || 'Error al iniciar sesión');
      }
    });
  }

  // Navega a la página de registro
  irRegistro(): void { this.router.navigate(['/registro']); }
}
