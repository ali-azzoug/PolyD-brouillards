import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeapiService } from '../_services/youtubeapi.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false ;
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

  currentPlaylist: Array<{videoId: string, title:string, description:string}> = []
  urlSafe: SafeResourceUrl | undefined; 


  constructor(
    private userService: UserService, 
    private youtubeapi: YoutubeapiService,
    public sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    ) { }

  ngOnInit(): void {
    if (this.currentVideo) { this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); }
    this.youtubeData = this.youtubeapi.queryYoutube("populaire", 9);
    this.listeVideos = this.youtubeData.items;
    this.isLoggedIn = !!this.tokenStorageService.getToken();

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

  addToPlaylist(videoId: string, title: string, description: string) {
    for(let i =0; i<this.currentPlaylist.length; i++){
      if(this.currentPlaylist[i].videoId === videoId){
        return
      }
    }

    this.currentPlaylist.push({videoId,title,description})

    

  }
  removeFromPlaylist(video:{videoId: string, title: string, description: string}) {
    for(let i =0; i<this.currentPlaylist.length; i++){
      if(this.currentPlaylist[i] === video){
        this.currentPlaylist.splice(i, 1);
      }
    }
  }


}