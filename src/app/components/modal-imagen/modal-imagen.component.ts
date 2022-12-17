import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent {
  public imagenSubir?: File;
  public imgTmp: string = '';

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  cerrarModal() {
    this.imgTmp = '';
    this.modalImagenService.cerrarModal();
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
    };
    return true;
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir!, tipo!, id)
      .then((img) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se ha cargado tu nueva foto de perfil',
          icon: 'success',
          timer: 2000,
        });

        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire({
          title: '¡Error!',
          text: 'No se pudo cargar la imagen',
          icon: 'error',
        });
      });
  }
}
