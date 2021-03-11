import React from "react";
import "./style.css";

function Title(props) {
      let blue = {
            background: "#0077E4",
            boxShadow: "0px 0px 30px rgba(0, 119, 228, 0.5)",
      }
      let orange = {
            background: "#D57400",
            boxShadow: "0px 0px 30px rgba(254, 139, 2, 0.5)",
      }

      return (
            <div className="container title">
                  <h2>{props.title}</h2>
                  <div className="line" style={props.color === "orange" ? orange : blue}></div>
            </div>
      )
}

export default Title;