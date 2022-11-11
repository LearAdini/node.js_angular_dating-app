import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";
import { HomeComponent } from "./home/home.component";
import { MemberConnectComponent } from "./members/member-connect/member-connect.component";
import { MemberDetailsComponent } from "./members/member-details/member-details.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MembersListComponent } from "./members/members-list/members-list.component";
import { MessagesComponent } from "./messages/messages/messages.component";
import { RegisterComponent } from "./register/register.component";
import { MemberDetailedResolver } from "./resolvers/member-detailed.resolver";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'members', component: MembersListComponent, pathMatch: 'full'
      },
      {
        path: 'members/:username',component: MemberDetailsComponent,resolve: {user: MemberDetailedResolver}
      },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: 'member/connections', component: MemberConnectComponent },
      { path: 'messages', component: MessagesComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
