import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AnnonceService } from '../_services/annonce.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-board-annonceur',
  templateUrl: './board-annonceur.component.html',
  styleUrls: ['./board-annonceur.component.css']
})

export class BoardAnnonceurComponent implements OnInit {
  content?: string;

  step = 0;

  objectif = "";
  nomCampagne = "";
  urlWebsite = "";

  zone = "Monde";
  listCountries = ['France', 'Belgique', 'Espagne', 'Italie', 'Suisse'];
  targetCountry = 'France';
  listCategories = ['toutes les catégories', 'musique', 'humour', 'sport', 'cinema', 'podcast']
  targetCategory = 'toutes les catégories';
  budget = 5;

  imageAnnonce="";
  titreAnnonce="";
  descriptionAnnonce="";
  errorMessage: any;

  constructor(private userService: UserService, private annonceService: AnnonceService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.userService.getAnnonceurBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  next(nextStep: number, data?: any) {
    if (nextStep === 2) {
      if(this.nomCampagne === "") { alert('Merci de choisir un nom de campagne ')}
      else if(data === "site web" && this.urlWebsite ==="") {alert ('Merci de renseigner le site web de destination')} 
      else {this.step = nextStep; this.objectif = data;}
    }
    else if (nextStep === 4) {
      if (this.titreAnnonce === "" || this.descriptionAnnonce === "" || this.imageAnnonce === '') { alert('Merci de remplir tous les champs manquants');}
      else {
        this.publierAnnonce();
        this.step = nextStep;
      }
    }
    else {this.step = nextStep;}

  }

  back() {
    this.step --;
  }

  publierAnnonce() {
    const annonce = {
      nom_campagne: this.nomCampagne,
      createdBy: this.token.getUser().username,
      objectif: this.objectif,
      budget: this.budget,
      Zone_geo: this.zone,
      categorie_ciblage: this.targetCategory,
      image_annonce: this.imageAnnonce,
      titre_annonce: this.titreAnnonce,
      description_annonce: this.descriptionAnnonce,
      URL_annonce: this.urlWebsite,
    }
    
    this.annonceService.createAnnonce(annonce).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err.error.message);
      }
    );;
    console.log(annonce);

    this.resetData();
  }

  resetData() {
    this.nomCampagne = "";
    this.urlWebsite = "";
    this.zone = "Monde";
    this.targetCategory = 'toutes les catégories';
    this.budget = 5;
    this.imageAnnonce="";
    this.titreAnnonce="";
    this.descriptionAnnonce="";
  }

}
