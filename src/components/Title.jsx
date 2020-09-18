import React from "react";

function Title(props) {
      return (
            <div className="container title">
                  <h2>{props.title}</h2>
                  <div className="line"></div>
            </div>
      )
}

export default Title;