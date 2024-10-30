import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CategoriesService } from '../service/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html',
  styleUrls: ['./categories-add.component.scss'],
})
export class CategoriesAddComponent implements OnInit {
  @Output() CategoryA: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIES: any = null;
  name: any = null;
  IMAGEN_PREVISUALIZA: any = './assets/media/svg/files/blank-image.svg';
  FILE_PORTADA: any = null;
  isLoading$: Observable<boolean>;
  selected_option: any = 1;
  category_id: any = null;
  constructor(
    public categoryService: CategoriesService,
    public toaster: Toaster,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = of(false);
  }

  processImagen($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open({
        text: 'Solo se aceptan imagenes',
        caption: 'Mensaje de validacón',
        type: 'danger',
      });
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => (this.IMAGEN_PREVISUALIZA = reader.result);
  }
  store() {
    if (this.selected_option === 1) {
      if (!this.name) {
        this.toaster.open({
          text: 'Los campos son obligatorios',
          caption: 'Validación',
          type: 'danger',
        });
        return;
      }
    }
    if (this.selected_option === 2) {
      if (!this.name || !this.category_id) {
        this.toaster.open({
          text: 'Los campos son obligatorios',
          caption: 'Validación',
          type: 'danger',
        });
        return;
      }
    }

    this.isLoading$ = of(true);

    let formData = new FormData();
    formData.append('name', this.name);
    if (this.category_id) {
      formData.append('category_id', this.category_id);
    }
    if ((this.FILE_PORTADA)) {
      formData.append('portada', this.FILE_PORTADA);
    }

    this.categoryService
      .registerCategory(formData)
      .pipe(
        catchError((error) => {
          // Maneja el error aquí si es necesario
          console.error('Error:', error);
          return of(null); // Retorna un Observable vacío
        }),
        finalize(() => {
          this.isLoading$ = of(false); // Establece isLoading$ en false cuando la solicitud finaliza
        })
      )
      .subscribe((resp: any) => {
        this.modal.dismiss();
        this.CategoryA.emit(resp.category);
        this.toaster.open({
          text: 'Categoria Creado',
          caption: 'Exitoso',
          type: 'primary',
        });
      });
  }

  selectedOption(value: number) {
    this.selected_option = value;
  }
}
