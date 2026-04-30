import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL base del backend Express
const API = 'http://localhost:3000';

// Servicio de API — centraliza todas las llamadas HTTP al backend.
// Cada método retorna un Observable: Angular ejecuta la petición
// solo cuando alguien se "suscribe" con .subscribe()
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ── PACIENTES ─────────────────────────────────────────────────────────────
  // Obtiene la lista de pacientes. Si se pasa 'search', filtra por nombre o documento
  getPacientes(search?: string): Observable<any[]> {
    const url = search ? `${API}/pacientes?search=${search}` : `${API}/pacientes`;
    return this.http.get<any[]>(url);
  }
  // Crea un nuevo paciente con los datos del formulario
  createPaciente(data: any): Observable<any> { return this.http.post<any>(`${API}/pacientes`, data); }
  // Actualiza los datos de un paciente existente por su ID
  updatePaciente(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/pacientes/${id}`, data); }
  // Elimina un paciente por su ID
  deletePaciente(id: number): Observable<any> { return this.http.delete<any>(`${API}/pacientes/${id}`); }

  // ── USUARIOS ──────────────────────────────────────────────────────────────
  // Obtiene usuarios. Si se pasa 'rol', filtra por ese rol (ej: 'medico')
  getUsuarios(rol?: string): Observable<any[]> {
    const url = rol ? `${API}/usuarios?rol=${rol}` : `${API}/usuarios`;
    return this.http.get<any[]>(url);
  }

  // ── CAMAS ─────────────────────────────────────────────────────────────────
  getCamas(): Observable<any[]>                  { return this.http.get<any[]>(`${API}/camas`); }
  getCamasDisponibles(): Observable<any[]>       { return this.http.get<any[]>(`${API}/camas/disponibles`); }
  createCama(data: any): Observable<any>         { return this.http.post<any>(`${API}/camas`, data); }
  updateCama(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/camas/${id}`, data); }
  deleteCama(id: number): Observable<any>        { return this.http.delete<any>(`${API}/camas/${id}`); }

  // ── HOSPITALIZACIONES ─────────────────────────────────────────────────────
  // Al hospitalizar, el backend cambia automáticamente el estado de la cama a "ocupada"
  getHospitalizaciones(): Observable<any[]>      { return this.http.get<any[]>(`${API}/hospitalizaciones`); }
  createHospitalizacion(data: any): Observable<any> { return this.http.post<any>(`${API}/hospitalizaciones`, data); }
  updateHospitalizacion(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/hospitalizaciones/${id}`, data); }

  // ── CITAS ─────────────────────────────────────────────────────────────────
  // Soporta filtros opcionales: fecha, medico_id, paciente_id, estado
  getCitas(params?: any): Observable<any[]> {
    let query = '';
    if (params) {
      const p = new URLSearchParams(params).toString();
      query = p ? `?${p}` : '';
    }
    return this.http.get<any[]>(`${API}/citas${query}`);
  }
  createCita(data: any): Observable<any>         { return this.http.post<any>(`${API}/citas`, data); }
  updateCita(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/citas/${id}`, data); }
  deleteCita(id: number): Observable<any>        { return this.http.delete<any>(`${API}/citas/${id}`); }

  // ── MEDICAMENTOS ──────────────────────────────────────────────────────────
  // Permite buscar por nombre si se pasa el parámetro 'search'
  getMedicamentos(search?: string): Observable<any[]> {
    const url = search ? `${API}/medicamentos?search=${search}` : `${API}/medicamentos`;
    return this.http.get<any[]>(url);
  }
  createMedicamento(data: any): Observable<any>  { return this.http.post<any>(`${API}/medicamentos`, data); }
  updateMedicamento(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/medicamentos/${id}`, data); }
  deleteMedicamento(id: number): Observable<any> { return this.http.delete<any>(`${API}/medicamentos/${id}`); }

  // ── FACTURAS ──────────────────────────────────────────────────────────────
  // Soporta filtros opcionales: estado, paciente_id
  getFacturas(params?: any): Observable<any[]> {
    let query = '';
    if (params) {
      const p = new URLSearchParams(params).toString();
      query = p ? `?${p}` : '';
    }
    return this.http.get<any[]>(`${API}/facturas${query}`);
  }
  createFactura(data: any): Observable<any>      { return this.http.post<any>(`${API}/facturas`, data); }
  updateFactura(id: number, data: any): Observable<any> { return this.http.put<any>(`${API}/facturas/${id}`, data); }

  // ── HISTORIA CLÍNICA ──────────────────────────────────────────────────────
  // La historia clínica está vinculada a un paciente específico por su ID
  getHistoria(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API}/pacientes/${pacienteId}/historia`);
  }
  createHistoria(pacienteId: number, data: any): Observable<any> {
    return this.http.post<any>(`${API}/pacientes/${pacienteId}/historia`, data);
  }

  // ── TRATAMIENTOS ──────────────────────────────────────────────────────────
  // Los tratamientos también están vinculados a un paciente específico
  getTratamientos(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API}/pacientes/${pacienteId}/tratamientos`);
  }
  createTratamiento(pacienteId: number, data: any): Observable<any> {
    return this.http.post<any>(`${API}/pacientes/${pacienteId}/tratamientos`, data);
  }

  // ── ESTADÍSTICAS ──────────────────────────────────────────────────────────
  // Retorna conteos generales del sistema (pacientes, usuarios, citas, etc.)
  getEstadisticas(): Observable<any> { return this.http.get<any>(`${API}/estadisticas`); }
}
