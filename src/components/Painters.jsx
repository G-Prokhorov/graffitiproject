import React, { useState, useEffect } from "react";
import Axios from "axios";
import Title from "./Title/Title";
import Card from "./Cards/Card";
import { Link } from "react-router-dom";

function Painters() {
      let [array, setArray] = useState([]);
      useEffect(() => {
            async function fetchData() {
                  let result = await Axios.get("http://localhost:8080/api/db");
                  setArray(result.data);
            }
            fetchData();
      }, []);

      return (
            <div id={"painers"}>
                  <Title title="Painters" color="orange" />
                  <div className="container center">
                        {array.map((item, key) => {
                              return <Link key={key} to={"/painter/" + item.nick} replace>
                                    <Card link="on" key={key} name={item.nick} />
                              </Link>
                        })}

                  </div>
            </div>
      )
}

export default Painters;