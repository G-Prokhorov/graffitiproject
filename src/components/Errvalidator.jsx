import React from "react";

function ErrValidator(props) {
      let style = props.visibility ? {visibility: "visible", display: "block"} : {visibility: "hidden", display: "none"}

      return (
            <div style={style} className=  "alert alert-danger" role="alert">
                        {props.err}
            </div>
      )
}

export default ErrValidator;