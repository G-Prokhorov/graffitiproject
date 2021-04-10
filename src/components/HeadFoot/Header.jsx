import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthSetvice from "../AuthService/AuthSetvice";

import "./style.css";


function Header(props) {
      let [Token, setToken] = useState(false)

      useEffect(() => {
            let token = JSON.parse(localStorage.getItem('user'));
            if (token) {
                  setToken(true);
            } else {
                  setToken(false);
            }
      }, []);


      function logout() {
            AuthSetvice.logout();
            window.location.replace("/home");
      }


      return (<header className="header">
            <h1>Graffiti Kharkiv</h1>
            <Link to="/"><p>Home</p></Link>
            <div className="header-right">
                  {Token ?
                        <button onClick={logout}>Log out</button>
                        : <Link to="/login">
                              <button>Log in</button>
                        </Link>
                  }
            </div>
      </header>);
}




export default Header;

