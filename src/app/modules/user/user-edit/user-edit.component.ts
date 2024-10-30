import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() user: any;
  @Output() UserE: EventEmitter<any> = new EventEmitter();

  IMAGEN_PREV: any = 'assets/media/avatars/300-6.jpg';
  FILE_AVATAR: any = 'null'
  name: any = null;
  surname: any = null;
  email: any = null;
  password: any = null;
  repit_password: any = null;
  isLoading: any;
  state: any = 1;
  is_instructor: any = null;
  profesion: any = null;
  description: any = null;
  role_id: any = null;
  
  constructor(
    public toaster: Toaster,
    public modal: NgbActiveModal,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
    console.log(this.user.role.id)
    this.name = this.user.name;
    this.IMAGEN_PREV = this.user.avatar;
    this.surname = this.user.surname;
    this.email = this.user.email;
    this.state = this.user.state;
    this.IMAGEN_PREV = this.user.avatar;
    this.is_instructor= this.user.is_instructor;
    this.profesion= this.user.profesion;
    this.description = this.user.description;
    this.role_id = this.user.role.id;
    
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
      !this.email
    ) {
      this.toaster.open({ text: "Todos los campos son requeridos", caption: 'Validaciones', type: "danger" });
      return;
    };
    if (this.password) {
      if (this.password != this.repit_password) {
        this.toaster.open({ text: "Las contraseñas no coinciden", caption: 'Validaciones', type: "danger" });
        return;
      }
    }
    if (this.password != this.repit_password) {
      this.toaster.open({ text: "Las Contraseñas no coinciden", caption: 'Validaciones', type: "danger" })
    }
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append('state', this.state);
    if (this.is_instructor) {
      formData.append('is_instructor', this.is_instructor ? '1' : '0');
      formData.append('profesion', this.profesion);
      formData.append('description', this.description);
    } 
    if (this.password) {
      formData.append('password', this.password);
    }
    if (this.FILE_AVATAR) {
      formData.append('imagen', this.FILE_AVATAR);
    }

    this.userService.update(formData, this.user.id).subscribe((resp: any) => {
      this.UserE.emit(resp.user);
      this.toaster.open({ text: "Usuario Actualizado Correctamente", caption: 'Exitoso', type: "primary" })
      this.modal.close();
    });
  }
  isInstuctor() {
    this.is_instructor = !this.is_instructor;
  }
}
