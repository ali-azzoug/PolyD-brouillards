import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PlaylistService } from '../_services/playlist.service';
import { TokenStorageService } from '../_services/token-storage.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  currentUser: any;
  errorMessage = '';
  newName: string ="";
  newUrl: string ="";

  MyPlaylists : any;

  playlist = {
    name: ''
  };

  closeResult: string = "";


  constructor(private userService: UserService, private playlistService: PlaylistService, private token: TokenStorageService,private modalService: NgbModal) { }

  ngOnInit(): void {
    //this.showPlaylists();

    this.userService.getUserBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

      // Recupere toute les playlist a l'init
    this.currentUser = this.token.getUser();
    const data = {
      createdBy: this.currentUser.username,
    };

    // console.log(data)
    this.playlistService.findByUsername(data).subscribe(
      data => {
        this.MyPlaylists = data;
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    
  }

  onClick(): void{

    this.currentUser = this.token.getUser();

    const data = {
      createdBy: this.currentUser.username,
      name: this.playlist.name
    };
    // console.log(this.currentUser.accessToken)
    this.playlistService.createPlaylist(data).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

  }

  supprimerPlaylist(idPlaylist:String): void{

    const data = {
      idPlaylist: idPlaylist,
    };

    this.playlistService.deletePlaylist(data).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      });
  }

  showPlaylists(): void{

    this.currentUser = this.token.getUser();
    const data = {
      createdBy: this.currentUser.username,
    };

    // console.log(data)
    this.playlistService.findByUsername(data).subscribe(
      data => {
        this.MyPlaylists = data;
        //this.MyPlaylists.updated = data.updated;
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

  }

  updateName(idPlaylist:String, newName:String){

    const data = {
      idPlaylist: idPlaylist,
      newName: newName
    };

    this.playlistService.updateName(data).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

  }

  updateImage(idPlaylist:String, newUrl:String){

    const data = {
      idPlaylist: idPlaylist,
      newUrl: newUrl
    };

    this.playlistService.updateImage(data).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }



  open(content:any) {

    const data = {
      createdBy: this.currentUser.username,
    };

    // console.log(data)
    this.playlistService.findByUsername(data).subscribe(
      data => {
        console.log(data);
        this.MyPlaylists = data;
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}