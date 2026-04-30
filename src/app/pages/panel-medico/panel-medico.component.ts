import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

// Interfaz para tipar los ítems del menú lateral
interface MenuItem { id: string; label: string; }

// Panel principal del médico.
// Contiene 6 secciones: pacientes, historia clínica, tratamientos,
// hospitalización, médicos registrados y reportes.
// Implementa OnInit para cargar datos al iniciar el componente.
@Component({
  selector: 'app-panel-medico',
  standalone: true,
  imports: [
    CommonModule,     // *ngIf, *ngFor, pipes
    FormsModule,      // [(ngModel)] para formularios
    NavbarComponent   // Barra de navegación superior
  ],
  templateUrl: './panel-medico.component.html'
})
export class PanelMedicoComponent implements OnInit {
  // Controla qué sección del menú lateral está activa
  activo = 'registroPaciente';

  // Listas de datos cargadas desde el backend
  pacientes: any[] = [];
  medicos: any[]   = [];

  // Texto de búsqueda para filtrar pacientes
  busqueda = '';

  // Objeto vinculado al formulario de registro de paciente
  formPaciente = {
    nombre: '', documento: '', edad: '', sexo: 'Masculino', telefono: '', direccion: ''
  };

  // Definición de las secciones del menú lateral
  menuItems: MenuItem[] = [
    { id: 'registroPaciente', label: '👤 Registrar / Consultar Paciente' },
    { id: 'historiaMedica',   label: '📄 Historia Clínica' },
    { id: 'tratamientos',     label: '💊 Registrar Tratamiento' },
    { id: 'hospitalizacion',  label: '🏥 Hospitalización' },
    { id: 'medicos',          label: '🩺 Médicos Registrados' },
    { id: 'reportes',         label: '📊 Reportes Médicos' }
  ];

  constructor(private api: ApiService) {}

  // ngOnInit se ejecuta automáticamente cuando el componente se carga.
  // Es el lugar correcto para hacer llamadas iniciales a la API.
  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarMedicos();
  }

  // Obtiene todos los pacientes del backend y los guarda en el arreglo local
  cargarPacientes(): void {
    this.api.getPacientes().subscribe({
      next: (data) => this.pacientes = Array.isArray(data) ? data : [],
      error: () => this.pacientes = []
    });
  }

  // Obtiene solo los usuarios con rol 'medico' para mostrarlos en la sección correspondiente
  cargarMedicos(): void {
    this.api.getUsuarios('medico').subscribe({
      next: (data) => this.medicos = Array.isArray(data) ? data : [],
      error: () => this.medicos = []
    });
  }

  // Envía el formulario al backend para crear un nuevo paciente.
  // Si es exitoso, limpia el formulario y recarga la lista.
  guardarPaciente(): void {
    this.api.createPaciente(this.formPaciente).subscribe({
      next: () => {
        // Reinicia el formulario a sus valores iniciales
        this.formPaciente = { nombre: '', documento: '', edad: '', sexo: 'Masculino', telefono: '', direccion: '' };
        this.cargarPacientes(); // Refresca la tabla
      },
      error: (err) => alert('❌ ' + (err.error?.error || 'Error al guardar'))
    });
  }

  // Muestra un diálogo de confirmación antes de eliminar el paciente
  eliminarPaciente(id: number): void {
    if (!confirm('¿Eliminar paciente?')) return;
    this.api.deletePaciente(id).subscribe({ next: () => this.cargarPacientes() });
  }

  // Busca pacientes por nombre o documento en el backend
  buscar(): void {
    if (!this.busqueda) { this.cargarPacientes(); return; } // Si está vacío, muestra todos
    this.api.getPacientes(this.busqueda).subscribe({
      next: (data) => this.pacientes = Array.isArray(data) ? data : [],
      error: () => this.pacientes = []
    });
  }

  // Cambia la sección activa del menú lateral
  setActivo(id: string): void { this.activo = id; }
}
