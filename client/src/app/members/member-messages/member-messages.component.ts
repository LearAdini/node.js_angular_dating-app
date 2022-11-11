
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { Observable, take} from 'rxjs'
import { ActivatedRoute } from '@angular/router';
import { MembersService } from 'src/app/services/members.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})

export class MemberMessagesComponent implements OnInit {
  @Input() username: string;
  @Input() messages: Message[];
  user: User;
  member: any;
  currentUser$: Observable<User | null>;
  messageContent: string;

  @ViewChild('messageForm') ngForm: NgForm;
  @ViewChild('chat') private chatContainer: ElementRef;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private memberService: MembersService,
    private spinner: NgxSpinnerService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(x => {
      this.currentUser$ = this.accountService.currentUser$;
      this.user = x as User;
    });
  }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username') as string;
    this.memberService.getMember(username).subscribe(member => {

      this.member = member;
    });

    this.messageService.channel.bind('new-message', (data: Message) => {
      console.log(data)
      this.spinner.hide();
      this.messages.push(data);

      this.ngForm.reset();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  sendMessage(form: NgForm) {
    this.messageService.sendMessage(this.username, this.messageContent, this.user)
      .subscribe((message) => {
        this.spinner.hide();
        this.messages.push(message as Message);
        form.reset();
      })
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
