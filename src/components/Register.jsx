import React,  { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import AuthService from "./AuthSetvice"

function Register() {
      let [data, setData] = useState({
            email: "",
            password: "",
            confirmPassword: ""
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
            if (data.password !== data.confirmPassword) {
                  alert("Check your password, they are different")
            } else if  (data.password === data.confirmPassword) {
                  let NewData = {
                        email: data.email,
                        password: data.password
                  }
                  let res = await AuthService.register(NewData);
                  if (res === 200) {
                        alert("User succesfully register");
                        window.location.replace("/login");
                  } else {
                        alert("User don`t register, try again");
                        window.location.replace("/register");
                  }
            }
      }

      return (<div>
            <Header animation="false"/>
            <div className="Login">
                  <label type="email" for="email">Email</label>
                  <input onChange={handlleChangeInput} id="email" autocomplete="off" />
                  <label  for="password">Password</label>
                  <input onChange={handlleChangeInput}  type="password" id="password" autocomplete="off"  />
                  <label   for="password">Confirm your password</label>
                  <input onChange={handlleChangeInput} id="confirmPassword"  type="password" autocomplete="off" />
                  <button onClick={onSubmit} className="styleBth">Register</button>

            </div>
            <Footer style={{position: "fixed",
            left: "0",
            bottom: "0",
            width: "100%",
            margin: "0",
            marginTop: "20px"
            }} />
      </div>)
}

export default Register;