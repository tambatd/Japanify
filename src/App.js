import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as $ from "jquery";
import { authEndpoint, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import "./App.css";
import find_liked from "./song_data";
import Typewriter from 'typewriter-effect';
import ScrollAnimation from 'react-animate-on-scroll';
import { SocialIcon } from 'react-social-icons';


import "animate.css/animate.min.css";

function change(theid){
  if(!document.getElementById(theid).getAttribute("disabled")){
    let tickMark = "<svg width=\"58\" height=\"45\" viewBox=\"0 0 58 45\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#fff\" fill-rule=\"nonzero\" d=\"M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65\"/></svg>";
    document.getElementById(theid).className="button_circle";
    document.getElementById(theid).innerHTML=tickMark;
    document.getElementById(theid).setAttribute("disabled", true);
  }
}

//Spotify Client ID
const clientId = "";
//Spotify Client ID

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      pic: null,
      artists: [],
      pictures: [],
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
      uri_name: null,
      uri_screenname: null,
      song_uri: null,
      song_recc: null,
      artist_recc: null,
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.MakePlaylist = this.MakePlaylist.bind(this);
    this.addsongs = this.addsongs.bind(this);
    this.newSong = this.newSong.bind(this);
  }


  componentDidMount() {
    let genres = ["pop","idol","electro","indie", "alternative","rock","jazz","soul","melancholy","rap","punk","funk"]
    let genre_random = Math.floor(Math.random() * genres.length);
    let _token = hash.access_token;
    this.newSong(genres[genre_random]);
    if (_token) {
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
      this.getArtists(_token);
      
    }

  }


  newSong(genre){
    $.ajax({
      url: "https://api-japanify.zeet.app/users?genre="+genre,
      type: 'GET',
      success: data => {
      const random = Math.floor(Math.random() * data[0].length);
      const random2 = Math.floor(Math.random() * data[0][random].length);
      let holder = data[0][random][random2].substring(14);
      this.setState({
        song_uri: holder,
      });}   
    });
  }
  
  getCurrentlyPlaying(token) {
    $.ajax({
      url: "https://api.spotify.com/v1/me/",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }
        this.setState({
          pic: data.images[0]["url"],
          info: data.id,
          uri_screenname: data.display_name,
          no_data: false, 
        });
      }
      
    });
  }

  getArtists(token){ 
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
      type: "get",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }
        const list = Object.entries(data);
        let empty_list = [];
        let pic_list = [];
        let j;
        for (j=0; j< 12; j++){
          empty_list.push(list[0][1][j]["genres"]);
          pic_list.push(list[0][1][j]["images"][0]["url"])
        }
        let merged = [].concat.apply([], empty_list);
        for(var i = 1 ; i < merged.length ; i++){
          merged[i] = merged[i].charAt(0).toUpperCase() + merged[i].substr(1);
      }    
        this.setState({
          artists: merged,
          pictures: pic_list
        });
        let holder = find_liked(this.state.artists);
        this.setState({
          song_recc: holder[0],
          artist_recc: holder[1],
        });
      }
    })
  }

  MakePlaylist(token = this.state.token, name = this.state.info) {
    if(!document.getElementById("playlistButton").getAttribute("disabled")){
      $.ajax({
        url: "https://api.spotify.com/v1/users/"+name+"/playlists",
        type: 'POST',
        Accept: "application/json",
        contentType: 'application/json',
        data: "{\"name\":\"Japanify Recomendations\",\"description\":\"Japanese Song Recommendations from Japanify.io\",\"public\":false}",
        headers: {
          'Authorization' : 'Bearer ' + token
        },
        success: data => {
          if(!data) {
            this.setState({
              no_data: true,
            });
            return;
          }
        this.setState({
          uri_name: data.id,
        });
        this.addsongs(token,data.id,this.state.song_recc);
      }   
      });
    }
  }

  addsongs(token, id, songs){
    $.ajax({
      url: "https://api.spotify.com/v1/playlists/"+id+"/tracks?uris="+songs,
      type: 'POST',
      Accept: "application/json",
      contentType: 'application/json',
      headers: {
        'Authorization' : 'Bearer ' + token
      },
    });  
  }


  MakeChristmasPlaylist(token = this.state.token, name = this.state.info) {
    if(!document.getElementById("ChristmasplaylistButton").getAttribute("disabled")){
      $.ajax({
        url: "https://api.spotify.com/v1/users/"+name+"/playlists",
        type: 'POST',
        Accept: "application/json",
        contentType: 'application/json',
        data: "{\"name\":\"Japanify Christmas Recomendations\",\"description\":\"Japanese Song Recommendations from Japanify.io\",\"public\":false}",
        headers: {
          'Authorization' : 'Bearer ' + token
        },
        success: data => {
          if(!data) {
            this.setState({
              no_data: true,
            });
            return;
          }
        this.setState({
          uri_name: data.id,
        });
        this.addchristmassongs(token,data.id);
      }   
      });
    }
  }

  addchristmassongs(token, id){
    let songs = ["spotify:track:2PnEC9i1XzXPQ9pgXDrDoC","spotify:track:4ekBCAwWbtv3DGVi3ztptk","spotify:track:7gnAh4BMf7yRwW9xeOJ7P1","spotify:track:0mRm9OJxlTf7XNd1uT6BR5","spotify:track:0GPrenDjyHFzfzuHxmVjId","spotify:track:6yvbsI6tJD806RYo4ZVwUd","spotify:track:3KVI0WQZpi7J91dY2Zk8Im","spotify:track:478Axf2lmFeyjw3ciJRbaE","spotify:track:43GNKgH4Q1JctBl9UpZ3f8","spotify:track:1AuRdFS22hzcYLOKj24lwh","spotify:track:0hQJsmpB7k0xZavVbKJm6i","spotify:track:4O9fvCaEJYdS7Kw8XHpKE9","spotify:track:34ABWuQvfziSTKU7RgiOvC","spotify:track:7DygSbsBAtYJkX8jUhJK4c","spotify:track:3SG3geOLXNakRL1pRauoad","spotify:track:0PlPwVVrZjVMLAhWkFLGln","spotify:track:6ciOJxGSgysTcWzlxrHfZB","spotify:track:4xXu9UO2qdBotUOfqru2UC","spotify:track:66peoCswVNzE1XRJBf3g6e","spotify:track:1ABA82Cd4gYHx9E3MBwbVx","spotify:track:1C7wiSRYqIZvne0NkeCWpi","spotify:track:6h1S9GECaLgcn5Tf6sw51R","spotify:track:5Xjfm8MEqNLsudJVX63J4d","spotify:track:6uI9hCtTDmrlc4HNfwD1le","spotify:track:5aqEW82dj4vtPISiK0cdnw","spotify:track:5fsTJdrBh1NYcHqoMitlRz","spotify:track:1nl66WvIuaLjDocKYJNX2Z"]
    $.ajax({
      url: "https://api.spotify.com/v1/playlists/"+id+"/tracks?uris="+songs,
      type: 'POST',
      Accept: "application/json",
      contentType: 'application/json',
      headers: {
        'Authorization' : 'Bearer ' + token
      },
    });  
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="pink"> 
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          {!this.state.token &&(
            <h2 className="header">Japanify</h2>
          )}
          {!this.state.token &&(
            <div>
           <Typewriter options={{
            strings: ['Discover New Japanese Artists 🎨', 'Discover New Japanese Music 🎶'],
            autoStart: true,
            loop: true,
           }}/>
            <br/>
            <a className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
              Login to Spotify
            </a>
            <br/>
            <br/>
            <div id="bar"></div>
            <br></br>
            <p>Don't have a Spotify account?<br/>check out a random recommendation</p>
            <br/>
            <iframe title="spotify player" src={"https://open.spotify.com/embed/track/"+this.state.song_uri}
           width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                     <br></br>
                     <br/>
              
                     <button className="btn btn--loginApp-link" onClick={() => {window.location.reload(false)}}>New Song</button>
           
           </div>
          )}
          
          </div>
          <br></br>
          
          <br></br>
        
          {!this.state.token &&(
            
          <div className="RecomendedArtistBox">
          <h1>Artist of the day</h1>
          <br></br>
            <div className="insidebox">
            <br></br>
              <h3>RHYMESTER</h3>
              <br></br>
              <p>Jazz and Hip Hop, you couldn't ask for a better combination. The group is one of the oldest Japanese hip hop acts, having formed in 1989. They debuted on an independent label in 1993 with the EP Ore ni Iwaserya (俺に言わせりゃ), which was panned by critics</p>
              <br></br>
              <h5><i>Wikipedia</i></h5>
              <br></br>
            </div>
            <br></br>
            <iframe title = "song list" src="https://open.spotify.com/embed/album/2p05tpFTxrtPh0LcXKXxzL" width="300" height="355" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>

            <br/>
            <br/>

          </div> 
          )}

          {this.state.token &&(
           <div>
              <ScrollAnimation animateIn='fadeIn' animateOut='flipOutY' scrollableParentSelector='#root'  animateOnce={true}>
             <div>
             <br/>  
             <br/>   

              <img src={this.state.pic} alt="Avatar" className="imgcircle"></img>
              <br/>
              <h1>
              Hey {this.state.uri_screenname} <span role="img" aria-label="Wave" className="wave">
              👋</span>
              </h1>
              <br/>
              <h2>
                Let's Japanify your music!
              </h2>
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
                <div id="arrow-wrapper">
                <div className="arrow-border">
                <div className="arrow down"></div>
                <div className='pulse'></div>
                </div>
                </div>
                </ScrollAnimation>
              <br/>  
               
              <ScrollAnimation animateIn='fadeIn' animateOut='flipOutY' scrollableParentSelector='#root' animateOnce={true}>
              <Player id="parent"
                /*item={this.state.item}
                is_playing={this.state.is_playing}
                progress_ms={this.state.progress_ms}*/
                a1 = {this.state.artists[0]}
                a2 = {this.state.artists[1]}
                a3 = {this.state.artists[2]}
                a4 = {this.state.artists[3]}
                a5 = {this.state.artists[4]}
                p1 = {this.state.pictures[0]}
                p2 = {this.state.pictures[1]}
                p3 = {this.state.pictures[2]}
                p4 = {this.state.pictures[3]}
                p5 = {this.state.pictures[4]}
                p6 = {this.state.pictures[5]}
                p7 = {this.state.pictures[6]}
                p8 = {this.state.pictures[7]}
                p9 = {this.state.pictures[8]}
                p10 ={this.state.pictures[9]}
                p11 = {this.state.pictures[10]}
                p12 = {this.state.pictures[11]}/>

              <br/>  
        
              </ScrollAnimation>

          </div>)}

          {this.state.token && this.state.song_recc&&(
          <div id="test"className="coolback">
                          <SocialIcon  target="_blank" rel="noopener noreferrer" url={"https://twitter.com/intent/tweet?text=My top three genres were "+this.state.artists[0]+", "+this.state.artists[1]+", "+ "and "+this.state.artists[2]+"! Check your top genres out here:"+ " https://japanify.io/&hashtags=Japanify&target=blank&rel=noopener noreferrer"}/>

            <ScrollAnimation animateIn='fadeInLeft' duration={1}>
               <div className="RecomendedArtistBox">
            <h1>Top Recomended Artist</h1>
            <br></br>
              <div className="insidebox">
                <br></br>
                <h3>{this.state.artist_recc[0]}</h3>
                <br></br>
                <p>{this.state.artist_recc[2]}</p>
                <br></br>
                <br></br>

              </div>
              <br></br>
             
              <br></br>
              <iframe title = "song list" src={"https://open.spotify.com/embed/album/"+ this.state.artist_recc[1].substring(14)} width="300" height="355" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              <br/>
              <br/>
              <SocialIcon  target="_blank" rel="noopener noreferrer" url={"https://twitter.com/intent/tweet?text=My top recommended Japanese artist is "+this.state.artist_recc[0]+"! Check out their album here: https://open.spotify.com/album/"+ this.state.artist_recc[1].substring(14) + " https://japanify.io/&hashtags=Japanify&target=blank&rel=noopener noreferrer"}/>

            </div> 
            </ScrollAnimation>

            <ScrollAnimation animateIn='fadeIn' duration={1}>
            <div className="SongBox"> 
            <br></br>
            <br></br>
            <h1>Top Recomended Songs</h1>
            <br></br>
            <div>
              <iframe title="spotify player" src={"https://open.spotify.com/embed/track/"+this.state.song_recc[0].substring(14)} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              <br/>
              <iframe title="spotify player" src={"https://open.spotify.com/embed/track/"+this.state.song_recc[1].substring(14)} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              <br/>
              <iframe title="spotify player" src={"https://open.spotify.com/embed/track/"+this.state.song_recc[2].substring(14)} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              </div>
              <p>+27 More</p>
              
            <br></br>
            <button ref="btn" id="playlistButton" className="button3" value = "test" onClick={() =>{this.MakePlaylist(this.state.token); change("playlistButton");}}>
            Add Playlist?
            </button>
            <br></br>
            </div>
            </ScrollAnimation>
            <ScrollAnimation animateIn='fadeIn' duration={1}>
            <div className="SongBox"> 
            <br></br>
            <h1>Seasonal Recomendations</h1>
            <br></br>
            <h3><span role="img" aria-label="Christmas Tree">🎄</span> Christmas <span role="img" aria-label="Christmas Tree">🎄</span></h3>
            <br/>
<div>

              <iframe title="spotify player" src="https://open.spotify.com/embed/track/2PnEC9i1XzXPQ9pgXDrDoC" width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              <br/>
              <iframe title="spotify player" src="https://open.spotify.com/embed/track/4ekBCAwWbtv3DGVi3ztptk" width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              <br/>
              <iframe title="spotify player" src="https://open.spotify.com/embed/track/7gnAh4BMf7yRwW9xeOJ7P1" width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              </div>
              <p>+27 More</p>
            <br></br>
            <button ref="btn" id="ChristmasplaylistButton" className="button3" value = "test" onClick={() =>{this.MakeChristmasPlaylist(this.state.token); change("ChristmasplaylistButton");}}>
            Add Playlist?
            </button>
            <br></br>
            </div>
            </ScrollAnimation>
          </div>   
          )}
        
          <div className="footeronbottom">
            <table>
              <thead>
                <tr>
                <th>Info</th>
                </tr>
              </thead>
            <tbody>
              <tr>
                <td><a className="footertext" href="/about">About</a></td>
                </tr>
                <tr>
                <td><a href="https://twitter.com/iotambat">Twitter</a></td>
              </tr>
              </tbody>
            </table>
          </div>
        </header>
      </div>
    );
  }
}

class About extends Component{

  render(){
    return(
    <div className="App">
      <h2 className="header"><span role="img" aria-label="Flower">🌸</span> About Japanify.io <span role="img" aria-label="Flower">🌸</span></h2>
      <br></br>
      <Typewriter options={{
            strings: ['What is Japanify.io?', 'Is Japanify.io secure?'],
            autoStart: true,
            loop: true,
           }}/>
      <div className="RecomendedArtistBox">
      <br></br>
        <div className="insidebox">
          <h3>Japanify.io <span role="img" aria-label="Japan">🗾</span></h3>
          <br></br>
          <p>Japanify.io is a free website where you can discover new Japanese artists through your Spotify listening patterns. In addition, you can create collages of the songs you listen to the most!</p>
          <br></br>
        </div>
        <br></br>
        <br/>
        <div className="insidebox">
          <h3>security <span role="img" aria-label="Saftey">🔐</span></h3>
          <br></br>
          <p>Japanify.io does not store your data in any way. 
          In order to gain access to your spotify data, we use Spotify's token based authentication services.
          This means the data is secured by spotify;
          the only requests we make are to see your favorite artists and to allow us to make a playlist.</p>
          <br></br>
        </div>
        <br/>
        <a id="centerer" href="/">Back Home</a>
      </div> 
    </div>
    )
  }
}

const Main = props => (
  <BrowserRouter>
  <Switch>
      <Route path='/about' component={About} />
      <Route path='/' component={App} />
  </Switch>
  </BrowserRouter>
);

export default Main;