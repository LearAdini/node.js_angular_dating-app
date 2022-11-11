import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Pagination } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { Observable, take } from 'rxjs'
import { User } from 'src/app/models/user';
import { MembersService } from 'src/app/services/members.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container: string = 'Unread';
  pageNumber: number = 1;
  pageSize: number = 5;
  loading: boolean = false;
  user: User;
  // member: any;
  currentUser$: Observable<User | null>;

  constructor(private messageService: MessageService,private accountService:AccountService,private memberService:MembersService,private route:ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(member => {
      this.currentUser$ = this.accountService.currentUser$;
      this.user = member as User;
    });
  }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(x => {
      // this.messages = x.result;
      // const username = this.route.snapshot.paramMap.get('username') as string;
      // this.memberService.getMember(username).subscribe(member => {
      // this.member = member;
      // });
      // this.pagination = x.pagination;
      this.loading = false;
    });
  }

  pageChanged(event: any): void {

    this.pageNumber = event.page;
    this.loadMessages();

  }
  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m._id === id), 1);
    });
  }


}
