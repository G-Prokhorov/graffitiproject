import React from "react";
import { Link } from "react-router-dom";

import instagram from "../img/icon/instagram.svg"
import twitter from "../img/icon/twitter.svg"
import linkedin from "../img/icon/linkedin.svg"
import telegram from "../img/icon/telegram.svg"

import "./style.css"

function Footer(props) {
      return (
            <footer style={props.style}>
                  <div className="container">
                        <table>
                              <tr>
                                    <th><p className="LogoBreath">Graffiti project</p></th>
                                    <th><p>Social network</p></th>
                              </tr>
                              <tr>
                                    <td><Link to="/">Home</Link></td>
                                    <td><a href="https://www.instagram.com/g_prkhrv/" target="_blank"><img className="icons" src={instagram} alt="" />Instagram</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/#aboutMe">About me</Link></td>
                                    <td><a href="https://twitter.com/GPrkhrv?s=09" target="_blank"><img className="icons" src={twitter} alt="" />Twitter</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/#painers">Painters</Link></td>
                                    <td><a href="https://www.linkedin.com/in/gregory-prokhorov-595302201/" target="_blank"><img className="icons" src={linkedin} alt="" />Linkedin</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/login">Login</Link></td>
                                    <td><a href="https://t.me/grisha_prokhorov" target="_blank"><img className="icons" src={telegram} alt="" />Telegram</a></td>
                              </tr>
                        </table>

                  </div>
            </footer>
      )
}

export default Footer;