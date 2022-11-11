import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  user!: User;
  member: User;
  age: number;
  activeTab: TabDirective;
  messages: Message[] = [];
  @ViewChild('memberTabs', { static: false }) memberTabs?: TabsetComponent;


  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.member = user as User;
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username') as string;
    this.memberService.getMember(username).subscribe(user => {
      this.user = user;

      //display age
      if (this.user.dateOfBirth) {
        const bdate = new Date(this.user.dateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      }
    });
  }

  loadMessages() {
    const userFromLS: any = localStorage.getItem('user');
    const user = JSON.parse(userFromLS);
    this.messageService.getMessageThread(this.user.username, user.username).subscribe(m => {
      this.messages = m;
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.loadMessages();
    }
  }

  selectTab(tabId: number) {
    if (this.memberTabs?.tabs[tabId]) {
      this.memberTabs.tabs[tabId].active = true;
    }
  }

  addLike(member: User) {
    this.memberService.addLike(member.username, this.member.username).subscribe(() => {
      this.toastr.success(`you liked ${member.firstName}`);
    }, () => {
      this.toastr.error(`You Already Liked ${member.firstName}`);
    });
  }
}
