import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/user/service/user.service';

@Component({
  selector: 'app-tables-widget10',
  templateUrl: './tables-widget10.component.html',
})
export class TablesWidget10Component implements OnInit {
  USERS: any = [];
  isLoading: any = null;
  search: any = null;
  state: any = null;
  type_user: any = null;
  indexes: number[] = [];
  constructor(
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
    this.listUser();
  }
  listUser() {
    this.userService.listUsers(this.search, this.state, this.type_user).subscribe((resp: any) => {
      const allUsers = resp.users.data;
      const randomIndexes = this.getRandomIndexes(allUsers.length, 5);
      this.USERS = randomIndexes.map(index => allUsers[index]); 
    });
  }
  
  getRandomIndexes(max: number, count: number): number[] {
    
    while (this.indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!this.indexes.includes(randomIndex)) {
        this.indexes.push(randomIndex);
      }
    }
    return this.indexes;
  }
  
}
