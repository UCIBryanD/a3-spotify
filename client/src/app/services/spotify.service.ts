import { ConstructorProvider, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

    const encode_res = encodeURIComponent(resource)
    var data_constructor: typeof ArtistData | typeof AlbumData | typeof TrackData;
    if (category === "artist") {data_constructor = ArtistData;}
    else if (category === "album") {data_constructor = AlbumData;}
    else if (category === "track") {data_constructor = TrackData;}
    //console.log(`/search/${category}/${encode_res}`);
    return this.sendRequestToExpress(`/search/${category}/${encode_res}`).then((data) => {
      //console.log(typeof data);
      console.log(data);
      const data_array = data[category + "s"].items;
        //console.log(data[category + "s"].items);
      const construct_array = data_array.map(obj_data => new data_constructor(obj_data));
      console.log(construct_array);
      
      return construct_array;
    });

    return null as any;
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    const encode_id = encodeURIComponent(artistId);
    return this.sendRequestToExpress("/artist/" + encode_id).then((data) => {
      return new ArtistData(data);
    });
    return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    const encode_id = encodeURIComponent(artistId);
    return this.sendRequestToExpress("/artist-top-tracks/"+ encode_id).then((data) => {
      //console.log(data);
      var data_array:Object[] = [];
      if (Object.hasOwn(data, "tracks")) {
        console.log("multi");
        data_array = data["tracks"];
      }
      else {data_array = [data]}
      console.log(data_array);

      const construct_array = data_array.map(obj_data => new TrackData(obj_data));
      return construct_array;
    });
    return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    const encode_id = encodeURIComponent(artistId);
    return this.sendRequestToExpress("/artist-albums/"+ encode_id).then((data) => {
      //console.log(data);
      const data_array = data.items;
      const construct_array = data_array.map(obj_data => new AlbumData(obj_data));
      return construct_array;
    });
    return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    const encode_id = encodeURIComponent(albumId);
    return this.sendRequestToExpress("/album/"+ encode_id).then((data) => {
      return new AlbumData(data);
    });
    return null as any;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    const encode_id = encodeURIComponent(albumId);
    return this.sendRequestToExpress("/album-tracks/"+ encode_id).then((data) => {
      console.log(data);
      const data_array = data.items;
      const construct_array = data_array.map(obj_data => new TrackData(obj_data));
      return construct_array;
    });
    return null as any;
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    const encode_id = encodeURIComponent(trackId);
    return this.sendRequestToExpress("/track/"+ encode_id).then((data) => {
      return new TrackData(data);
    });
    return null as any;
  }
}