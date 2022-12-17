import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent {
  public perfilForm: FormGroup;
  public usuario?: Usuario;
  public imagenSubir?: File;
  public imgTmp: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      (resp) => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario!.nombre = nombre;
        this.usuario!.email = email;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se han guardado los cambios en tu perfil',
          icon: 'success',
          timer: 2000,
        });
      },
      (err) => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg,
          icon: 'error',
        });
      }
    );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return (this.imgTmp = '');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTmp = reader.result?.toString()!;
      console.log(reader.result);
    };
    return true;
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir!, 'usuarios', this.usuario?.uid!)
      .then((img) => {
        this.usuario!.img = img;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se ha cargado tu nueva foto de perfil',
          icon: 'success',
          timer: 2000,
        });
      })
      .catch((err) => {
        Swal.fire({
          title: '¡Error!',
          text: "No se pudo cargar la imagen",
          icon: 'error',
        });
      });
  }
}
