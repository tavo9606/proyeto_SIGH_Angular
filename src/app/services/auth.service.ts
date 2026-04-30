import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// URL base del backend Express
const API = 'http://localhost:3000';

// Servicio de autenticación.
// Centraliza toda la lógica relacionada con login, registro y sesión del usuario.
// Al usar providedIn: 'root', existe una sola instancia compartida en toda la app.
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Inyección de dependencias: HttpClient para peticiones HTTP, Router para navegar
  constructor(private http: HttpClient, private router: Router) {}

  // Envía las credenciales al backend y guarda los datos de sesión en localStorage.
  // tap() ejecuta una acción secundaria sin modificar el valor del Observable.
  login(credentials: { usuario: string; password: string; rol: string }): Observable<any> {
    return this.http.post<any>(`${API}/login`, credentials).pipe(
      tap(data => {
        // Si el login es exitoso, guarda los datos en localStorage para mantener la sesión
        localStorage.setItem('token', data.token);         // Token JWT para autenticación
        localStorage.setItem('rol', data.rol);             // Rol del usuario (médico, admin, etc.)
        localStorage.setItem('usuario', data.usuario);     // Nombre de usuario para mostrar
        localStorage.setItem('usuario_id', String(data.id)); // ID para operaciones futuras
      })
    );
  }

  // Envía los datos del nuevo usuario al backend para crear la cuenta
  registro(datos: any): Observable<any> {
    return this.http.post<any>(`${API}/registro`, datos);
  }

  // Cierra la sesión: limpia localStorage y redirige al login
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Métodos auxiliares para obtener datos de la sesión actual
  getToken(): string | null   { return localStorage.getItem('token'); }
  getRol(): string | null     { return localStorage.getItem('rol'); }
  getUsuario(): string | null { return localStorage.getItem('usuario'); }

  // Verifica si el usuario está autenticado (tiene token)
  isLoggedIn(): boolean { return !!this.getToken(); }

  // Redirige al panel correspondiente según el rol del usuario
  navegarSegunRol(rol: string): void {
    const rutas: { [key: string]: string } = {
      medico:          '/panel-medico',
      enfermero:       '/panel-enfermero',
      administrador:   '/panel-admin',
      administrativo:  '/panel-admin',
      paciente:        '/panel-admin'
    };
    this.router.navigate([rutas[rol] || '/login']);
  }
}
