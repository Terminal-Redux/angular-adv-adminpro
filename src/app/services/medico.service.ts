import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico, MedicosResponse } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') ?? '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  cargarMedicos(desde: number = 0) {
    // TODO: Implementar paginación
    return this.http
      .get<MedicosResponse>(`${base_url}/medicos`, this.headers)
      .pipe(map((resp: MedicosResponse) => resp.medicos));
  }

  obtenerMedicoPorId(id: string) {
    return this.http
      .get(`${base_url}/medicos/${id}`, this.headers)
      .pipe(map((resp: any) => resp.medico as Medico));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    return this.http.post(`${base_url}/medicos`, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    return this.http.put(
      `${base_url}/medicos/${medico._id}`,
      medico,
      this.headers
    );
  }

  borrarMedico(_id: string) {
    return this.http.delete(`${base_url}/medicos/${_id}`, this.headers);
  }
}
