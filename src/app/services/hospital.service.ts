import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') ?? '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  cargarUsuarios(desde: number = 0) {
    // TODO: Implementar paginación
    return this.http
      .get<CargarUsuarios>(`${base_url}/hospitales`, this.headers)
      .pipe(
        map((resp) => {
          const usuarios = resp.usuarios.map(
            (user) =>
              new Usuario(
                user.nombre,
                user.email,
                '',
                user.img,
                user.google,
                user.role,
                user.uid
              )
          );
          return {
            total: resp.total,
            usuarios,
          };
        })
      );
  }
}
