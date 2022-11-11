import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MessagesComponent } from './messages/messages/messages.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { GenderFilterPipe } from './pipes/genderFilter.pipe';
import { MemberConnectComponent } from './members/member-connect/member-connect.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './loading.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    RegisterComponent,
    MembersListComponent,
    MemberCardComponent,
    MemberDetailsComponent,
    MemberEditComponent,
    MessagesComponent,
    MemberMessagesComponent,
    GenderFilterPipe,
    MemberConnectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    NgxPaginationModule,
    MatSelectCountryModule.forRoot('en'),
    TabsModule.forRoot(),
    MatProgressBarModule,
    PaginationModule.forRoot(),
    ToastrModule.forRoot({positionClass: 'toast-bottom-right'}),
    QRCodeModule,
    NgxSpinnerModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

