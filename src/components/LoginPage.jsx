import React, { useState } from "react";
import Footer from "./Footer";
import AuthService from "./AuthSetvice";

function LoginPage() {
      let [data, setData] = useState({
            email: "",
            password: ""
      })

      function handlleChangeInput(event) {
            let {id, value} = event.target;
            setData((prev) => {
                  return {
                        ...prev,
                        [id] : value
                  }
            })
      }
      
      async function onSubmit() {
            try {
                  let res = await AuthService.login(data);
                  if (res) {
                        window.location.replace("/addmenu");
                  } else {
                        alert("Incorect login or password, try login again")
                  }
            } catch (err) {
                  alert("Incorect login or password, try login again")
            }
      }

      function Redirect() {
            window.location.replace("/register");
      }

      return (<div>
            <div className="Login">
                  <label for="email">Email</label>
                  <input onChange={handlleChangeInput} type="email" value={data.login} autocomplete="off" id="email" />
                  <label for="password">Password</label>
                  <input onChange={handlleChangeInput} type="password" autocomplete="off" id="password" />
                  <button onClick={onSubmit} className="styleBth">Log in</button>
                  <p>OR</p>
                  <button onClick={Redirect} className="styleBth">Register</button>
                  <Footer style={{
                        position: "fixed",
                        left: "0",
                        bottom: "0",
                        width: "100%",
                        margin: "0",
                        marginTop: "20px"
            }} />  
            </div>
      </div>)
}

export default LoginPage;