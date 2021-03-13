import React from "react";

import "./style.css";


function Card(props) {
      return (
            <div style={{ display: "inline" }}>
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