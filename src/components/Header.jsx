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
  
      useEffect(() => {
            let token = JSON.parse(localStorage.getItem('user'));
            if (token) {
                  setToken(true);
            } else {
                  setToken(false)
            }
      });
      
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
            <Link to="/"><p>Home</p></Link>
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

