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

  // Ajoute une vidéo a la playlist actuelle 
  // Il faut donner en entrée: 
  // - idPlaylist : un id de playlist (String)
  // - videoId : l'id de la video a ajouter (String)
  // - titre : le titre de la video (String)
  // - description : la description de la video (String)
  addVideoToPlaylist(data: any): Observable<any> {
    return this.http.post(baseUrl + "/addVideo", data);
  }


  // Supprime une vidéo de la playlist actuelle 
  // Il faut donner en entrée: 
  // - idPlaylist : un id de playlist
  // - videoId : l'id de la video a supprimer
  removeVideo(data: any): Observable<any> {
    return this.http.post(baseUrl + "/removeVideo", data);
  }

  // Récuperer toutes les vidéos d'une playlist
  // Il faut donner en entrée: 
  // - idPlaylist : un id de playlist
  getAllVideo(data: any): Observable<any> {
    return this.http.post(baseUrl + "/getAllVideoFromPlaylist", data);
  }

  updateName(data: any): Observable<any> {
    return this.http.post(baseUrl + "/updateName", data);
  }

  updateImage(data: any): Observable<any> {
    return this.http.post(baseUrl + "/updateImage", data);
  }

  // Supprime une playlist
  deletePlaylist(data: any): Observable<any> {
    return this.http.post(baseUrl + "/deletePlaylist", data);
  }
}
