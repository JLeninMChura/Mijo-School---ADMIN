import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CategoriesService } from '../service/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-delete',
  templateUrl: './categories-delete.component.html',
  styleUrls: ['./categories-delete.component.scss']
})
export class CategoriesDeleteComponent implements OnInit {

  @Input() category: any;
  @Output() CategoryD:EventEmitter<any> = new EventEmitter();
  name:any=null;
  isLoading: Observable<boolean>;
  constructor(
    public categoryService: CategoriesService,
    public toaster: Toaster,
    public modal: NgbActiveModal,
  ) { }
  IMAGEN_PREVISUALIZA: any = './assets/media/avatars/300-6.jpg';
  ngOnInit(): void {
    this.isLoading = of(false);
    this.name = this.category.name;
  }

  delete(){
    this.categoryService.deleteCategory(this.category.id).pipe(
      catchError((error) => {
        console.error('Error:', error);
        return of(null);
      }),
      finalize(() => {
        this.isLoading = of(false);
      })
    )
    .subscribe((resp: any) => {
      this.modal.dismiss();
      this.CategoryD.emit(resp.user)
      this.toaster.open({
        text: 'Usuario Eliminado',
        caption: 'Exitoso',
        type: 'primary',
      });
    });
  }
}
