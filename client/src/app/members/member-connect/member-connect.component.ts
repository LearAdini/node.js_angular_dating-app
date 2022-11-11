import { take } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-connect',
  templateUrl: './member-connect.component.html',
  styleUrls: ['./member-connect.component.css']
})

export class MemberConnectComponent implements OnInit {
  users: Partial<User>[] = []; // Partial make all properties of Member nullable
  @Input() member!: User;
  user: User;
  p: number;
  liked: boolean;
  whoLiked: boolean;

  constructor(private memberService: MembersService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user as User;
    });
  }

  ngOnInit() {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.user.username).subscribe(members => {
      this.liked = true;
      this.whoLiked = false;
      this.users = members;
    })
  }

  loadWhoLiked() {
    this.memberService.getWhoLiked(this.user.username).subscribe(members => {
      this.liked = false;
      this.whoLiked = true;
      this.users = members;

      console.log(members)
    })
  }

  dislike(id: any) {
    this.memberService.dislike(id).subscribe(() => {
      this.toastr.error(`Disliked User`);
      this.users.splice(this.users.findIndex(m => m._id === id), 1);
    });
  }
}
