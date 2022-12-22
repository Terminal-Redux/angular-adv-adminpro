import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTmp: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs?: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(300))
      .subscribe((img) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTmp = medicos;
    });
  }

  eliminarMedico(medico: Medico) {
    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!).subscribe((resp) => {
          this.cargarMedicos();
          Swal.fire(
            'Medico borrado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }

  async abrirSweetAlert() {/*
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear medico',
      input: 'text',
      text: 'Ingrese el nombre del nuevo medico',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del medico',
    });

    if (value!.trim().length > 0) {
      this.medicoService.crearMedico(value!).subscribe((resp: any) => {
        this.medicos.push(resp.hospital);
      });
    } */
  }

  abrirModal(hospital: Medico) {
    this.modalImagenService.abrirModal(
      'medicos',
      hospital._id!,
      hospital.img
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.medicos = [...this.medicosTmp]);
    }
    this.busquedasService.buscar('medicos', termino).subscribe((resultados) => {
      this.medicos = resultados as Medico[];
    });
    return;
  }
}
