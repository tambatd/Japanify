import React from "react";
import "./Player.css";
import ScrollAnimation from 'react-animate-on-scroll';

const Player = props => {
  return (
  <div>
   
    <div className="picbox">
    <br></br>
    <h1>Top Artists</h1>
    <br></br>
    <img src={props.p1} alt="Artist #1"></img>
    <img src={props.p2} alt="Artist #2"></img>
    <img src={props.p3} alt="Artist #3"></img>
    <img src={props.p4} alt="Artist #4"></img>
    <img src={props.p5} alt="Artist #5"></img>
    <img src={props.p6} alt="Artist #6"></img>
    <img src={props.p7} alt="Artist #7"></img>
    <img src={props.p8} alt="Artist #8"></img>
    <img src={props.p9} alt="Artist #9"></img>
    <img src={props.p10} alt="Artist #10"></img>
    <img src={props.p11} alt="Artist #10"></img>
    <img src={props.p12} alt="Artist #10"></img>
    </div>

      <div className="box">
      <ScrollAnimation animateIn='fadeInRight' duration={1}>
        <h1>Top Genres</h1>
        <div className="table_left">
          <br/>
          <div className="genre">
          一 {props.a1} <br></br>
          </div>
          <br/>
          <div className="genre">
          二 {props.a2} <br></br>
          </div>
          <br/>
          <div className="genre">
          三 {props.a3} <br></br>
          </div>
          <br/>
          <div className="genre">
          四 {props.a4} <br></br>
          </div>
          <br/>
          <div className="genre">
          五 {props.a5} <br></br>
          </div>
          <br/>
        </div>
        </ScrollAnimation>
      </div>
  </div>
  );
}

export default Player;