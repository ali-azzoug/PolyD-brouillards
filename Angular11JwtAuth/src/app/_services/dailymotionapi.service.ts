import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailymotionapiService {

  constructor() { }

  public queryDailymotion(query: string, maxResults?: number ) {
    let link = 'https://api.dailymotion.com/videos?fields=id%2Ctitle%2Cembed_url%2Cthumbnail_360_url%2Cdescription&page=1';
    if (query.length > 0) {
      link += '&search=' + query;
      if (maxResults) {    link += '&limit=' + maxResults?.toString(); }
      else {link += '&limit=6'; }
      return this.searchVideos(link);
    }
    else {
      return null;
    }
  }

  private searchVideos(url: string) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( 'GET', url, false); /* false for synchronous request*/
    xmlHttp.send( null );
    // return xmlHttp.responseText;
    const data = JSON.parse(xmlHttp.responseText);
    return data;

  }
}
