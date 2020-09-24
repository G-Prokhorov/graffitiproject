import React,  { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import AuthService from "./AuthSetvice";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from "react-validation/build/button";


import { isEmail } from "validator";


function Register() {
      const [data, setData] = useState({
            email: "",
            password: "",
            confirmPassword: ""
      });

      const [state, setState] = useState({
            successful: false,
            message: ""
      })

      function required (value){
            if (!value) {
              return (
                <div className="alert alert-danger" role="alert">
                  This field is required!
                </div>
              );
            }
          };
          
      function email (value) {
            if (!isEmail(value)) {
              return (
                <div className="alert alert-danger" role="alert">
                  This is not a valid email.
                </div>
              );
            }
            };

      function vpassword (value) {
                  if (value.length < 6 || value.length > 40) {
                    return (
                      <div className="alert alert-danger" role="alert">
                        The password must be between 6 and 40 characters.
                      </div>
                    );
                  }
                };   
      // function differentpassword (value) {
      //             if (value !== data.password) {
      //                   return (
      //                         <div className="alert alert-danger" role="alert">
      //                               Check your password, they are different.
      //                         </div>
      //                   );
      //             }
      //       };      

     
      function handlleChangeInput(event) {
            let {id, value} = event.target;
            setData((prev) => {
                  return {
                        ...prev,
                        [id] : value
                  }
            })
      }

      async function onSubmit(e) {

            e.preventDefault();

            setState({
                  message: "",
                  successful: false
            });

            
                  let NewData = {
                        email: data.email,
                        password: data.password
                  }
                  try {
                        let res = await AuthService.register(NewData);
                         if (res === 200) {
                              setState({
                                    message: "User succesfully register",
                                    successful: true })
                         } else {
                        setState({
                              message: "User don`t register, try again",
                              successful: true })
                        }
                  } catch (err) {
                        setState({
                              message: err,
                              successful: true })
                        }
                  
            }


      return (<div>
            <Header animation="false"/>
            <Form className="Login" onSubmit={onSubmit}>
                  <label type="email" for="email">Email</label>
                  <Input onChange={handlleChangeInput} id="email" autocomplete="off" validations={[required, email]}/>
                  <label  for="password">Password</label>
                  <Input onChange={handlleChangeInput}  type="password" id="password" autocomplete="off"   validations={[required, vpassword]}/>
                  {/* <label   for="password">Confirm your password</label>
                  <Input onChange={handlleChangeInput} id="confirmPassword"  type="password" autocomplete="off" validations={[required, differentpassword]} /> */}
                  <button className="styleBth" type="submit">Register</button>

                  {state.message && (
              <div className="form-group">
                <div
                  className={
                    state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {state.message}
                </div>
              </div>
            )}
            

            </Form>
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