import React from "react";

function Tag(props) {
      let style = {backgroundImage: 'url('+props.tag+')'}
      return (
            <div className="Tag" >
                  <h3>TAG</h3>
                  <div className="TagImg" style={style}>
                  </div>
            </div>
      )
}

export default Tag;