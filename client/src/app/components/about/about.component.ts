import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { NONE_TYPE } from '@angular/compiler';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {
  name:string = "null";
  profile_pic:string = "assets/unknown.jpg";
  profile_link:string = "null";


  //TODO: inject the Spotify service
  constructor(private spotify_service:SpotifyService) { }

  ngOnInit() { }

   /*TODO: create a function which gets the "about me" information from Spotify when the button in the view is clicked.
  In that function, update the name, profile_pic, and profile_link fields */
  getUserInfo() {
    this.spotify_service.aboutMe().then((data) => {
      this.name = data.name;
      this.profile_pic = data.imageURL;
      this.profile_link = data.spotifyProfile;
    });
  }

}
