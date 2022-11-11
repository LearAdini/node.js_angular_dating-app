import { Component,  Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { take } from 'rxjs';
import { TabsetComponent } from 'ngx-tabset';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user!: User;
  member: User;
  age: number;
  @ViewChild('memberTabs', { static: false }) memberTabs?: TabsetComponent;
  activeTab: TabDirective;

  constructor(private memberService: MembersService,
    public accountService: AccountService,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.member = user as User;
    });
  }

  ngOnInit(): void {

    //display age
    if (this.user.dateOfBirth) {
      const bdate = new Date(this.user.dateOfBirth);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  addLike(user: User) {
    this.memberService.addLike(user.username, this.member.username).subscribe(() => {
      this.toastr.success(`You liked ${user.firstName}`);
    },() => {
      this.toastr.error(`You Already Liked ${user.firstName}`);
    });
  }
}
