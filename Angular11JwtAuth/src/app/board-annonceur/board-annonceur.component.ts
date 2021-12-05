import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-annonceur',
  templateUrl: './board-annonceur.component.html',
  styleUrls: ['./board-annonceur.component.css']
})

export class BoardAnnonceurComponent implements OnInit {
  content?: string;

  step = 0;

  objectif = "";
  nomCompagne = "";
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

  constructor(private userService: UserService) { }

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
      if(this.nomCompagne === "") { alert('Merci de choisir un nom de compagne ')}
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
      nom_campagne: this.nomCompagne,
      createdBy: 'userId',
      objectif: this.objectif,
      budget: this.budget,
      zone_geo: this.zone,
      categorie_ciblage: this.targetCategory,
      image_annonce: this.imageAnnonce,
      titre_annonce: this.titreAnnonce,
      description_annonce: this.descriptionAnnonce,
      URL_annonce: this.urlWebsite,
    }
    
    console.log(annonce);

    this.resetData();
  }

  resetData() {
    this.nomCompagne = "";
    this.urlWebsite = "";
    this.zone = "Monde";
    this.targetCategory = 'toutes les catégories';
    this.budget = 5;
    this.imageAnnonce="";
    this.titreAnnonce="";
    this.descriptionAnnonce="";
  }

}
