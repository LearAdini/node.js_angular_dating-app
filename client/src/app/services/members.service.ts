import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from './account.service';
import { take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const AUTH_API = 'http://localhost:8000/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  users: User[] = [];
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) {
    accountService.currentUser$
      .pipe(take(1))
      .subscribe((user: any) => {
        this.user = user;
      });
  }

  addLike(targetUser: string, sourceUser: string) {
    const url = `${AUTH_API}likes/${targetUser}/${sourceUser}`;
    return this.http.post(url, {});
  }

  dislike(id: number): Observable<any> {
    console.log(id)
    return this.http.delete(`${AUTH_API}likes/${id}`);
  }
  getLikes(sourceUser: string) {
    return this.http.get<Partial<User>[]>(`${AUTH_API}likes/${sourceUser}`);
  }

  getWhoLiked(targetUser: string) {
    return this.http.get<Partial<User>[]>(`${AUTH_API}wholiked/${targetUser}`);
  }

  getMembers(): Observable<User[]> {
    if (this.users.length) {
      return of(this.users);
    }
    return this.http.get<User[]>(`${AUTH_API}members`, httpOptions).pipe(
      tap(users => this.users = users)
    )
  }

  getMember(username: string): Observable<User> {
    const member = this.users.find(x => x.username === username);
    if (member) {
      return of(member);
    }
    return this.http.get<User>(`${AUTH_API}members/${username}`, httpOptions)
  }

  updateMember(member: User) {
    return this.http.put(`${AUTH_API}member/edit`, member, httpOptions).pipe(
      tap(_ => {
        const index = this.users.findIndex(x => x.username === member.username);
        this.users[index] = member;
      })
    )
  }

  updatePassword(member: User) {
    return this.http.put(`${AUTH_API}member/edit/password`, member);
  }

  uploadPhoto(member: User) {
    return this.http.put(`${AUTH_API}member/edit`, member, httpOptions).pipe(
      tap(_ => {
        const index = this.users.findIndex(x => x.username === member.username);
        this.users[index] = member;
      })
    )
  }


  setMainPhoto(photoId: number): Observable<any> {
    return this.http.put(`${AUTH_API}members/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${AUTH_API}members/delete-photo/${photoId}`);
  }

}


