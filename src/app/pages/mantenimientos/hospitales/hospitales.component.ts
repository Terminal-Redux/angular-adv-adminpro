import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTmp: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs?: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(300))
      .subscribe((img) => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargaHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTmp = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarrHospital(hospital._id!).subscribe((resp) => {
      this.cargarHospitales();
      Swal.fire('¡Borrado!', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      input: 'text',
      text: 'Ingrese el nombre del nuevo hospital',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital',
    });

    if (value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id!,
      hospital.img
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.hospitales = [...this.hospitalesTmp]);
    }
    this.busquedasService
      .buscar('hospitales', termino)
      .subscribe((resultados) => {
        this.hospitales = resultados as Hospital[];
      });
    return;
  }
}
