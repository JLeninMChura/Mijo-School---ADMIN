import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  @Output() UserA:EventEmitter<any> = new EventEmitter()
  name: any = null;
  surname: any = null;
  email: any = null;
  password: any = null;
  repit_password: any = null;
  IMAGEN_PREV: any = 'assets/media/avatars/300-6.jpg';
  FILE_AVATAR: any = 'null'
  role_id: any = null;

  isLoading:any;
  constructor(
    public toaster: Toaster,
    public modal: NgbActiveModal,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
  }
  processAvatar($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open({ text: 'Solamente Imagenes', caption: 'Alerta', type: 'danger' })
      return;
    }
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader;
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => this.IMAGEN_PREV = reader.result;
  }
  store() {
    if (!this.name ||
      !this.surname ||
      !this.email ||
      !this.password || !this.repit_password) {
        this.toaster.open({text:"Todos los campos son requeridos",caption:'Validaciones', type:"danger"});
        return;
    };
    if (this.password != this.repit_password) {
      this.toaster.open({text:"Las Contraseñas no coinciden",caption:'Validaciones', type:"danger"})
    }
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("role_id", this.role_id);
    formData.append("state", '1');
    if (this.role_id == 1) {
      formData.append("type_user", '2');
    } else {
      formData.append("type_user", '1');
    }
    formData.append("imagen", this.FILE_AVATAR);

    this.userService.register(formData).subscribe((resp:any)=>{
      this.toaster.open({text:"Usuario Creado Correctamente",caption:'Exitoso', type:"primary"});
      this.UserA.emit(resp.user);
      this.modal.close();
    });
  }
}
