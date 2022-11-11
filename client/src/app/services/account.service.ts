import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from 'src/app/models/user';

const AUTH_API = 'http://localhost:8000/api/';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  private currentUserSource$ = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource$.asObservable();

  login(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'login', user, httpOptions).pipe(
      map((user: any) => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'register', {

      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      password: user.password,
      city: user.city,
      country: user.country.name

    }, httpOptions)
      .pipe(
        map((user: any) => {
          if (user) {
            this.setCurrentUser(user);
          }
          return user;
        })
      )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource$.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource$.next(null);
  }
}
