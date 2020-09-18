import React, {useState, useCallback, useEffect} from "react";
import Axios from "axios";
import Title from "./Title";
import Card from "./Card";
import {Link} from "react-router-dom";

function Painters() {
      let [array, setArray] = useState([]);
      useEffect(() => {
            Axios.get("http://localhost:8080/api/db")
            .then((res) => {
                  console.log(res.data);
                  setArray(res.data)
            })
      }, []);

      console.log(array)

      return (
            <div>
                  <Title title="Painters" />
                  <div className="container center">
                       {array.map((item, key)=>{
                             return <Link to={"/painter/" +item.nick} replace>
                                    <Card link="on" key={key} name={item.nick} />
                                    </Link>
                       })}
                    
                  </div>
            </div>
      )
}

export default Painters;