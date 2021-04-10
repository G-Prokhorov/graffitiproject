import React, { useEffect, useState } from "react";
import Footer from "../HeadFoot/Footer";
import Header from "../HeadFoot/Header";
import AuthService from "./AuthSetvice";

import { isEmail } from "validator";
import ErrValidator from "./Errvalidator";

import "./style.css"


function Register() {
      const [data, setData] = useState({
            email: "",
            password: "",
            confirmPassword: ""
      });

      const [state, setState] = useState({
            emailErr: {
                  valid: false,
                  visibility: false
            },
            FPasswordErr: {
                  valid: false,
                  visibility: false
            },
            SPasswordErr: {
                  valid: false,
                  visibility: false
            },
            disabled: true,
            successful: false,
            message: ""
      });


      function email(event) {
            if (!isEmail(event.target.value)) {
                  setState((prev) => {
                        return {
                              ...prev,
                              emailErr: {
                                    valid: false,
                                    visibility: true
                              }
                        }
                  })
            } else {
                  setState((prev) => {
                        return {
                              ...prev,
                              emailErr: {
                                    valid: true,
                                    visibility: false
                              }
                        }
                  })

            }
      }


      function vpassword(event) {
            let value = event.target.value;
            if (value.length < 6 || value.length > 40) {
                  setState((prev) => {
                        return {
                              ...prev,
                              FPasswordErr: {
                                    valid: false,
                                    visibility: true
                              }
                        }
                  })
            } else {
                  setState((prev) => {
                        return {
                              ...prev,
                              FPasswordErr: {
                                    valid: true,
                                    visibility: false
                              }
                        }
                  })

            }

            different(data.confirmPassword, value)

      };

      function differentpassword(event) {
            different(event.target.value, data.password)

      };

      function different(value, data) {
            if (value !== data) {
                  setState((prev) => {
                        return {
                              ...prev,
                              SPasswordErr: {
                                    valid: false,
                                    visibility: true
                              }
                        }
                  })
            } else {
                  setState((prev) => {
                        return {
                              ...prev,
                              SPasswordErr: {
                                    valid: true,
                                    visibility: false
                              }
                        }
                  })

            }
      }

      function handlleChangeInput(event) {
            let { id, value } = event.target;
            setData((prev) => {
                  return {
                        ...prev,
                        [id]: value
                  }
            })
      }

      async function onSubmit(e) {

            e.preventDefault();

            setState((prev) => {
                  return {
                        ...prev,
                        message: "",
                        successful: false
                  }
            });


            let NewData = {
                  email: data.email,
                  password: data.password
            }
            try {
                  let res = await AuthService.register(NewData);
                  if (res === 200) {
                        setState((prev) => {
                              return {
                                    ...prev,
                                    disabled: true,
                                    message: "User succesfully register",
                                    successful: true
                              }
                        })
                  } else {
                        setState((prev) => {
                              return {
                                    ...prev,
                                    disabled: true,
                                    message: "User don`t register, try again",
                                    successful: false
                              }
                        })
                  }
            } catch (err) {
                  setState((prev) => {
                        return {
                              ...prev,
                              disabled: true,
                              message: err,
                              successful: true
                        }
                  })
            }

      }





      return (<div>
            <Header animation="false" />
            <form className="Login" onSubmit={onSubmit}>
                  <label type="email" htmlFor="email">Email</label>
                  <input onChange={(event) => { handlleChangeInput(event); email(event) }} id="email" autocomplete="off" />
                  <ErrValidator visibility={state.emailErr.visibility} err="This is not a valid email." />
                  <label htmlFor="password">Password</label>
                  <input onChange={(event) => { handlleChangeInput(event); vpassword(event) }} type="password" id="password" autocomplete="off" />
                  <ErrValidator visibility={state.FPasswordErr.visibility} err="The password must be between 6 and 40 characters." />
                  <label htmlFor="password">Confirm your password</label>
                  <input onChange={(event) => { handlleChangeInput(event); differentpassword(event) }} id="confirmPassword" type="password" autocomplete="off" />
                  <ErrValidator visibility={state.SPasswordErr.visibility} err="Check your password, they are different." />
                  <button className={(state.emailErr.valid && state.FPasswordErr.valid && state.SPasswordErr.valid) ? 'styleBth' : 'btnDisabled'} type="submit" disabled={(state.emailErr.valid && state.FPasswordErr.valid && state.SPasswordErr.valid) ? false : true}>Register</button>
                  {state.message && (
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
                  )}


            </form>
      </div>)
}

export default Register;