import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  gender: string;
  users: User[];
  // users$: Observable<User[]>;
  p: number;

  constructor(private memberService: MembersService) { }


  // this.users$ = this.memberService.getMembers();

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.memberService.getMembers().subscribe(users => {
      this.users = users;
      const userFromLS: any = localStorage.getItem('user');
      const user = JSON.parse(userFromLS);
      console.log(user.username)
      let index = this.users.findIndex(x => x.username == user.username);
      this.users.splice(index, 1);
    }
    );
  }

}
