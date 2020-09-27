import React, { useState, Component } from "react";
import Footer from "./Footer";
import AuthService from "./AuthSetvice";

function LoginPage() {
      
      let [data, setData] = useState({
            email: "",
            password: ""
      });

      const [state, setState] = useState({
            successful: false,
            message: ""
      });

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
            setState((prev) => {
                  return {...prev,
                  message: "",
                  successful: false
            }});

            try {
                  let res = await AuthService.login(data);
                  if (res) {
                        window.location.replace("/addmenu");
                  } else {
                        setState((prev) => {
                              return {...prev,
                              message: "Incorect login or password, try login again",
                              successful: false }})
                  }
            } catch (err) {
                  setState((prev) => {
                        return {...prev,
                        message: "Incorect login or password, try login again",
                        successful: false }})
            }
      }

      function Redirect() {
            window.location.replace("/register");
      }
      return (<div>
            <div className="Login">
                  <label for="email">Email</label>
                  <input onChange={handlleChangeInput} type="text" autocomplete="off" id="email"  name='email' />
                  <label for="password">Password</label>
                  <input onChange={handlleChangeInput} type="password" autocomplete="off" id="password" name='password'/>
                  <button onClick={onSubmit} className="styleBth" >Log in</button>
                  <p>OR</p>
                  <button onClick={Redirect} className="styleBth">Register</button>
                  {state.message && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {state.message}
                </div>
            )}
            
            </div>

                  <Footer style={{
                        position: "fixed",
                        left: "0",
                        bottom: "0",
                        width: "100%",
                        margin: "0",
                        marginTop: "20px"
            }} />  
            
      </div>)
}

export default LoginPage;