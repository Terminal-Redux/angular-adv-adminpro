import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HospitalesResponse } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') ?? '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  cargaHospitales(desde: number = 0) {
    // TODO: Implementar paginación
    return this.http
      .get<HospitalesResponse>(`${base_url}/hospitales`, this.headers)
      .pipe(map((resp: HospitalesResponse) => resp.hospitales));
  }

  crearHospital(nombre: string) {
    return this.http.post(`${base_url}/hospitales`, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    return this.http.put(
      `${base_url}/hospitales/${_id}`,
      { nombre },
      this.headers
    );
  }

  borrarrHospital(_id: string) {
    return this.http.delete(
      `${base_url}/hospitales/${_id}`,
      this.headers
    );
  }
}
