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
  dailymotionList: any;
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

  wantNewPlaylist = false;
  newPlaylistName = '';

  constructor(
    private userService: UserService, 
    private playlistService: PlaylistService,
    private youtubeapi: YoutubeapiService,
    private dailymotionapi: DailymotionapiService,
    public sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private annonceService: AnnonceService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    if (this.currentVideo) { this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); }
    this.youtubeData = this.youtubeapi.queryYoutube("populaire", 9);

    const dailymotionData = this.dailymotionapi.queryDailymotion("football", 6);
    this.dailymotionList = dailymotionData.list;

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

    if (!!this.tokenStorageService.getToken()) {  // if isLoggedIn
      const myaccount = { createdBy: this.currentUser.username, };
      this.playlistService.findByUsername(myaccount).subscribe(
        data => {
           this.MyPlaylists = data;
           if (this.MyPlaylists[0]) { // si l'utilisateur a créé au moins 1 playlist
            this.currentPlaylistId = this.MyPlaylists[0]._id;
            this.currentPlaylistName = this.MyPlaylists[0].name;

                // Actualise la playlist actuelle 
            this.playlistService.getAllVideo({idPlaylist: this.currentPlaylistId, }).subscribe(
              listOfVideos => { this.currentPlaylist = listOfVideos; });
           }
          });
    }

  }


  searchVideos() {
    if (this.VideoQuery === "") { console.log("aucun mot clé") }
    else {
      console.log("mot clé : ", this.VideoQuery);
      // console.log(this.youtubeapi.queryYoutube(this.VideoQuery, 9));
      this.youtubeData = this.youtubeapi.queryYoutube(this.VideoQuery, 12);
      this.listeVideos = this.youtubeData.items;

      const dailymotionData = this.dailymotionapi.queryDailymotion(this.VideoQuery, 12);
      this.dailymotionList = dailymotionData.list;
    }
  }



  watchDailymotionVideo(videoData:{Id: string, title: string, description: string, embed_url: string, thumbnail_360_url: string}): any {
    this.currentVideo = videoData.embed_url;
    this.currentVideoTitle = videoData.title;
    this.currentVideoDescription = videoData.description;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
    window.scroll(0, 0);
  }

  watchYoutubeVideo(item: {id:{videoId:string},snippet:{title:string,description:string}}) {
    this.currentVideo = "https://www.youtube.com/embed/" + item.id.videoId;
    this.currentVideoTitle = item.snippet.title;
    this.currentVideoDescription = item.snippet.description;
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
    window.scroll(100, 100);

  }

  // regarder une vidéo de la playlist
  watchPlaylist(video: {videoId: string, titre: string, description: string, source: string, embed_url: string}): void {

    if (video.source === 'dailymotion') {
      this.currentVideo = video.embed_url;
      this.currentVideoTitle = video.titre;
      this.currentVideoDescription = video.description;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
      window.scroll(0, 0);
    }

    else {

      this.currentVideo = "https://www.youtube.com/embed/" + video.videoId;
      this.currentVideoTitle = video.titre;
      this.currentVideoDescription = video.description;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo);
    }
  }

  getThumbnails(videoId : string) {
    return "https://img.youtube.com/vi/" + videoId + "/0.jpg";
  }

  switchPlaylist(): void {
    this.playlistService.getAllVideo({idPlaylist: this.currentPlaylistId, }).subscribe(
      listOfVideos => { this.currentPlaylist = listOfVideos; });
  }

  addPlaylist(): void{
    const data = {
      createdBy: this.currentUser.username,
      name: this.newPlaylistName
    };

    if (this.newPlaylistName !== '') {
        this.playlistService.createPlaylist(data).subscribe(
        data => {
          console.log(data);
          this.playlistService.findByUsername({ createdBy: this.currentUser.username, }).subscribe(
            list => {
               this.MyPlaylists = list;
            });
        },
        err => {
          this.errorMessage = err.error.message;
        }
      );
    }

    this.DecisionWantPlaylist();

  }

  addVideoToPlaylist(
    Playlist: any, videoId: string, title: string, description: string, embedUrl?: string, thumbnailUrl?: string, source?: string
    ) {

    const data = {
      idPlaylist: Playlist._id,
      videoId,
      titre: title,
      description,
      embed_url: embedUrl,
      thumbnail_url: thumbnailUrl,
      source,
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


  DecisionWantPlaylist(): void{
    this.wantNewPlaylist = ! this.wantNewPlaylist;
    this.newPlaylistName = '';
  }
}
