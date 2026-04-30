import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

interface MenuItem { id: string; label: string; }

// Panel del administrador y personal administrativo.
// Gestiona citas médicas, facturación, pagos, usuarios y estadísticas del sistema.
@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './panel-admin.component.html'
})
export class PanelAdminComponent implements OnInit {
  activo = 'gestionCitas'; // Sección del menú lateral activa por defecto

  // Datos cargados desde el backend
  citas: any[]    = [];
  facturas: any[] = [];
  usuarios: any[] = [];
  estadisticas: any = null; // Objeto con conteos del sistema

  // Formulario de creación de cita médica
  formCita = { paciente_id: '', medico_id: '', fecha: '', hora: '', motivo: '', estado: 'pendiente' };

  // Formulario de creación de factura
  formFactura = { paciente_id: '', descripcion: '', total: '', estado: 'pendiente' };

  // Opciones del menú lateral
  menuItems: MenuItem[] = [
    { id: 'gestionCitas', label: '📅 Gestión de Citas' },
    { id: 'facturacion',  label: '💵 Facturación' },
    { id: 'pagos',        label: '✅ Verificar Pagos' },
    { id: 'usuarios',     label: '👥 Gestión de Usuarios' },
    { id: 'estadisticas', label: '📊 Estadísticas' }
  ];

  constructor(private api: ApiService) {}

  // Carga todos los datos necesarios al iniciar el componente
  ngOnInit(): void {
    this.cargarCitas();
    this.cargarFacturas();
    this.cargarUsuarios();
    this.cargarEstadisticas();
  }

  // Obtiene todas las citas médicas del sistema
  cargarCitas(): void {
    this.api.getCitas().subscribe({
      next: (data) => this.citas = Array.isArray(data) ? data : [],
      error: () => this.citas = []
    });
  }

  // Obtiene todas las facturas del sistema
  cargarFacturas(): void {
    this.api.getFacturas().subscribe({
      next: (data) => this.facturas = Array.isArray(data) ? data : [],
      error: () => this.facturas = []
    });
  }

  // Obtiene todos los usuarios registrados en el sistema
  cargarUsuarios(): void {
    this.api.getUsuarios().subscribe({
      next: (data) => this.usuarios = Array.isArray(data) ? data : [],
      error: () => this.usuarios = []
    });
  }

  // Obtiene las estadísticas generales del dashboard
  cargarEstadisticas(): void {
    this.api.getEstadisticas().subscribe({
      next: (data) => this.estadisticas = data,
      error: () => this.estadisticas = null
    });
  }

  // Crea una nueva cita médica y recarga la lista
  guardarCita(): void {
    this.api.createCita(this.formCita).subscribe({
      next: () => {
        this.formCita = { paciente_id: '', medico_id: '', fecha: '', hora: '', motivo: '', estado: 'pendiente' };
        this.cargarCitas();
      },
      error: (err) => alert('❌ ' + (err.error?.error || 'Error al guardar cita'))
    });
  }

  // Elimina una cita después de confirmar con el usuario
  eliminarCita(id: number): void {
    if (!confirm('¿Eliminar cita?')) return;
    this.api.deleteCita(id).subscribe({ next: () => this.cargarCitas() });
  }

  // Crea una nueva factura y recarga la lista
  guardarFactura(): void {
    this.api.createFactura(this.formFactura).subscribe({
      next: () => {
        this.formFactura = { paciente_id: '', descripcion: '', total: '', estado: 'pendiente' };
        this.cargarFacturas();
      },
      error: (err) => alert('❌ ' + (err.error?.error || 'Error al guardar factura'))
    });
  }

  // Cambia la sección activa del menú lateral
  setActivo(id: string): void { this.activo = id; }
}
