import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Componente de la página de registro de nuevos usuarios.
// Recopila los datos del nuevo usuario y los envía al backend.
// Si el registro es exitoso, redirige automáticamente al login.
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule, // Para *ngIf
    FormsModule   // Para [(ngModel)]
  ],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  // Todos los campos del formulario de registro vinculados con [(ngModel)]
  form = {
    nombres: '',
    cedula: '',
    usuario: '',
    email: '',
    fecha_nacimiento: '',
    rol: '',
    password: ''
  };

  error = '';        // Mensaje de error si el registro falla
  cargando = false;  // Bloquea el botón mientras se procesa la petición

  constructor(private authService: AuthService, private router: Router) {}

  // Se ejecuta al enviar el formulario
  handleSubmit(): void {
    this.error = '';
    if (!this.form.rol) { this.error = '⚠️ Debes seleccionar un rol'; return; }
    this.cargando = true;

    // Construye el objeto que se enviará al backend
    // fecha_nacimiento puede ser null si no se ingresó
    const payload = {
      usuario:          this.form.usuario,
      password:         this.form.password,
      rol:              this.form.rol,
      nombres:          this.form.nombres,
      cedula:           this.form.cedula,
      email:            this.form.email,
      fecha_nacimiento: this.form.fecha_nacimiento || null
    };

    this.authService.registro(payload).subscribe({
      next: () => {
        this.cargando = false;
        alert('✅ Usuario registrado correctamente');
        // Redirige al login para que el nuevo usuario inicie sesión
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = '❌ ' + (err.error?.error || 'Error al registrar');
      }
    });
  }

  // Navega al login si el usuario ya tiene cuenta
  irLogin(): void { this.router.navigate(['/login']); }
}
