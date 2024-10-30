import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { UserService } from '../service/user.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  @Input() user: any;
  @Output() UserD:EventEmitter<any> = new EventEmitter();
  name:any=null;
  isLoading: Observable<boolean>;
  constructor(
    public userService: UserService,
    public toaster: Toaster,
    public modal: NgbActiveModal,
  ) { }
  IMAGEN_PREVISUALIZA: any = './assets/media/avatars/300-6.jpg';
  ngOnInit(): void {
    this.isLoading = of(false);
    this.name = this.user.name;
  }
  delete(){
    this.userService.delete(this.user.id).pipe(
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
      this.UserD.emit(resp.user)
      this.toaster.open({
        text: 'Usuario Eliminado',
        caption: 'Exitoso',
        type: 'primary',
      });
    });
  }

}
