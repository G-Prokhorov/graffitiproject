import React from "react";
import { Link } from "react-router-dom";

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
                                    <td><a href="https://www.instagram.com/g_prkhrv/">Instagram</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/#aboutMe">About me</Link></td>
                                    <td><a href="https://twitter.com/GPrkhrv?s=09">Twitter</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/#painers">Painters</Link></td>
                                    <td><a href="https://www.linkedin.com/in/gregory-prokhorov-595302201/">Linkedin</a></td>
                              </tr>
                              <tr>
                                    <td><Link to="/login">Login</Link></td>
                                    <td><a href="https://t.me/grisha_prokhorov">Telegram</a></td>
                              </tr>
                        </table>

                  </div>
            </footer>
      )
}

export default Footer;