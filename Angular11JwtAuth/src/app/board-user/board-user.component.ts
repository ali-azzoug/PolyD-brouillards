import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PlaylistService } from '../_services/playlist.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  currentUser: any;
  errorMessage = '';

  MyPlaylists : any;

  playlist = {
    name: ''
  };

  constructor(private userService: UserService, private playlistService: PlaylistService, private token: TokenStorageService) { }

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

}