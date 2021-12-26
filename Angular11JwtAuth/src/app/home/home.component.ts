import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeapiService } from '../_services/youtubeapi.service';
import { DailymotionapiService } from '../_services/dailymotionapi.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { AnnonceService } from '../_services/annonce.service';
import { PlaylistService } from '../_services/playlist.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false ;
  closeResult: string = "";
  currentUser = this.tokenStorageService.getUser();
  VideoQuery = "";
  youtubeData = {items: [
    {
      id:{
        videoId: "",
      },
      snippet : {
        publishedAt: "2013-03-01T09:38:38Z", // exemple
        channelId: "",
        title: "",
        description: ""
      }
    }]};

  listeVideos : {}[] | undefined ;
  linkStart = "https://www.youtube.com/embed/"

  currentVideo: string | undefined;
  currentVideoTitle: string | undefined;
  currentVideoDescription: string | undefined;

  MyPlaylists : any;
  currentPlaylistName: string="";
  currentPlaylistId: string="";
  // currentPlaylist: Array<{videoId: string, title:string, description:string}> = []
  currentPlaylist: any;
  urlSafe: SafeResourceUrl | undefined; 

  errorMessage= "";

  constructor(
    private userService: UserService, 
    private playlistService: PlaylistService,
    private youtubeapi: YoutubeapiService,
    private dailymotionapi : DailymotionapiService,
    public sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private annonceService: AnnonceService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    if (this.currentVideo) { this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); }
    this.youtubeData = this.youtubeapi.queryYoutube("populaire", 9);
    this.listeVideos = this.youtubeData.items;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.annonceService.getAnnonce("").subscribe(
      data => {
        console.log(data[0].budget);
      },
      err => {
        console.log(JSON.parse(err.error).message);
      }
    );


    const videoDailymotion = this.dailymotionapi.queryDailymotion('football', 3);
    console.log('dailymotion ', videoDailymotion);
  }

  
  searchVideos() {
    if (this.VideoQuery === "") { console.log("aucun mot clé") }
    else {
      console.log("mot clé : ", this.VideoQuery);
      // console.log(this.youtubeapi.queryYoutube(this.VideoQuery, 9));
      this.youtubeData = this.youtubeapi.queryYoutube(this.VideoQuery, 12);
      this.listeVideos = this.youtubeData.items;

    }
  }

  watchVideo(item: {id:{videoId:string},snippet:{title:string,description:string}}) {
    this.currentVideo = "https://www.youtube.com/embed/" + item.id.videoId;
    this.currentVideoTitle = item.snippet.title;
    this.currentVideoDescription = item.snippet.description;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
  }

  // regarder une vidéo de la playlist
  watchPlaylist(video:{videoId: string, title: string, description: string}) {
    this.currentVideo = "https://www.youtube.com/embed/" + video.videoId;
    this.currentVideoTitle = video.title;
    this.currentVideoDescription = video.description;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
  }

  getThumbnails(videoId : string) {
    return "https://img.youtube.com/vi/" + videoId + "/0.jpg";
  }

/*
  addToPlaylist(videoId: string, title: string, description: string) {
    for(let i =0; i<this.currentPlaylist.length; i++){
      if(this.currentPlaylist[i].videoId === videoId){
        return
      }
    }

    this.currentPlaylist.push({videoId,title,description})

  }
*/
  addVideoToPlaylist(Playlist: any, videoId: string, title: string, description: string) {

    const data = {
      idPlaylist: Playlist._id,
      videoId:videoId,
      titre: title,
      description:description
    };

    const data2 = {
      idPlaylist: Playlist._id,
    };

    this.currentPlaylistName = Playlist.name;
    this.currentPlaylistId = Playlist._id;
    this.playlistService.addVideoToPlaylist(data).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

    // Actualise la playlist actuelle 
    this.playlistService.getAllVideo(data2).subscribe(
      data => {
        this.currentPlaylist = data;
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

  }

  removeFromPlaylist(idVideo: String) {

    const data = {
      idPlaylist: this.currentPlaylistId,
      videoId: idVideo
    };

    const data2 = {
      idPlaylist: this.currentPlaylistId,
    };

    this.playlistService.removeVideo(data).subscribe(
      data => {
        console.log(data);
        //this.currentPlaylist = data;
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );

      // Actualise la playlist actuelle 
    this.playlistService.getAllVideo(data2).subscribe(
      data => {
        this.currentPlaylist = data;
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