import { MembersService } from './../services/members.service';
import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<User> {

  constructor(private membersService:MembersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.membersService.getMember(route.paramMap.get('username') as string);
  }
}


