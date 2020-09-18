import React, {useState, useCallback, useEffect} from "react";



function Header(props) {const [ScrollPosition, setPosition] = useState(true);
      const handleScroll = () => {
            const position = window.pageYOffset;
            if (position === 0) {
                  setPosition(true);
            } else {
                  setPosition(false);
            }
            
        };
        
        useEffect(() => {
            window.addEventListener('scroll', handleScroll, { passive: true });
        
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
      }, []);

      let style = {}

      if (props.animation ==="true") {
            style = {
            position: "fixed",
            zIndex: 1000,
            opacity: ScrollPosition ? 0 : 1,
            visibility: ScrollPosition ? "hidden" : "visible"
      }
      } else {
            style = {
                  display: "block",
                  position: "reletive",
                  margin: "-16px",
                  marginBottom: "20px"
            }
      }


      
      

      return (<header className="header" style={style}>
            <h1>{props.name}</h1>
         
      </header>);
}




export default Header;

