import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CategoriesService } from '../service/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss'],
})
export class CategoriesEditComponent implements OnInit {
  @Output() CategoryE: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIES: any = null;
  @Input() category: any = null;
  name: any = null;
  IMAGEN_PREVISUALIZA: any = './assets/media/svg/files/blank-image.svg';
  FILE_PORTADA: any = null;
  isLoading$: Observable<boolean>;
  selected_option: any = 1;
  state:any=1;

  category_id: any = null;
  constructor(
    public categoryService: CategoriesService,
    public toaster: Toaster,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = of(false);
    this.name = this.category.name;
    this.selected_option = this.category.category_id ? 2 : 1;
    this.IMAGEN_PREVISUALIZA = this.category.imagen ? this.category.imagen:'./assets/media/svg/files/blank-image.svg';
    this.category_id = this.category.category_id;
    this.state = this.category.state;
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
    if (this.FILE_PORTADA) {
      formData.append('portada', this.FILE_PORTADA);
    }
    formData.append('state', this.state);
    this.categoryService
      .updateCategory(formData, this.category.id)
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading$ = of(false);
        })
      )
      .subscribe((resp: any) => {
        this.modal.dismiss();
        this.CategoryE.emit(resp);
        this.toaster.open({
          text: 'Categoria Actualizada',
          caption: 'Exitoso',
          type: 'primary',
        });
      });
  }

  selectedOption(value: number) {
    this.selected_option = value;
  }
}
