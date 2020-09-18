import React, { useState } from "react";
import { Link } from "react-router-dom";

function Card(props) {
      // let RandomNum = Math.round(Math.random()*2);
      // console.log(RandomNum);

      // let color = ["red", "black", "green"];

      // let style = {
      //       backgroundColor: color[RandomNum]
      // }
      

      return (
           <div style={{display: "inline"}}>
            <div className="card" >
                  <h3>HELLO</h3>
                  <p>my name is</p>
                  <div className="cardName">
                        <p>{props.name}</p>
                  </div>
            </div> 
          </div> 
          
      )
}

export default Card;