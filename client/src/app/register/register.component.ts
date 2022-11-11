import { Country } from '@angular-material-extensions/select-country';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  validationErrors: string[] = [];
  @Output() cancelRegister = new EventEmitter<boolean>();
  maxDate: Date;
  bsConfig?: Partial<BsDatepickerConfig>;

  user!: User;

  constructor(private fb: FormBuilder,
     private router: Router,
      private accountService: AccountService,
      private toastr: ToastrService) {
    this.bsConfig = {
      containerClass: 'theme-orange',
      dateInputFormat: ' DD MMMM YYYY'
    };
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  register() {
    if (this.registerForm.get('password')?.value != this.registerForm.get('confirmPassword')?.value) {
      this.toastr.error('Password must match');
      this.cancel;
    }
    else {
      this.onCountrySelected(this.registerForm?.get('country')?.value);

      this.accountService.register(this.registerForm.value).subscribe(() => {
          this.router.navigate(['/members']);
          this.toastr.success(`Welcome ${this.registerForm?.get('firstName')?.value}`);
          //this.cancel();
        },(error) => {
          {
            // console.log('username or email already exists');
            this.toastr.error('username or email already exists')
            this.validationErrors = error;
            this.cancel;
          }
        });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }


  initializeForm() {
    this.registerForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country:new FormControl('', Validators.required),

      // photoUrl: new FormControl('')
    });

  }

  onCountrySelected(country: Country) {
    let countryName = country.name;
    return String(countryName);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      const controlToMatch = (control?.parent as FormGroup)?.controls[matchTo];
      const controlToMatchValue = controlToMatch?.value;
      return controlValue === controlToMatchValue ? null : { isMatching: true };
    }
  }
}
