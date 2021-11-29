import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/playlists';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  createPlaylist(data: any): Observable<any> {
    return this.http.post(baseUrl ,data);
  }

  findByUsername(data: any): Observable<any> {
    return this.http.post(baseUrl + "/findPlaylists", data);
  }

}
