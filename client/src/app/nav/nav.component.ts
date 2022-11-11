import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  user: User;

  currentUser$: Observable<User | null>;

  constructor(private accountService: AccountService,
    private router: Router,
    private membersService: MembersService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(member => {
      this.currentUser$ = this.accountService.currentUser$;
      this.user = member as User;

    });


  }
  loadMember() {
    this.membersService.getMember(this.user.username).subscribe(member => {
      // this.user = member;
      this.user.profile_img = member.profile_img;
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }


  login() {
    this.accountService.login(this.model).subscribe(() => {
        this.router.navigateByUrl('/members').then(() => { window.location.reload();});
        this.toastr.success(`Welcome Back ${this.user.firstName}`);
        this.spinner.hide();
      },() =>{
        this.toastr.error(`Invalid Username or Password\n Try Again...`);
      });
  }

  logout() {
    this.spinner.show();
    setTimeout(() => {
      this.accountService.logout();
      localStorage.clear();
      this.router.navigateByUrl('/home').then(() => { window.location.reload();});
    }, 1000);
  }


}

