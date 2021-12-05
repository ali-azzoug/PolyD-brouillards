import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/annonces';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  constructor(private http: HttpClient) { }
/*
Créer une annonce :
Il faut donner en entrée : 
    nom_campagne: req.body.nom_campagne,
    createdBy: req.body.createdBy,
    objectif: req.body.objectif,
    budget: req.body.budget,
    zone_geo: req.body.Zone_geo,
    categorie_ciblage: req.body.categorie_ciblage,
    image_annonce: req.body.Image_annonce,
    titre_annonce: req.body.titre_annonce,
    description_annonce: req.body.description_annonce,
    URL_annonce: req.body.URL_annonce,

  Le nom des variables fournis en entrée doit etre pareil que ce qu'il y a écrit apres le req.body
*/
  createAnnonce(data: any): Observable<any> {
    return this.http.post(baseUrl ,data);
  }

}
