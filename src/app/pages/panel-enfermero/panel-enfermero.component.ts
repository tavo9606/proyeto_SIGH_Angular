import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

interface MenuItem { id: string; label: string; }

// Panel del personal de enfermería.
// Gestiona el inventario de medicamentos, el estado de las camas
// y las notas de enfermería por turno.
@Component({
  selector: 'app-panel-enfermero',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './panel-enfermero.component.html'
})
export class PanelEnfermeroComponent implements OnInit {
  activo = 'medicamentos'; // Sección activa por defecto al cargar el panel

  // Listas de datos
  medicamentos: any[] = [];
  camas: any[]        = [];

  // Texto de búsqueda para filtrar medicamentos
  busquedaMed = '';

  // Formulario de registro de medicamento
  formMedicamento = { nombre: '', descripcion: '', stock: '', unidad: '', precio: '' };

  // Formulario de registro de cama hospitalaria
  formCama = { numero: '', piso: '', tipo: 'General', estado: 'disponible' };

  menuItems: MenuItem[] = [
    { id: 'medicamentos', label: '💊 Medicamentos' },
    { id: 'camas',        label: '🛏️ Gestión de Camas' },
    { id: 'notas',        label: '📝 Notas' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
    this.cargarCamas();
  }

  // Obtiene todos los medicamentos del inventario
  cargarMedicamentos(): void {
    this.api.getMedicamentos().subscribe({
      next: (data) => this.medicamentos = Array.isArray(data) ? data : [],
      error: () => this.medicamentos = []
    });
  }

  // Obtiene todas las camas registradas en el hospital
  cargarCamas(): void {
    this.api.getCamas().subscribe({
      next: (data) => this.camas = Array.isArray(data) ? data : [],
      error: () => this.camas = []
    });
  }

  // Registra un nuevo medicamento en el inventario
  guardarMedicamento(): void {
    this.api.createMedicamento(this.formMedicamento).subscribe({
      next: () => {
        this.formMedicamento = { nombre: '', descripcion: '', stock: '', unidad: '', precio: '' };
        this.cargarMedicamentos();
      },
      error: (err) => alert('❌ ' + (err.error?.error || 'Error al guardar'))
    });
  }

  // Elimina un medicamento del inventario
  eliminarMedicamento(id: number): void {
    if (!confirm('¿Eliminar medicamento?')) return;
    this.api.deleteMedicamento(id).subscribe({ next: () => this.cargarMedicamentos() });
  }

  // Registra una nueva cama en el sistema
  guardarCama(): void {
    this.api.createCama(this.formCama).subscribe({
      next: () => {
        this.formCama = { numero: '', piso: '', tipo: 'General', estado: 'disponible' };
        this.cargarCamas();
      },
      error: (err) => alert('❌ ' + (err.error?.error || 'Error al guardar'))
    });
  }

  // Elimina una cama del sistema
  eliminarCama(id: number): void {
    if (!confirm('¿Eliminar cama?')) return;
    this.api.deleteCama(id).subscribe({ next: () => this.cargarCamas() });
  }

  // Filtra medicamentos por nombre en el backend
  buscarMedicamento(): void {
    if (!this.busquedaMed) { this.cargarMedicamentos(); return; }
    this.api.getMedicamentos(this.busquedaMed).subscribe({
      next: (data) => this.medicamentos = Array.isArray(data) ? data : [],
      error: () => this.medicamentos = []
    });
  }

  setActivo(id: string): void { this.activo = id; }
}
