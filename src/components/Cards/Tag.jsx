import React from "react";

import "./style.css";

function Tag(props) {
      return (
            <div className="Tag" >
                  <h3>TAG</h3>
                  <div className="OldTagImg" style={{ backgroundImage: 'url(' + props.oldTag + ')' }}></div>
                  <div className="TagImg" style={{ backgroundImage: 'url(' + props.tag + ')' }}>
                  </div>
            </div>
      )
}

export default Tag;