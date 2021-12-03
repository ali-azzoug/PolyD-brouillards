import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YoutubeapiService {

  constructor() { }

  public queryYoutube(query: string, maxResults?: number ) {
    let link = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyCsYeLP_amNSnK-AejUEBmOJf2CL_J_RAU";
    if (query.length > 0) {
      link += "&q=" + query;
      if (maxResults) {    link += "&maxResults=" + maxResults?.toString();}
      return this.searchVideos(link);
    }
    else {
      return null;
    }
  }

  private searchVideos(url: string) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false); /* false for synchronous request*/
    xmlHttp.send( null );
    // return xmlHttp.responseText;
    const data = JSON.parse(xmlHttp.responseText);
    return data;

  }
}
