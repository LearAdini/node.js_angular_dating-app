import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Message } from '../models/message';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationParams } from './paginationHelper';

const AUTH_API = 'http://localhost:8000/api/';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  pusher: any;
  channel: any;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true

    });

    this.channel = this.pusher.subscribe('events-channel');
  }

  private messageThreadSource$ = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource$.asObservable();

  getMessages(pageNumber: number, pageSize: number, container: string) {
    this.spinner.hide();
    let params = getPaginationParams(pageNumber, pageSize);
    params = params.append("container", container);
    return getPaginatedResult<Message[]>(`${AUTH_API}messages`, params, this.http);
  }

  getMessageThread(username: string, sender: string) {
    return this.http.get<Message[]>(`${AUTH_API}messages/thread/${username}/${sender}`,httpOptions);
  }

  sendMessage(username: string, content: string, sender: User) {
    const createMessage = { recipientUsername: username, content, senderUsername: sender.username };
    return this.http.post(AUTH_API + 'messages', createMessage,httpOptions);
  }

  deleteMessage(id: number): Observable<any> {
    console.log(id)
    return this.http.delete(`${AUTH_API}messages/${id}`,httpOptions);
  }
}
