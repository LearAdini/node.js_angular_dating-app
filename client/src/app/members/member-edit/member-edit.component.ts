import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Subscription, take } from 'rxjs';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Country } from '@angular-material-extensions/select-country';
import { ToastrService } from 'ngx-toastr';
import '../../../assets/smtp.js';
declare let Email: any;

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user!: User;
  age: number;

  @ViewChild('editForm') editForm: NgForm;

  image = '';
  @Input() requiredFileType: string;
  uploadProgress: number;
  uploadSub: Subscription;

  inputCode: boolean = false;
  resetPassword: boolean = false;
  completeReset: boolean = false;
  @ViewChild('codeEdit') codeEdit: ElementRef;
  @ViewChild('passwordEdit') passwordEdit: ElementRef;
  @ViewChild('emailEdit') emailEdit: ElementRef;
  @ViewChild('pass') pass: ElementRef;
  @ViewChild('checkPass') checkPass: ElementRef;
  @ViewChild('resetForm') resetForm: NgForm;
  code = this.generateCode(5);

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
    else if (this.resetForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService,
    private membersService: MembersService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user as User;

    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  ngAfterViewChecked() {
    this.spinner.hide();
  }

  loadMember() {
    this.membersService.getMember(this.user.username).subscribe(member => {
      this.user = member;
    });
  }

  updateMember() {
    this.membersService.updateMember(this.user).subscribe(() => {
      this.toastr.success("Profile updated successfully");
      this.editForm.reset(this.user)
    });
  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.image = file.name;
      const formData = new FormData();
      formData.append("image", file);
      formData.append("username", this.user.username);

      const upload$ = this.http.put("http://localhost:8000/api/member/upload", formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        finalize(() => this.reset())
      );
      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / 100));
          this.toastr.success("Profile image updated successfully");
        }
      })
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress == null;
    this.uploadSub == null;
    this.router.navigateByUrl('/member/edit').then(() => { window.location.reload(); });
  }

  onCountrySelected(country: Country) {
    let countryName = country.name;
    return String(countryName);
  }

  sendEmail() {
    {
      if (this.emailEdit.nativeElement.value != this.user.email) {
        this.toastr.error("Email is not valid");
        return;
      }
      Email.send({
        Host: "smtp.elasticemail.com",
        Username: "midtermiaf@gmail.com",
        Password: "52E00B422F80382C9C99D96B35209AF8E1B9",
        To: this.emailEdit.nativeElement.value.toString(),
        From: "midtermiaf@gmail.com",
        Subject: "Code For Password Reset",
        Body: "Your Code Is: " + this.code
      });
    }
    this.inputCode = true;
    this.toastr.info("Check spam mail for code, or scan the QR for code");
    //console.log(this.code); //We can console log the code. It will be used to reset password.
  }

  updatePassword() {
    if (this.pass.nativeElement.value != this.checkPass.nativeElement.value) {
      this.toastr.error("Password does not match");
      return;
    }
    else if (this.pass.nativeElement.value.length < 8 || this.pass.nativeElement.value.length < 8) {
      this.toastr.error("Password should be 8 characters at least");
      return;
    }
    else {
      this.membersService.updatePassword(this.user).subscribe(() => {
        this.toastr.success("Updated Password Successfully");
        this.resetForm.reset();
      }, () => {
        this.toastr.error("Password should be 8 characters at least");
      });
    }
  }

  editPassword() {
    this.resetPassword = !this.resetPassword;
  }

  codeCheck() {
    if (this.codeEdit.nativeElement.value.toString() != this.code.toString()) {
      this.toastr.error("Code is not valid, Check email");
      return;
    }
    else {
      this.completeReset = true;
    }
  }

  generateCode(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
