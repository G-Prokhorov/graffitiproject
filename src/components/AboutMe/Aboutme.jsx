import React from "react";

import "./style.css";

import Title from "../Title/Title";
import Card from "../Cards/Card";

function Aboutme() {
      return (
            <div id={"aboutMe"}>
                  <Title title="About me" />
                  <div className="container AboutMe">
                        <div className="right">
                              <h2 style={{ fontSize: '40px' }}>Gregory Prokhorov</h2>
                              <ul>
                                    <li>18 y.o.</li>
                                    <li>Studying in KhPI</li>
                                    <li>English level: intermediate</li>
                                    <li>Love programing &#60;3</li>
                              </ul>
                              <div className="myCard">
                                    <Card name="Prkhrv" />
                              </div>
                        </div>
                        <div className="AboutMeImg"></div>
                  </div>
            </div >)
}

export default Aboutme;