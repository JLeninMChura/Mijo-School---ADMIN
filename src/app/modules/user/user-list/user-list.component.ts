import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../service/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  USERS: any = [];
  isLoading: any = null;
  search: any = null;
  state: any = null;
  type_user: any = null;
  constructor(
    public modalService: NgbModal,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
    this.listUser();
  }
  listUser() {
    this.userService.listUsers(this.search, this.state, this.type_user).subscribe((resp: any) => {
      console.log(resp);
      this.USERS = resp.users.data
    })
  }
  resetFilters() {
    this.search = null;
    this.state = null;
    this.type_user = null;
    this.listUser(); 
  }
  openMosalCreateUser() {
    const modalref = this.modalService.open(UserAddComponent, { centered: true, size: 'lg' });
    modalref.componentInstance.UserA.subscribe((resp: any) => {
      this.USERS.unshift(resp);
    })
  }
  editUser(USER: any) {
    const modalref = this.modalService.open(UserEditComponent, { centered: true, size: 'lg' });
    modalref.componentInstance.user = USER;
    modalref.componentInstance.UserE.subscribe((resp: any) => {
      let index = this.USERS.findIndex((item: any) => item.id === resp.id);
      this.USERS[index] = resp;
    })
  }
  deleteUser(USER: any) {
    const modalref = this.modalService.open(UserDeleteComponent, { centered: true, size: 'md' })
    modalref.componentInstance.user = USER;
    modalref.componentInstance.UserD.subscribe((resp: any) => {
      let index = this.USERS.findIndex((item: any) => item.id === USER.id);
      this.USERS.splice(index, 1)
    })
  }
}
