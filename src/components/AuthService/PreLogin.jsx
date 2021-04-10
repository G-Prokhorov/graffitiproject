import React, { useState } from "react";
import Footer from "../HeadFoot/Footer";
import AuthService from "./AuthSetvice";
import LoginPage from "./LoginPage";
import "./style.css"

function PreLogin() {
      let [Token, setToken] = useState(false)
      async function Start() {
            let res = await AuthService.CheckToken();
            if (res === 200) {
                  setToken(true)
            }
      }

      Start();

      function Redirect() {
            window.location.replace("/home");
      }

      if (!Token) {
            return <LoginPage />
      } else if (Token) {
            return <div className="Login">
                  <label >You also log in</label>
                  <button onClick={Redirect} className="styleBth">Go Home</button>
                  <Footer style={{
                        position: "fixed",
                        left: "0",
                        bottom: "0",
                        width: "100%",
                        margin: "0",
                        marginTop: "20px"
                  }} />
            </div>
      }
}

export default PreLogin