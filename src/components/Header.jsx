import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import AuthSetvice from "./AuthSetvice";



function Header(props) {
      const [ScrollPosition, setPosition] = useState(true);
      const handleScroll = () => {
            const position = window.pageYOffset;
            if (position === 0) {
                  setPosition(true);
            } else {
                  setPosition(false);
            }
            
        };

        let [Token, setToken] = useState(false)
      async function Start() {
            let res = await AuthSetvice.CheckToken();
            if (res === 200) {
                  setToken(true)
            }
      }

      Start();

        
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
                  paddign: "0",
                  margin:"-8px -16px",
                  marginBottom: "20px"
            }
      }


      function logout() {
            AuthSetvice.logout();
            window.location.replace("/home")
      }
      

      return (<header className="header" style={style}>
            <h1>Graffiti Kharkiv</h1>
            <Link to="/home"><p>Home</p></Link>
            <div className="divForBth">
            {Token ? 
                  <button onClick={logout}>Log out</button>
           :  <Link to="/login">
                  <button>Log in</button>
            </Link>  }
            </div>
      </header>);
}




export default Header;

